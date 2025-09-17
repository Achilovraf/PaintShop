// handlers/products.js
const { Markup } = require("telegraf");
const { categories, products, userStates, cart } = require("../data/testData");

module.exports = (bot) => {
  // 📌 Категории
  bot.action("categories", (ctx) => {
    const keyboard = [];

    for (let i = 0; i < categories.length; i += 2) {
      const row = [];
      row.push(
        Markup.button.callback(
          categories[i].name,
          `category_${categories[i].id}`
        )
      );
      if (categories[i + 1]) {
        row.push(
          Markup.button.callback(
            categories[i + 1].name,
            `category_${categories[i + 1].id}`
          )
        );
      }
      keyboard.push(row);
    }

    keyboard.push([Markup.button.callback("🛒 Перейти в корзину", "cart")]);
    keyboard.push([Markup.button.callback("🔙 Назад", "main_menu")]);

    return ctx.editMessageText(
      "Выберите категорию:",
      Markup.inlineKeyboard(keyboard)
    );
  });

  // 📌 Вывод товаров внутри категории
  categories.forEach((cat) => {
    bot.action(`category_${cat.id}`, (ctx) => {
      const items = products.filter((p) => p.categoryId === cat.id);

      if (items.length === 0) {
        return ctx.editMessageText(
          `В категории "${cat.name}" пока нет товаров.`,
          Markup.inlineKeyboard([
            [Markup.button.callback("🔙 Назад к категориям", "categories")],
            [Markup.button.callback("🛒 Перейти в корзину", "cart")],
          ])
        );
      }

      const keyboard = [];
      for (let i = 0; i < items.length; i += 2) {
        const row = [];
        row.push(
          Markup.button.callback(items[i].name, `product_${items[i].id}`)
        );
        if (items[i + 1]) {
          row.push(
            Markup.button.callback(
              items[i + 1].name,
              `product_${items[i + 1].id}`
            )
          );
        }
        keyboard.push(row);
      }
      keyboard.push([Markup.button.callback("🛒 Перейти в корзину", "cart")]);

      return ctx.editMessageText(`Товары из категории: *${cat.name}*`, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(keyboard),
      });
    });
  });

  // 📌 Просмотр товара
  bot.action(/product_(\d+)/, (ctx) => {
    const productId = parseInt(ctx.match[1]);
    const product = products.find((p) => p.id === productId);

    if (!product) return ctx.answerCbQuery("Товар не найден");

    const userId = ctx.from.id;
    if (!userStates.has(userId)) {
      userStates.set(userId, {});
    }
    userStates.get(userId)[productId] = { quantity: "" };

    return renderProduct(ctx, productId);
  });

  // 📌 Набор количества (как калькулятор)
  bot.action(/qty_(\d+)_(\d+)/, async (ctx) => {
    const productId = parseInt(ctx.match[1]);
    const digit = ctx.match[2]; // цифра как строка
    const userId = ctx.from.id;

    if (!userStates.has(userId) || !userStates.get(userId)[productId]) {
      userStates.set(userId, { [productId]: { quantity: "" } });
    }

    let current = userStates.get(userId)[productId].quantity || "";
    userStates.get(userId)[productId].quantity = current + digit;

    await ctx.answerCbQuery(
      `Выбрано: ${userStates.get(userId)[productId].quantity}`
    );

    return renderProduct(ctx, productId);
  });

  // 📌 Очистка количества
  bot.action(/remove_(\d+)/, async (ctx) => {
    const productId = parseInt(ctx.match[1]);
    const userId = ctx.from.id;

    if (userStates.has(userId) && userStates.get(userId)[productId]) {
      userStates.get(userId)[productId].quantity = "";
    }

    await ctx.answerCbQuery("Количество сброшено");
    return renderProduct(ctx, productId);
  });

  // 📌 Добавление в корзину
  bot.action(/add_to_cart_(\d+)/, (ctx) => {
    const productId = parseInt(ctx.match[1]);
    const userId = ctx.from.id;

    const userState = userStates.get(userId);
    if (!userState || !userState[productId] || !userState[productId].quantity) {
      return ctx.answerCbQuery("Выберите количество больше 0");
    }

    const quantity = parseInt(userState[productId].quantity, 10);
    const product = products.find((p) => p.id === productId);

    if (!cart.has(userId)) {
      cart.set(userId, []);
    }

    const userCart = cart.get(userId);
    const existingItem = userCart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.push({
        productId,
        productName: product.name,
        price: product.price,
        quantity,
        bonus: product.bonus,
      });
    }

    ctx.answerCbQuery(`Добавлено в корзину: ${quantity} шт.`);
    delete userState[productId];

    return ctx.editMessageText(
      "Товар добавлен в корзину!",
      Markup.inlineKeyboard([
        [Markup.button.callback("🛒 Перейти в корзину", "cart")],
        [Markup.button.callback("📁 Продолжить покупки", "categories")],
        [Markup.button.callback("🔙 Главное меню", "main_menu")],
      ])
    );
  });

  // Пустая кнопка "Выбрано"
  bot.action("quantity_display", (ctx) => ctx.answerCbQuery(""));
};

// 📌 Вспомогательная функция рендера карточки товара
function renderProduct(ctx, productId) {
  const product = products.find((p) => p.id === productId);
  const userId = ctx.from.id;
  const quantity = userStates.get(userId)[productId]?.quantity || "" || "0";

  const bonusInfo = product.hasBonus
    ? `⭐ Этот продукт имеет бонус:\nЧем больше покупаете, тем больше бонус.\n⭐ Bonus: ${product.bonus}`
    : "⭐ Bonus: 0";

  const message = `📦 Имя: ${product.name}\n💲 Цена: ${product.price} сум\n\n${bonusInfo}`;

  const keyboard = [
    [Markup.button.callback(`Выбрано: ${quantity}`, "quantity_display")],
    [
      Markup.button.callback("1", `qty_${productId}_1`),
      Markup.button.callback("2", `qty_${productId}_2`),
      Markup.button.callback("3", `qty_${productId}_3`),
    ],
    [
      Markup.button.callback("4", `qty_${productId}_4`),
      Markup.button.callback("5", `qty_${productId}_5`),
      Markup.button.callback("6", `qty_${productId}_6`),
    ],
    [
      Markup.button.callback("7", `qty_${productId}_7`),
      Markup.button.callback("8", `qty_${productId}_8`),
      Markup.button.callback("9", `qty_${productId}_9`),
    ],
    [
      Markup.button.callback("0", `qty_${productId}_0`),
      Markup.button.callback("❌ Удалить", `remove_${productId}`),
    ],
    [
      Markup.button.callback(
        "📦 Добавить в корзину",
        `add_to_cart_${productId}`
      ),
    ],
    [Markup.button.callback("🔙 Назад", `category_${product.categoryId}`)],
  ];

  return ctx.editMessageText(message, Markup.inlineKeyboard(keyboard));
}
