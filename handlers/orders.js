const { Markup } = require("telegraf");
const { orders } = require("../data/testData");
const { formatPrice } = require("../utils/helpers");

module.exports = (bot) => {
  bot.action("my_orders", (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userOrders = orders.get(userId) || [];

    if (userOrders.length === 0) {
      return ctx.editMessageText(
        "У вас пока нет заказов",
        Markup.inlineKeyboard([
          [Markup.button.callback("📁 Категории", "categories")],
          [Markup.button.callback("🔙 Назад", "main_menu")],
        ])
      );
    }

    // Показываем последний заказ
    const order = userOrders[userOrders.length - 1];

    const statusNames = {
      pending: "Ожидает обработки",
      delivered: "Доставлено",
      cancelled: "Отменен",
      processing: "В обработке",
    };

    const message =
      `📋 Заказ #${order.id}\n\n` +
      `📊 Товаров в заказе: ${order.items.length}\n` +
      `💰 Общая сумма: ${formatPrice(order.totalPrice)} сум\n` +
      `⭐ Бонус: ${formatPrice(order.bonusAmount)} сум\n\n` +
      `📦 Статус: ${statusNames[order.status] || order.status}\n` +
      `🗓️ Создан: ${order.createdAt}\n` +
      `🔄 Обновлен: ${order.updatedAt}`;

    const keyboard = [
      [Markup.button.callback("📋 Детали заказа", `order_details_${order.id}`)],
      [Markup.button.callback("🔙 Назад", "main_menu")],
    ];

    return ctx.editMessageText(message, Markup.inlineKeyboard(keyboard));
  });

  // Детали заказа
  bot.action(/order_details_(\d+)/, (ctx) => {
    const orderId = parseInt(ctx.match[1]);
    const userId = ctx.from?.id;
    if (!userId) return;

    const userOrders = orders.get(userId) || [];
    const order = userOrders.find((o) => o.id === orderId);

    if (!order) {
      return ctx.answerCbQuery("Заказ не найден");
    }

    let message = `📋 Детали заказа #${order.id}\n\n`;

    order.items.forEach((item, index) => {
      const total = item.quantity * item.price;
      message += `${index + 1}. ${item.productName}\n`;
      message += `   ${item.quantity} × ${formatPrice(
        item.price
      )} = ${formatPrice(total)} сум\n\n`;
    });

    message += `💰 Итого: ${formatPrice(order.totalPrice)} сум`;

    return ctx.editMessageText(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback("🔙 К заказам", "my_orders")],
      ])
    );
  });
};
