import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const KEY = process.env.SERVICE_DEEZER_API_KEY;
const BASE_URL = process.env.SERVICE_DEEZER_API_URL;

export const searchTrack = async (query) => {
    try{
        const response = await axios.get(`${BASE_URL}search/track`, {
            params: {
                q: query
            }
        });
        return response.data.data.map(item => {
            return {
                id: item.id,
                title: item.title,
                title_short: item.title_short,
                title_version: item.title_version,
                duration: item.duration,
                preview: item.preview,
                md5_image: `https://e-cdns-images.dzcdn.net/images/cover/${item.md5_image}/250x250-000000-80-0-0.jpg`,
                artist: [
                    {
                        id: item.artist.id,
                        name: item.artist.name,
                        picture: item.artist.picture,
                        picture_small: item.artist.picture_small,
                        picture_medium: item.artist.picture_medium,
                        picture_big: item.artist.picture_big
                    }
                ],
                album: [
                    {
                        id: item.album.id,
                        title: item.album.title,
                        cover: item.album.cover,
                        cover_small: item.album.cover_small,
                        cover_medium: item.album.cover_medium,
                        cover_big: item.album.cover_big
                    }
                ],
                type: item.type,
            };
        });
    }catch(error){
        console.log(error);
    }
};

export const TrackId = async (id) => {
    try{
        const response = await axios.get(`${BASE_URL}track/${id}`);
        return response.data;
    }catch(error){
        console.log(error);
    }
};