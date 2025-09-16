const { Markup } = require("telegraf");

module.exports = (bot) => {
  bot.action("my_marketer", (ctx) => {
    const message =
      `💡 Информация о маркетологе:\n\n` +
      `📝 Имя: Akbar\n` +
      `📞 Номер телефона: 93 007-07-06`;

    return ctx.editMessageText(
      message,
      Markup.inlineKeyboard([[Markup.button.callback("🔙 Назад", "main_menu")]])
    );
  });

  // УБРАЛИ price_list - он в handlers/pricelist.js

  bot.action("statistics", (ctx) => {
    const months = [
      "Октябрь",
      "Ноябрь",
      "Декабрь",
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
    ];

    let message =
      "📊 Количество и цены продуктов, купленных в течение года:\n\n";
    months.forEach((month, index) => {
      const qty = index >= 8 ? [410, 415, 400, 200][index - 8] : 0;
      const sum =
        index >= 8
          ? ["14 850 072", "16 100 108", "13 250 000", "8 400 000"][index - 8]
          : "0";
      message += `${index + 1}. ${month}. ${qty} -> ${sum} сум\n`;
    });

    return ctx.editMessageText(
      message,
      Markup.inlineKeyboard([[Markup.button.callback("🔙 Назад", "main_menu")]])
    );
  });

  bot.action("my_debt", (ctx) => {
    const message =
      `💰 Ваш произвольный долг: 59 900 738 сум\n` +
      `💰 Компания должна вам деньги: 0\n\n` +
      `💰 Ваш долг за краску: 0\n` +
      `💰 Компания должна вам краску: 0`;

    const keyboard = [
      [Markup.button.callback("📄 Прайс-лист", "price_list")],
      [Markup.button.callback("🔙 Назад", "main_menu")],
    ];

    return ctx.editMessageText(message, Markup.inlineKeyboard(keyboard));
  });

  bot.action("catalogs", (ctx) => {
    const keyboard = [
      [Markup.button.callback("Каталог Сухих смесей", "catalog_dry")],
      [Markup.button.callback("Краски", "catalog_paints")],
      [Markup.button.callback("🔙 Назад", "main_menu")],
    ];

    return ctx.editMessageText("Каталоги", Markup.inlineKeyboard(keyboard));
  });

  bot.action("paid_bonus", (ctx) => {
    return ctx.editMessageText(
      "💰 Ваш оплаченный бонус: 0 сум",
      Markup.inlineKeyboard([[Markup.button.callback("🔙 Назад", "main_menu")]])
    );
  });

  bot.action("leave_comment", (ctx) => {
    return ctx.editMessageText(
      "✍️ Оставьте ваш комментарий прямо в чате:",
      Markup.inlineKeyboard([[Markup.button.callback("🔙 Назад", "main_menu")]])
    );
  });

  bot.action("about", (ctx) => {
    return ctx.editMessageText(
      "ℹ️ О компании:\n\nМы продаем качественные строительные материалы.",
      Markup.inlineKeyboard([[Markup.button.callback("🔙 Назад", "main_menu")]])
    );
  });
};
