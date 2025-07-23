import { Router } from 'express';
import { validate } from '../middlewares/validateRequest';
import replyValidator from '../validators/reply.validator';
import { createReply, getRepliesByComment, reactToReply } from '../controllers/reply.controller';

const router = Router();

/**
 * Route to create a new reply to a comment
 * The request body should contain parentCommentId, videoId, content, and userName
 */
router.post('/create', validate(replyValidator.createReply), createReply);

/**
 * Route to get replies for a comment
 * Supports pagination using lastReplyId and limit on the number of replies returned
 */
router.get('/list', validate(replyValidator.getRepliesByComment), getRepliesByComment);

/**
 * React to a reply by liking or disliking it
 * The replyId is passed as a URL parameter, and the type of reaction (like or dislike) is passed in the request body
 */
router.patch('/:replyId/react', validate(replyValidator.reactToReply), reactToReply);

export default router;