import { Router } from 'express';
import { createUser } from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { validate } from '../middlewares/validateRequest';

const router = Router();

/**
 * Route to create a new user
 * The request body should contain userName and userAvatar (optional)
 * The userId is generated automatically using uuidv4
 */
router.post('/create', validate(userValidator.createUser), createUser);

export default router;