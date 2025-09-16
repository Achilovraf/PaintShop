require("dotenv").config();
const { Telegraf } = require("telegraf");
const { initTestData, users } = require("./data/testData");

// Проверка токена ДО инициализации бота
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не установлен в .env");
  process.exit(1);
}

// Создаём экземпляр бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// Загружаем тестовые данные
initTestData();

// Middleware для отслеживания пользователей
bot.use((ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return next();

  if (!users.has(userId)) {
    users.set(userId, {
      id: userId,
      username: ctx.from.username ?? null,
      firstName: ctx.from.first_name ?? "Неизвестный",
      isAuthenticated: false,
      role: "user",
    });
  }

  ctx.user = users.get(userId);
  return next();
});

// Подключение хендлеров (ИСПРАВЛЕН СПИСОК)
["auth", "menu", "products", "cart", "orders", "info", "pricelist"].forEach(
  (handler) => {
    try {
      require(`./handlers/${handler}`)(bot);
      console.log(`✅ Handler ${handler} загружен`);
    } catch (err) {
      console.error(`❌ Ошибка загрузки handler ${handler}:`, err.message);
    }
  }
);

// Глобальная обработка ошибок
bot.catch((err, ctx) => {
  console.error("Ошибка бота:", err);
  try {
    if (ctx.answerCbQuery) {
      ctx.answerCbQuery("Произошла ошибка");
    }
    ctx.reply("❌ Произошла ошибка. Попробуйте позже.");
  } catch (e) {
    console.error("Не удалось отправить сообщение об ошибке:", e);
  }
});

// Запуск бота
bot
  .launch()
  .then(() => {
    console.log("🚀 Бот успешно запущен!");
  })
  .catch((err) => {
    console.error("❌ Ошибка запуска:", err);
    process.exit(1);
  });

// Корректное завершение процесса
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
