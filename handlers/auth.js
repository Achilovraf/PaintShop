// handlers/auth.js
const { Markup } = require("telegraf");

module.exports = (bot) => {
  bot.action("auth_login", async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.reply(
      "Для авторизации поделитесь номером телефона:",
      Markup.keyboard([
        [Markup.button.contactRequest("📱 Поделиться номером телефона")],
      ]).resize()
    );
  });

  bot.on("contact", async (ctx) => {
    ctx.user.isAuthenticated = true;
    ctx.user.phone = ctx.message.contact.phone_number;

    await ctx.reply("✅ Авторизация успешна!", Markup.removeKeyboard());
    return ctx.reply(
      "Добро пожаловать!",
      Markup.inlineKeyboard([
        [Markup.button.callback("🏠 Главное меню", "main_menu")],
      ])
    );
  });
};
