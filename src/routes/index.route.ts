import { Router } from 'express';
import userRoutes from './users.route';
import commentRoutes from './comments.route';
import videoRoutes from './video.route';
import replyRoutes from './reply.route';
const router = Router();

// Main route for the application

// This route handles user-related operations
router.use('/user', userRoutes);

// This route handles user-related operations
router.use('/comment', commentRoutes);

// This route handles video-related operations
router.use('/video', videoRoutes);

// This route handles replies to comments
router.use('/reply', replyRoutes);


export default router;