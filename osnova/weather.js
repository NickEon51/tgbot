const axios = require('axios');
require('dotenv').config();

const getWeather = async (cityName) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${process.env.OPENWEATHER_TOKEN}&units=metric&lang=ru`);
        const forecastData = response.data.list;

        // Группируем данные по времени суток (утро, день, вечер, ночь) на сегодня, завтра и далее
        const groupedForecast = {};
        forecastData.forEach(item => {
            const dateTime = new Date(item.dt_txt);
            const date = formatDate(dateTime); // Форматируем дату
            const time = dateTime.getHours();
            const period = getPeriodOfDay(time);

            if (!groupedForecast[date]) {
                groupedForecast[date] = {};
            }

            if (!groupedForecast[date][period]) {
                groupedForecast[date][period] = {
                    temperature: item.main.temp,
                    weather: item.weather[0].description
                };
            }
        });

        // Формируем текст для вывода прогноза погоды на русском с заглавной буквой у названия города
        const formattedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1); // Первая буква заглавная
        let forecastText = `Прогноз погоды для ${formattedCityName}:\n\n`;

        Object.keys(groupedForecast).forEach(date => {
            forecastText += `${date}\n`;
            Object.keys(groupedForecast[date]).forEach(period => {
                const { temperature, weather } = groupedForecast[date][period];
                forecastText += `${getEmoji(weather)} ${period}: ${temperature.toFixed(2)}°C (${weather})\n`;
            });
            forecastText += '\n';
        });

        return forecastText.trim();
    } catch (error) {
        console.error('Ошибка получения погоды:', error);
        return null;
    }
};

// Определяем период суток на основе времени (утро, день, вечер, ночь)
const getPeriodOfDay = (hour) => {
    if (hour >= 6 && hour < 12) {
        return 'Утром';
    } else if (hour >= 12 && hour < 18) {
        return 'Днем';
    } else if (hour >= 18 && hour < 24) {
        return 'Вечером';
    } else {
        return 'Ночью';
    }
};

// Функция для форматирования даты
const formatDate = (date) => {
    const options = {
        weekday: 'long', // Полное название дня недели
        year: 'numeric',
        month: 'long', // Полное название месяца
        day: 'numeric'
    };

    const formatter = new Intl.DateTimeFormat('ru-RU', options);
    return formatter.format(date);
};

// Получаем эмодзи смайлик в зависимости от типа погоды
const getEmoji = (weatherDescription) => {
    const lowerCaseDescription = weatherDescription.toLowerCase();
    if (lowerCaseDescription.includes('дождь')) {
        return '🌧️';
    } else if (lowerCaseDescription.includes('облачно')) {
        return '☁️';
    } else if (lowerCaseDescription.includes('пасмурно')) {
        return '🌥️';
    } else if (lowerCaseDescription.includes('ясно')) {
        return '☀️';
    } else {
        return '🌍'; // Эмодзи по умолчанию
    }
};

module.exports = {
    getWeather
};
