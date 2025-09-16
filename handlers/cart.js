// handlers/cart.js
const { Markup } = require("telegraf");
const { cart, orders, getNextOrderId } = require("../data/testData");
const { formatPrice } = require("../utils/helpers");

module.exports = (bot) => {
  bot.action("cart", (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userCart = cart.get(userId) || [];

    if (userCart.length === 0) {
      return ctx.editMessageText(
        "Ваша корзина пуста",
        Markup.inlineKeyboard([
          [Markup.button.callback("📁 Категории", "categories")],
          [Markup.button.callback("🔙 Назад", "main_menu")],
        ])
      );
    }

    let message = "📋 Список заказа:\n\n";
    let totalPrice = 0;
    let bonusSum = 0;

    userCart.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      message += `➡️ ${item.productName} - ${item.quantity} x ${formatPrice(
        item.price
      )} = ${formatPrice(itemTotal)} сум\n`;
      totalPrice += itemTotal;
      if (item.bonus > 0) bonusSum += item.bonus * item.quantity;
    });

    message += `\n💰 Общая сумма: ${formatPrice(totalPrice)} сум\n`;
    message += `💰 Сумма бонуса: ${formatPrice(bonusSum)} сум`;

    const keyboard = [
      [Markup.button.callback("✅ Подтверждение", "confirm_order")],
      [Markup.button.callback("🔙 Назад", "main_menu")],
    ];

    return ctx.editMessageText(message, Markup.inlineKeyboard(keyboard));
  });

  bot.action("confirm_order", (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userCart = cart.get(userId) || [];
    if (userCart.length === 0) return ctx.answerCbQuery("Корзина пуста");

    const orderId = getNextOrderId();
    const totalPrice = userCart.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );
    const bonusAmount = userCart.reduce(
      (sum, i) => sum + i.bonus * i.quantity,
      0
    );

    if (!orders.has(userId)) {
      orders.set(userId, []);
    }

    orders.get(userId).push({
      id: orderId,
      items: [...userCart],
      totalPrice,
      bonusAmount,
      botBonus: 0,
      status: "pending",
      createdAt: new Date().toLocaleString("ru-RU"),
      updatedAt: new Date().toLocaleString("ru-RU"),
    });

    cart.set(userId, []);

    return ctx.editMessageText(
      "✅ Заказ подтвержден!",
      Markup.inlineKeyboard([
        [Markup.button.callback("🔙 Главное меню", "main_menu")],
      ])
    );
  });
};
