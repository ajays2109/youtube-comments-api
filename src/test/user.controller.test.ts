import { createUser } from '../controllers/user.controller';
import userService from '../services/user.service';

jest.mock('../services/user.service');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-user-id'),
}));

describe('User Controller - createUser', () => {
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

  it('should create a user and return 201', async() => {
    const createdUser = {
      userId: 'mocked-user-id',
      userName: 'Ajay',
      userAvatar: 'avatar.png',
    };

    (userService.createUser as jest.Mock).mockResolvedValue(createdUser);

    mockReq = {
      body: {
        userName: 'Ajay',
        userAvatar: 'avatar.png',
      },
    };

    await createUser(mockReq, mockRes, mockNext);

    expect(userService.createUser).toHaveBeenCalledWith({
      userId: 'mocked-user-id',
      userName: 'Ajay',
      userAvatar: 'avatar.png',
    });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      data: createdUser,
    });
  });

  it('should call next on error', async() => {
    const error = new Error('User creation failed');
    (userService.createUser as jest.Mock).mockRejectedValue(error);

    mockReq = {
      body: {
        userName: 'Ajay',
        userAvatar: 'avatar.png',
      },
    };

    await createUser(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
