import scyllaDbClient from '../db/scyllaDbClient';
import logger from '../logger/winston';
import { Comment, ScoredComment } from '../types';
import { calculateCommentScore } from '../utils/score';

/**
 * Service to handle comment-related operations.
 */

async function createComment(comment: Comment): Promise<void> {
  try {
    const {
      videoId,
      commentId,
      userId,
      userName,
      userAvatar,
      content,
      createdAt,
      edited,
      likesCount,
      dislikesCount,
    } = comment;

    // Calculate the score for the comment
    const score = calculateCommentScore({
      likes: likesCount,
      dislikes: dislikesCount,
      createdAt,
    });
    // Insert the comment into the comments table
    const query = 'INSERT INTO comments_by_video (comment_id, video_id, content, created_at, edited, likes_count, dislikes_count, user_id, user_name, user_avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      commentId,
      videoId,
      content,
      createdAt,
      edited,
      likesCount,
      dislikesCount,
      userId,
      userName,
      userAvatar || null,
    ];
    await scyllaDbClient.execute(query, params, { prepare: true });
    // Insert the scored comment into a separate table for scoring
    // This allows for efficient retrieval of comments with their scores
    const scoreQuery = 'INSERT INTO scored_comments_by_video (video_id, comment_id, user_id, user_name, content, created_at, edited, likes_count, dislikes_count, replies_count, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const scoreParams = [
      videoId,
      commentId,
      userId,
      userName,
      content,
      createdAt,
      edited,
      likesCount,
      dislikesCount,
      0, // Assuming replies_count is initially 0
      score,
    ];
    await scyllaDbClient.execute(scoreQuery, scoreParams, { prepare: true });
  } catch (error) {
    logger.error('Error creating comment', { error, videoId: comment.videoId });
    throw new Error(`Failed to create comment: ${(error as Error).message}`);
  }
};


async function getCommentsByVideo(videoId: string, sort: 'top' | 'new' = 'new', lastCommentId?: string, limit: number = 10): Promise<Comment[] | ScoredComment[]> {
  try {
    const isTop = sort === 'top';
    const table = isTop ? 'scored_comments_by_video' : 'comments_by_video';
    let query = `SELECT * FROM ${table} WHERE video_id = ?`;
    const params: any[] = [videoId];

    // For "new", using lastCommentId to paginate
    if (sort === 'new' && lastCommentId) {
      query += ' AND comment_id < ?';
      params.push(lastCommentId);
    }

    query += ' LIMIT ?';
    params.push(limit);

    const result = await scyllaDbClient.execute(query, params, { prepare: true });
    const response = result.rows.map(row => {
      const comment: Comment | ScoredComment = {
        videoId: row.video_id,
        commentId: row.comment_id,
        userName: row.user_name,
        userAvatar: row.user_avatar,
        content: row.content,
        createdAt: row.created_at,
        edited: row.edited,
        likesCount: row.likes_count,
        dislikesCount: row.dislikes_count,
        repliesCount: row.replies_count ?? 0,
      };
      if (isTop) {
        // If it's a top comment, include the score
        return {
          ...comment,
          score: row.score ?? 0,
        } as ScoredComment;
      }
      return comment;
    });
    if (isTop) {
      // Sort top comments by score in descending order
      // This ensures that the top comments are returned in the correct order
      return (response as ScoredComment[]).sort((a, b) => b.score - a.score);
    }

    return response;
  }
  catch (error) {
    logger.error('Error fetching comments by video', { error, videoId });
    throw new Error(`Failed to fetch comments for video ${videoId}: ${(error as Error).message}`);
  }
}

async function reactToComment(videoId: string, commentId: string, type: 'like' | 'dislike') {
  try {
    // Fetch current values from scored_comments_by_video
    const selectQuery = `
        SELECT created_at, likes_count, dislikes_count
        FROM scored_comments_by_video
        WHERE video_id = ? AND comment_id = ?
        `;
    const result = await scyllaDbClient.execute(selectQuery, [videoId, commentId], { prepare: true });
    const row = result.first();

    if (!row) throw new Error('Comment not found');

    const updatedLikes = row.likes_count + (type === 'like' ? 1 : 0);
    const updatedDislikes = row.dislikes_count + (type === 'dislike' ? 1 : 0);

    // Recalculate score
    const score = calculateCommentScore({
      likes: updatedLikes,
      dislikes: updatedDislikes,
      createdAt: row.created_at,
    });

    // Update both tables using full value set (read-modify-write pattern)
    const updateCommentQuery = `
        UPDATE comments_by_video
        SET likes_count = ?, dislikes_count = ?
        WHERE video_id = ? AND comment_id = ?
        `;
    await scyllaDbClient.execute(updateCommentQuery, [
      updatedLikes,
      updatedDislikes,
      videoId,
      commentId,
    ], { prepare: true });

    const updateScoreQuery = `
        UPDATE scored_comments_by_video
        SET likes_count = ?, dislikes_count = ?, score = ?
        WHERE video_id = ? AND comment_id = ?
        `;
    await scyllaDbClient.execute(updateScoreQuery, [
      updatedLikes,
      updatedDislikes,
      score,
      videoId,
      commentId,
    ], { prepare: true });

  } catch (error) {
    logger.error('Error reacting to comment', { error, videoId, commentId });
    throw new Error(`Failed to react to comment ${commentId} on video ${videoId}: ${(error as Error).message}`);
  }
}

export default {
  createComment,
  getCommentsByVideo,
  reactToComment,
};