import Track from "../models/Tracks.js";
import pool from '../settings/connection.js';


export const searchByIdDeezer = async (id) => {
    try {
        const response = await pool.query(`SELECT * FROM tracks WHERE deezer_id = '${id}'`);
        return new Track().fromData(response[0]);
    } catch (error) {
        console.log(error);
    }
};

export const searchByIdYoutube = async (id) => {
    try {
        const response = await pool.query(`SELECT * FROM tracks WHERE youtube_id = '${id}'`);
        return response.rows[0];
    } catch (error) {
        console.log(error);
    }
}

export const saveTrack = async (data) => {
    const track = new Track().fromJson(data);
    try {
        return new Promise((resolve, reject) => {
            pool.execute(`INSERT INTO tracks (deezer_id, youtube_id, title, title_short, duration, track_position, disk_number, release_date, preview, md5_image,  artist_name, album_name, searchable, artist_id, album_id) VALUES ('${track.deezerId}', '${track.youtubeId}', '${track.title}', '${track.titleShort}', '${track.duration}', '${track.trackPosition}', '${track.diskNumber}', '${track.releaseDate}', '${track.preview}', '${track.md5Image}', '${track.artistName}', '${track.albumName}', '${track.searchable}', '${track.artistId}', '${track.albumId}')`).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.log(error);
    }
}