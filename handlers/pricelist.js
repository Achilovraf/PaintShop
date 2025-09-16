const { Markup } = require("telegraf");
const path = require("path");
const fs = require("fs");
const { products } = require("../data/testData");
const { formatPrice } = require("../utils/helpers");

module.exports = (bot) => {
  bot.action("price_list", async (ctx) => {
    try {
      let message = `📄 Прайс-лист: 10/${products.length}\n\n`;

      products.slice(0, 10).forEach((item, index) => {
        const bonusIcon = item.hasBonus ? "✅" : "❌";
        message += `${index + 1}. ${item.name}. ${formatPrice(
          item.price
        )} сум - Бонус ${bonusIcon}\n`;
      });

      const keyboard = [
        [
          Markup.button.callback("⬅️", "price_prev"),
          Markup.button.callback("🔙 Назад", "main_menu"),
          Markup.button.callback("➡️", "price_next"),
        ],
      ];

      keyboard.push([
        Markup.button.callback(
          "📥 Прайс-лист.xlsx - Загрузить",
          "download_excel"
        ),
      ]);

      return ctx.editMessageText(message, Markup.inlineKeyboard(keyboard));
    } catch (err) {
      console.error("Ошибка при показе прайс-листа:", err);
      return ctx.editMessageText(
        "❌ Ошибка загрузки прайс-листа",
        Markup.inlineKeyboard([
          [Markup.button.callback("🔙 Назад", "main_menu")],
        ])
      );
    }
  });

  // Скачивание Excel файла
  bot.action("download_excel", async (ctx) => {
    try {
      await ctx.answerCbQuery("📥 Отправляю файл...");

      // Путь к файлу
      const filePath = path.join(__dirname, "../data/pricelist.xlsx");

      // Проверяем существование файла
      if (fs.existsSync(filePath)) {
        // Отправляем существующий файл
        await ctx.replyWithDocument(
          { source: filePath },
          {
            caption: "📄 Актуальный прайс-лист",
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("🔙 К прайс-листу", "price_list")],
            ]),
          }
        );
      } else {
        // Если файла нет, создаем текстовый файл на лету
        const textContent = generatePriceListText();

        await ctx.replyWithDocument(
          {
            source: Buffer.from(textContent, "utf8"),
            filename: "pricelist.txt",
          },
          {
            caption: "📄 Прайс-лист (текстовый формат)",
            reply_markup: Markup.inlineKeyboard([
              [Markup.button.callback("🔙 К прайс-листу", "price_list")],
            ]),
          }
        );
      }
    } catch (err) {
      console.error("Ошибка при отправке файла:", err);
      await ctx.answerCbQuery("❌ Ошибка при отправке файла");
    }
  });

  // Навигация по прайс-листу
  bot.action("price_prev", (ctx) => {
    return ctx.answerCbQuery("⬅️ Это первая страница");
  });

  bot.action("price_next", (ctx) => {
    return ctx.answerCbQuery("➡️ Показаны все товары");
  });
};

// Функция для генерации текстового прайс-листа
function generatePriceListText() {
  let content = "ПРАЙС-ЛИСТ СТРОИТЕЛЬНЫХ МАТЕРИАЛОВ\n";
  content += "=".repeat(50) + "\n\n";

  const { categories, products } = require("../data/testData");

  categories.forEach((category) => {
    const categoryProducts = products.filter(
      (p) => p.categoryId === category.id
    );

    if (categoryProducts.length > 0) {
      content += `${category.name}\n`;
      content += "-".repeat(category.name.length) + "\n";

      categoryProducts.forEach((product, index) => {
        const bonusText = product.hasBonus ? ` (Бонус: ${product.bonus})` : "";
        content += `${index + 1}. ${
          product.name
        } - ${product.price.toLocaleString()} сум${bonusText}\n`;
      });

      content += "\n";
    }
  });

  content += "\nДата создания: " + new Date().toLocaleString("ru-RU");
  content += "\nТелефон для заказов: 93 007-07-06";

  return content;
}
