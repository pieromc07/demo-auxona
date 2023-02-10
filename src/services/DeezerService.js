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
        // return response.data;
        return {
            id: response.data.id,
            deezer_id: response.data.id,
            youtube_id: null,
            title: response.data.title,
            title_short: response.data.title_short,
            duration: 0,
            track_position: response.data.track_position,
            disk_number: response.data.disk_number,
            release_date: response.data.release_date,
            preview: response.data.preview,
            md5_image: `https://e-cdns-images.dzcdn.net/images/cover/${response.data.md5_image}/250x250-000000-80-0-0.jpg`,
            artist_name: response.data.artist.name,
            album_name: response.data.album.title,
            searchable: response.data.title_short + ' ' + response.data.title_version + ' ' + response.data.artist.name,
            artist_id: response.data.artist.id,
            album_id: response.data.album.id,
            type: response.data.type,
        };

    }catch(error){
        console.log(error);
    }
};