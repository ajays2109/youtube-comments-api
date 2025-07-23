import Joi from 'joi';

const createUser = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    userAvatar: Joi.string().uri().optional(),
  }),
};

export default {
  createUser,
};