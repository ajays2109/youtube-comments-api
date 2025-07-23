import { calculateCommentScore } from '../../src/utils/score';

describe('calculateCommentScore', () => {
  const now = new Date();

  it('should calculate score with likes, dislikes, recency and replies', () => {
    const createdAt = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const score = calculateCommentScore({
      likes: 5,
      dislikes: 2,
      createdAt,
      repliesCount: 3,
    });

    // Expected calculation:
    // Likes: 5 * 2 = 10
    // Dislikes: 2 * -0.5 = -1
    // Recency: 10 - 2 = 8
    // Replies: 3 * 1.5 = 4.5
    // Total = 10 - 1 + 8 + 4.5 = 21.5
    expect(score).toBe(21.5);
  });

  it('should calculate score with no replies', () => {
    const createdAt = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours ago
    const score = calculateCommentScore({
      likes: 2,
      dislikes: 1,
      createdAt,
    });

    // 2*2 = 4, 1*-0.5 = -0.5, recency = 6, replies = 0
    // 4 - 0.5 + 6 = 9.5
    expect(score).toBe(9.5);
  });

  it('should clamp negative scores to 0', () => {
    const createdAt = new Date(now.getTime() - 20 * 60 * 60 * 1000); // 20 hours ago (recency = 0)
    const score = calculateCommentScore({
      likes: 0,
      dislikes: 10,
      createdAt,
      repliesCount: 0,
    });

    // 0 - 5 + 0 + 0 = -5 → should clamp to 0
    expect(score).toBe(0);
  });

  it('should return 0 if score is NaN', () => {
    const score = calculateCommentScore({
      likes: NaN as any,
      dislikes: 2,
      createdAt: now,
    });

    expect(score).toBe(0);
  });

  it('should round score to 2 decimal places', () => {
    const createdAt = new Date(now.getTime() - 1.333 * 60 * 60 * 1000); // 1.333 hours ago
    const score = calculateCommentScore({
      likes: 1,
      dislikes: 0,
      createdAt,
      repliesCount: 1,
    });

    // likes = 2, recency = ~8.667, replies = 1.5
    // Total = ~12.167 → rounded to 12.17
    expect(score).toBeCloseTo(12.17, 2);
  });
});
