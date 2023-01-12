import { request, response } from "express";

import {searchTrack, TrackId} from "../services/DeezerService.js";

export const searchDeezer = async (req = request, res = response) => {
    const {query} = req.params;
    console.log(query);
    const results = await searchTrack(query);
    res.json(results);
};

export const getTrack = async (req = request, res = response) => {
    const {id} = req.params;
    const track = await TrackId(id);
    res.json(track);
};
