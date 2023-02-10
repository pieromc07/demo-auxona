import { Router } from "express";
import app from "./app/app.routes.js";

const router = Router();

router.use('/app', app);



export default router;