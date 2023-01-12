import { Router } from "express";
import { getTrack, searchDeezer } from "../controllers/DeezerController.js";
import { searchYoutube,videoYoutube } from "../controllers/YoutubeController.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/track/:id', getTrack);
router.get('/search/:query', searchDeezer );

router.get('/youtube/:query', searchYoutube );
router.get('/video/:id', videoYoutube );


export default router;