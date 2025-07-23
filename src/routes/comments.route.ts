import { Router } from 'express';
import { validate } from '../middlewares/validateRequest';
import commentValidator from '../validators/comment.validator';
import { createComment, getCommentsByVideo, reactToComment } from '../controllers/comment.controller';

const router = Router();

router.post('/create', validate(commentValidator.createComment), createComment);
router.get('/list', validate(commentValidator.getCommentsByVideo), getCommentsByVideo);
router.patch('/:commentId/react',validate(commentValidator.reactToComment), reactToComment);

export default router;