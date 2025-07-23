import Joi from "joi";

const createReply = {
    body: Joi.object({
        videoId: Joi.string().required(),
        parentCommentId: Joi.string().required(),
        content: Joi.string().min(1).max(500).required(),
        userId: Joi.string().optional(),
        userName: Joi.string().min(1).max(50).required(),
        userAvatar: Joi.string().uri().optional(),
    })
}

const getRepliesByComment = {
    query: Joi.object({ 
        commentId: Joi.string().required(),
        limit: Joi.number().integer().min(1).max(100).default(10).optional(),
        lastReplyId: Joi.string().optional(),
    })
}

const reactToReply = {
    params: Joi.object({
        replyId: Joi.string().required(),
    }),
    body: Joi.object({
        commentId: Joi.string().required(),
        type: Joi.string().valid('like', 'dislike').required()
    })
}

export default {
    createReply,
    getRepliesByComment,
    reactToReply,
}