const fetch = require('node-fetch');

// Функция для получения погоды по стране и городу
async function getWeather(country, city) {
    const apiKey = '1fb4a3a19f4359b986bfc84acf51b0c1'; // Замени на свой API ключ

        // Формируем URL для запроса погоды
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

                try {
                        const response = await fetch(apiUrl); // Отправляем запрос
                                const data = await response.json(); // Получаем данные в формате JSON

                                        if (response.ok) {
                                                    // Извлекаем необходимую информацию о погоде
                                                                const temperature = data.main.temp;
                                                                            const weatherDescription = data.weather[0].description;

                                                                                        return {
                                                                                                        temperature: temperature,
                                                                                                                        weatherDescription: weatherDescription
                                                                                                                                    };
                                                                                                                                            } else {
                                                                                                                                                        throw new Error('Не удалось получить данные о погоде');
                                                                                                                                                                }
                                                                                                                                                                    } catch (error) {
                                                                                                                                                                            console.error('Ошибка получения данных о погоде:', error.message);
                                                                                                                                                                                    return null;
                                                                                                                                                                                        }
                                                                                                                                                                                        }

                                                                                                                                                                                        module.exports = {
                                                                                                                                                                                            getWeather
                                                                                                                                                                                            };
                                                                                                                                                                                            