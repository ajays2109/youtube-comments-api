import { Request, Response, NextFunction } from 'express';
import commentService from '../services/comment.service';
import { v1 as uuidv1 } from 'uuid';
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = {
            commentId: uuidv1(), // Generate a unique comment ID
            videoId: req.body.videoId,
            content: req.body.content,
            createdAt: new Date(),
            edited: false,
            likesCount: 0,
            dislikesCount: 0,
            repliesCount: 0,
            userName: req.body.userName,
        };
        await commentService.createComment(comment);
        res.status(201).json({
            status: 'success',
            data: comment
        });
    }
    catch (error) {
        next(error);
    }
};

export const getCommentsByVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId, sort, lastCommentId, limit} = req.query as { videoId: string, sort: "top" | "new", lastCommentId?: string, limit?: string };
        const comments = await commentService.getCommentsByVideo(videoId, sort, lastCommentId, parseInt(limit || '10', 10));
        res.status(200).json({
            status: 'success',
            data: comments
        });
    } catch (error) {
        next(error);
    }
}

export const reactToComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId, type } = req.body;
        const { commentId } = req.params;
        await commentService.reactToComment(videoId, commentId, type);
        res.status(200).json({
            status: 'success',
            message: `Comment ${type}d successfully`
        });
    } catch (error) {
        next(error);
    }
};