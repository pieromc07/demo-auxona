import { Router } from "express";
import { getTrack, searchDeezer, storeTrack } from "../../controllers/DeezerController.js";
import { searchYoutube,videoYoutube } from "../../controllers/YoutubeController.js";



const app = Router();

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/track/:id', getTrack);
app.get('/search/:query', searchDeezer );

app.get('/youtube/:query', searchYoutube );
app.get('/video/:id', videoYoutube );

app.post('/save', storeTrack);


export default app;