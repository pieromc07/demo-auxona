import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const KEY = process.env.SERVICE_YOUTUBE_API_KEY;
const BASE_URL = process.env.SERVICE_YOUTUBE_API_URL;


export const search = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}search`, {
            params: {
                part: 'id, snippet',
                maxResults: 1,
                key: KEY,
                q: query
            }
        });
        return response.data.items.map(item => {
            return {
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.default.url,
                thumbnailMedium: item.snippet.thumbnails.medium.url,
                thumbnailHigh: item.snippet.thumbnails.high.url,
            };
        });
    } catch (error) {
        console.log(error);
    }
};

export const video = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}videos`, {
            params: {
                part: 'id, contentDetails',
                key: KEY,
                id: id
            }
        });
        return response.data.items.map(item => {
            return {
                id: item.id,
                duration: item.contentDetails.duration,
                dimension: item.contentDetails.dimension,
            };
        });
    } catch (error) {
        console.log(error);
    }
}