import { Router } from "express";
const router = Router();
import { getVideos } from "../controllers/video.controller";

router.get("/", getVideos);

export default router;