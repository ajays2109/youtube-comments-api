import { getVideos } from '../controllers/video.controller';
import videoService from '../services/video.service';

jest.mock('../services/video.service');

describe('Video Controller - getVideos', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should return all videos with 200 status', async () => {
    const mockVideos = [
      { videoId: 'v1', title: 'First Video' },
      { videoId: 'v2', title: 'Second Video' },
    ];
    (videoService.getAllVideos as jest.Mock).mockResolvedValue(mockVideos);

    await getVideos(mockReq, mockRes, mockNext);

    expect(videoService.getAllVideos).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockVideos,
    });
  });

  it('should call next with error on failure', async () => {
    const error = new Error('DB failure');
    (videoService.getAllVideos as jest.Mock).mockRejectedValue(error);

    await getVideos(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
