import { Router } from 'express';
import { validate } from '../middlewares/validateRequest';
import commentValidator from '../validators/comment.validator';
import { createComment, getCommentsByVideo, reactToComment } from '../controllers/comment.controller';

const router = Router();

/**
 * Route to create a new comment for a video
 * The request body should contain videoId, content, and userName
 */
router.post('/create', validate(commentValidator.createComment), createComment);

/**
 * Route to get comments for a video
 * Supports sorting by "top" or "new", pagination using lastCommentId, and limit on the number of comments returned
 */
router.get('/list', validate(commentValidator.getCommentsByVideo), getCommentsByVideo);

/**
 * React to a comment by liking or disliking it
 * The commentId is passed as a URL parameter, and the type of reaction (like or dislike) is passed in the request body
 */
router.patch('/:commentId/react', validate(commentValidator.reactToComment), reactToComment);

export default router;