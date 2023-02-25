import { Router } from "express";
import app from "./app/app.routes.js";

const router = Router();

router.use('/app', app);
router.get('/', (req, res) => {
    res.redirect('/app');
});
router.get('*', (req, res) => {
    res.redirect('/app');
});




export default router;