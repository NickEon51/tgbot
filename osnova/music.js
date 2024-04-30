const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');

// Функция для поиска видео по запросу и получения URL первого результата
async function findVideoUrl(query) {
    try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const response = await axios.get(searchUrl);
        const text = response.data;

        // Извлекаем URL первого найденного видео из HTML-кода страницы результатов поиска
        const videoIdRegex = /"videoId":"([^"]+)"/;
        const match = text.match(videoIdRegex);

        if (match && match[1]) {
            const videoId = match[1];
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            return videoUrl;
        } else {
            throw new Error('Не удалось найти URL видео по запросу');
        }
    } catch (error) {
        console.error('Ошибка поиска видео:', error);
        throw error;
    }
}

// Функция для загрузки и конвертации видео в MP3
async function downloadAndConvertVideo(videoUrl) {
    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const artist = videoInfo.videoDetails.author.name;
        const title = videoInfo.videoDetails.title;

        const audioBuffer = await new Promise((resolve, reject) => {
            const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
            const converter = ffmpeg(audioStream)
                .audioBitrate(128)
                .format('mp3')
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
            
            converter.pipe();
        });

        return { artist, title, audioBuffer };
    } catch (error) {
        console.error('Ошибка загрузки и конвертации видео:', error);
        throw error;
    }
}

// Функция для поиска музыки по запросу и загрузки ее
async function searchMusic(query) {
    try {
        const videoUrl = await findVideoUrl(query);
        const { artist, title, audioBuffer } = await downloadAndConvertVideo(videoUrl);
        return { artist, title, audioBuffer };
    } catch (error) {
        console.error('Ошибка поиска и загрузки музыки:', error);
        throw error;
    }
}

module.exports = {
    searchMusic
};
