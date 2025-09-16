# Construction Materials Telegram Bot

Telegram бот для продажи строительных материалов с функционалом каталога, корзины и управления заказами.

## Функционал

- Авторизация через номер телефона
- Просмотр категорий и товаров
- Добавление товаров в корзину
- Оформление заказов
- Просмотр истории заказов
- Скачивание прайс-листов
- Информация о менеджере
- Статистика продаж

## Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/achilovraf/construction-materials-bot.git
cd construction-materials-bot
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` и добавьте токен бота:

```
BOT_TOKEN=your_bot_token_here
NODE_ENV=development
```

4. Запустите бота:

```bash
npm start
```

## Структура проекта

```
├── bot.js              # Главный файл бота
├── data/
│   └── testData.js     # Тестовые данные
├── handlers/           # Обработчики команд
│   ├── auth.js        # Авторизация
│   ├── cart.js        # Корзина
│   ├── info.js        # Информационные разделы
│   ├── menu.js        # Главное меню
│   ├── orders.js      # Заказы
│   ├── pricelist.js   # Прайс-листы
│   └── products.js    # Товары и категории
├── utils/
│   └── helpers.js     # Вспомогательные функции
├── package.json
└── .env
```

## Деплой

Бот настроен для автоматического деплоя через GitHub Actions.

## Технологии

- Node.js
- Telegraf (Telegram Bot Framework)
- SQLite (в планах)

## Контакты

Для вопросов по боту обращайтесь к @your_telegram
