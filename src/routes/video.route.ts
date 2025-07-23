import { Router } from 'express';
const router = Router();
import { getVideos } from '../controllers/video.controller';

/**
 * Route to get all videos
 * This can be used to fetch a list of videos for the homepage
 */
router.get('/', getVideos);

export default router;