import { Request, Response, NextFunction } from 'express';
import replyService from '../services/reply.service';
import { v1 as uuidv1 } from 'uuid';

/**
 * Controller to handle reply-related requests.
 */

export const createReply = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const reply = {
      replyId: uuidv1(), // Generate a unique reply ID
      parentCommentId: req.body.parentCommentId,
      videoId: req.body.videoId,
      content: req.body.content,
      createdAt: new Date(),
      edited: false,
      likesCount: 0,
      dislikesCount: 0,
      userName: req.body.userName,
    };
    // Call the service to create the reply
    await replyService.createReply(reply);
    res.status(201).json({
      status: 'success',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const getRepliesByComment = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId, lastReplyId, limit } = req.query as { commentId: string, lastReplyId?: string, limit?: string };
    // Call the service to get replies
    const replies = await replyService.getRepliesByComment(commentId, lastReplyId, parseInt(limit || '10', 10));
    res.status(200).json({
      status: 'success',
      data: replies,
    });
  } catch (error) {
    next(error);
  }
};

export const reactToReply = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { replyId } = req.params;
    const { commentId, type } = req.body;
    // Call the service to react to the reply
    await replyService.reactToReply(replyId, commentId, type);
    res.status(200).json({
      status: 'success',
      message: `Reply ${type}d successfully`,
    });
  } catch (error) {
    next(error);
  }
};