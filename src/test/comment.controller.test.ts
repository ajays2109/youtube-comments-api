import { createComment, getCommentsByVideo, reactToComment } from '../controllers/comment.controller';
import commentService from '../services/comment.service';

jest.mock('../services/comment.service');
jest.mock('uuid', () => ({
  v1: jest.fn(() => 'mocked-uuid'),
}));

describe('Comment Controller', () => {
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

  describe('createComment', () => {
    it('should create a comment and return 201', async () => {
      mockReq = {
        body: {
          videoId: 'vid123',
          content: 'Test comment',
          userName: 'Ajay',
        },
      };

      await createComment(mockReq, mockRes, mockNext);

      expect(commentService.createComment).toHaveBeenCalledWith(expect.objectContaining({
        commentId: 'mocked-uuid',
        videoId: 'vid123',
        content: 'Test comment',
        createdAt: expect.any(Date),
        edited: false,
        likesCount: 0,
        dislikesCount: 0,
        repliesCount: 0,
        userName: 'Ajay',
      }));

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          commentId: 'mocked-uuid',
          videoId: 'vid123',
          content: 'Test comment',
          userName: 'Ajay',
        }),
      });
    });

    it('should call next on error', async () => {
      const error = new Error('Create failed');
      (commentService.createComment as jest.Mock).mockRejectedValue(error);

      mockReq = {
        body: {
          videoId: 'vid123',
          content: 'Test comment',
          userName: 'Ajay',
        },
      };

      await createComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCommentsByVideo', () => {
    it('should return comments for a video', async () => {
      const comments = [{ commentId: 'c1' }, { commentId: 'c2' }];
      (commentService.getCommentsByVideo as jest.Mock).mockResolvedValue(comments);

      mockReq = {
        query: {
          videoId: 'vid123',
          sort: 'top',
          lastCommentId: 'c0',
          limit: '2',
        },
      };

      await getCommentsByVideo(mockReq, mockRes, mockNext);

      expect(commentService.getCommentsByVideo).toHaveBeenCalledWith('vid123', 'top', 'c0', 2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: comments,
      });
    });

    it('should call next on error', async () => {
      const error = new Error('Fetch failed');
      (commentService.getCommentsByVideo as jest.Mock).mockRejectedValue(error);

      mockReq = {
        query: {
          videoId: 'vid123',
          sort: 'top',
          limit: '2',
        },
      };

      await getCommentsByVideo(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('reactToComment', () => {
    it('should react to a comment and return success', async () => {
      mockReq = {
        body: {
          videoId: 'vid123',
          type: 'like',
        },
        params: {
          commentId: 'c123',
        },
      };

      await reactToComment(mockReq, mockRes, mockNext);

      expect(commentService.reactToComment).toHaveBeenCalledWith('vid123', 'c123', 'like');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Comment liked successfully',
      });
    });

    it('should call next on error', async () => {
      const error = new Error('React failed');
      (commentService.reactToComment as jest.Mock).mockRejectedValue(error);

      mockReq = {
        body: {
          videoId: 'vid123',
          type: 'like',
        },
        params: {
          commentId: 'c123',
        },
      };

      await reactToComment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
