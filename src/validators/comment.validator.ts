import Joi from 'joi';
const createComment = {
  body: Joi.object({
    videoId: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(500).required(),
    userId: Joi.string().optional(),
    userName: Joi.string().min(1).max(50).required(),
    userAvatar: Joi.string().uri().optional(),
  }),
};

const getCommentsByVideo = {
  query: Joi.object({
    videoId: Joi.string().uuid().required(),
    sort: Joi.string().valid('top', 'new').default('new').optional(),
    limit: Joi.number().integer().min(1).max(100).default(10).optional(),
    lastCommentId: Joi.string().optional(),
  }),
};

const reactToComment = {
  params: Joi.object({
    commentId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    videoId: Joi.string().uuid().required(),
    type: Joi.string().valid('like', 'dislike').required(),
  }),
};

export default {
  createComment,
  getCommentsByVideo,
  reactToComment,
};