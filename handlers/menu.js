// handlers/menu.js
const { Markup } = require("telegraf");

function showMainMenu(ctx) {
  const keyboard = [
    [Markup.button.callback("📁 Категории", "categories")],
    [Markup.button.callback("🛒 Перейти в корзину", "cart")],
    [Markup.button.callback("🛍️ Мои заказы", "my_orders")],
    [Markup.button.callback("💡 Мой маркетолог", "my_marketer")],
    [Markup.button.callback("📑 Прайс-лист", "price_list")],
    [Markup.button.callback("📊 Статистика", "statistics")],
    [Markup.button.callback("💰 Мой долг", "my_debt")],
    [Markup.button.callback("📁 Каталоги", "catalogs")],
    [Markup.button.callback("💰 Ваш оплаченный бонус", "paid_bonus")],
    [Markup.button.callback("✍️ Оставить комментарий", "leave_comment")],
    [Markup.button.callback("ℹ️ О нас", "about")],
  ];

  const message = "Выберите нужный раздел:";

  if (ctx.callbackQuery) {
    return ctx.editMessageText(message, Markup.inlineKeyboard(keyboard));
  } else {
    return ctx.reply(message, Markup.inlineKeyboard(keyboard));
  }
}

module.exports = (bot) => {
  // /start
  bot.start(async (ctx) => {
    if (!ctx.user.isAuthenticated) {
      return ctx.reply(
        "Добро пожаловать! Для работы с ботом необходима авторизация.",
        Markup.inlineKeyboard([
          [Markup.button.callback("🔐 Авторизоваться", "auth_login")],
          [Markup.button.callback("ℹ️ О нас", "about")],
        ])
      );
    }
    return showMainMenu(ctx);
  });

  bot.action("main_menu", showMainMenu);
};
