import { Request, Response, NextFunction } from 'express';
import videoService from '../services/video.service';

/**
 * Controller to handle video-related requests.
 */

export const getVideos = async(req: Request, res: Response, next: NextFunction) => {
  try {
    // Call the service to get all videos
    const videos = await videoService.getAllVideos();
    res.status(200).json({
      status: 'success',
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};