import { Request, Response, NextFunction } from 'express';
import videoService from '../services/video.service';

export const getVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const videos = await videoService.getAllVideos();
        res.status(200).json({
            status: 'success',
            data: videos
        });
    } catch (error) {
        next(error);
    }
}