import { request, response } from "express";

import {searchTrack, TrackId} from "../services/DeezerService.js";
import {searchByIdDeezer, saveTrack } from "../services/AuxonaService.js";

export const searchDeezer = async (req = request, res = response) => {
    const {query} = req.params;
    console.log(query);
    const results = await searchTrack(query);
    res.json(results);
};

export const getTrack = async (req = request, res = response) => {
    const {id} = req.params;
    const found = await searchByIdDeezer(id);
    if(found){
        return res.json(found);
    }
    const track = await TrackId(id);
    res.json(track);
};

export const storeTrack = (req = request, res = response) => {
  
    const {body} = req;
    const track = saveTrack(body).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.json(error);
    });
};

