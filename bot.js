require('dotenv').config();
const { Telegraf } = require('telegraf');
const weatherLogic = require('./osnova/weather');
const musicLogic = require('./osnova/music');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Обработка команды "погода <город>"
bot.hears(/^погода (.+)$/i, async (ctx) => {
    const cityName = ctx.match[1]; // Получаем название города из сообщения пользователя
    const weatherInfo = await weatherLogic.getWeather(cityName);

    if (weatherInfo) {
        ctx.reply(weatherInfo);
    } else {
        ctx.reply('Произошла ошибка при получении погоды.');
    }
});

// Обработка команды "музыка <запрос>"
bot.hears(/^музыка (.+)$/i, async (ctx) => {
    const query = ctx.match[1].trim(); // Получаем запрос пользователя

    try {
        const { artist, title, audioBuffer } = await musicLogic.searchMusic(query);

        // Отправляем аудиофайл пользователю
        ctx.replyWithAudio({ source: audioBuffer }, {
            title: title,
            performer: artist
        });
    } catch (error) {
        console.error('Ошибка при отправке музыки:', error);
        ctx.reply('Произошла ошибка при отправке музыки.');
    }
});

bot.launch(); // Запуск бота
