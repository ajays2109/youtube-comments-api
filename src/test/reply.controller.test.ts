import {
  createReply,
  getRepliesByComment,
  reactToReply,
} from '../controllers/reply.controller';
import replyService from '../services/reply.service';

jest.mock('../services/reply.service');
jest.mock('uuid', () => ({
  v1: jest.fn(() => 'mocked-reply-id'),
}));

describe('Reply Controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createReply', () => {
    it('should create a reply and return 201', async() => {
      mockReq = {
        body: {
          parentCommentId: 'comment123',
          videoId: 'video456',
          content: 'Test reply',
          userName: 'Ajay',
        },
      };

      await createReply(mockReq, mockRes, mockNext);

      expect(replyService.createReply).toHaveBeenCalledWith(expect.objectContaining({
        replyId: 'mocked-reply-id',
        parentCommentId: 'comment123',
        videoId: 'video456',
        content: 'Test reply',
        createdAt: expect.any(Date),
        edited: false,
        likesCount: 0,
        dislikesCount: 0,
        userName: 'Ajay',
      }));

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          replyId: 'mocked-reply-id',
          content: 'Test reply',
          userName: 'Ajay',
        }),
      });
    });

    it('should call next on error', async() => {
      const error = new Error('Create failed');
      (replyService.createReply as jest.Mock).mockRejectedValue(error);

      mockReq = {
        body: {
          parentCommentId: 'comment123',
          videoId: 'video456',
          content: 'Test reply',
          userName: 'Ajay',
        },
      };

      await createReply(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getRepliesByComment', () => {
    it('should return replies for a comment', async() => {
      const replies = [{ replyId: 'r1' }, { replyId: 'r2' }];
      (replyService.getRepliesByComment as jest.Mock).mockResolvedValue(replies);

      mockReq = {
        query: {
          commentId: 'comment123',
          lastReplyId: 'r0',
          limit: '5',
        },
      };

      await getRepliesByComment(mockReq, mockRes, mockNext);

      expect(replyService.getRepliesByComment).toHaveBeenCalledWith('comment123', 'r0', 5);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: replies,
      });
    });

    it('should call next on error', async() => {
      const error = new Error('Fetch failed');
      (replyService.getRepliesByComment as jest.Mock).mockRejectedValue(error);

      mockReq = {
        query: {
          commentId: 'comment123',
          limit: '5',
        },
      };

      await getRepliesByComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('reactToReply', () => {
    it('should react to a reply and return success', async() => {
      mockReq = {
        body: {
          commentId: 'comment123',
          type: 'like',
        },
        params: {
          replyId: 'reply456',
        },
      };

      await reactToReply(mockReq, mockRes, mockNext);

      expect(replyService.reactToReply).toHaveBeenCalledWith('reply456', 'comment123', 'like');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Reply liked successfully',
      });
    });

    it('should call next on error', async() => {
      const error = new Error('Reaction failed');
      (replyService.reactToReply as jest.Mock).mockRejectedValue(error);

      mockReq = {
        body: {
          commentId: 'comment123',
          type: 'dislike',
        },
        params: {
          replyId: 'reply456',
        },
      };

      await reactToReply(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
