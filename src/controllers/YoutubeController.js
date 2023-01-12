import { request, response } from 'express';

import { search, video } from '../services/YoutubeService.js';

export const searchYoutube = async (req = request, res = response) => {
    const { query } = req.params;
    console.log(query);
    const results = await search(query);
    const video = results[0];
    res.json(video);
};

export const videoYoutube = async (req = request, res = response) => {
    const { id } = req.params;
    console.log(id);
    const results = await video(id);
    const track = results[0];
    res.json(track);
}