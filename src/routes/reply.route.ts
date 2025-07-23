import { Router } from "express";
import { validate } from "../middlewares/validateRequest";
import replyValidator from "../validators/reply.validator";
import { createReply, getRepliesByComment, reactToReply } from "../controllers/reply.controller";

const router = Router();
router.post('/create', validate(replyValidator.createReply), createReply);
router.get('/list', validate(replyValidator.getRepliesByComment), getRepliesByComment);
router.patch('/:replyId/react', validate(replyValidator.reactToReply), reactToReply);

export default router;