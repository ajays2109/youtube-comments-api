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

    // Check if the video exists  
    const videoExistsQuery = 'SELECT video_id FROM videos WHERE video_id = ?';
    const videoResult = await scyllaDbClient.execute(videoExistsQuery, [videoId], { prepare: true });
    if (videoResult.rowLength === 0) {
      throw new Error(`Video with ID ${videoId} does not exist.`);
    }

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
    const scoreQuery = 'INSERT INTO scored_comments_by_video (video_id, score, comment_id,user_id, user_name, user_avatar,content, created_at, edited,likes_count, dislikes_count, replies_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const scoreParams = [
      videoId,
      score,
      commentId,
      userId,
      userName,
      userAvatar || null,
      content,
      createdAt,
      edited,
      likesCount,
      dislikesCount,
      0,
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
    return response;
  }
  catch (error) {
    logger.error('Error fetching comments by video', { error, videoId });
    throw new Error(`Failed to fetch comments for video ${videoId}: ${(error as Error).message}`);
  }
}

async function reactToComment(videoId: string, commentId: string, type: 'like' | 'dislike') {
  try {
    // Fetch current comment row from scored_comments_by_video
    const selectQuery = `
      SELECT * FROM scored_comments_by_video
      WHERE video_id = ? ALLOW FILTERING
    `;
    const result = await scyllaDbClient.execute(selectQuery, [videoId], { prepare: true });

    // Find the row with the correct commentId manually since comment_id is clustering, not primary
    const row = result.rows.find(r => r.comment_id.toString() === commentId);

    if (!row) {
      throw new Error(`Comment ${commentId} not found for video ${videoId}`);
    }

    const {
      likes_count,
      dislikes_count,
      created_at,
      user_id,
      user_name,
      user_avatar,
      content,
      edited,
      replies_count,
      score: oldScore,
    } = row;

    // Compute new like/dislike counts
    const updatedLikes = likes_count + (type === 'like' ? 1 : 0);
    const updatedDislikes = dislikes_count + (type === 'dislike' ? 1 : 0);

    // Compute new score
    const newScore = calculateCommentScore({
      likes: updatedLikes,
      dislikes: updatedDislikes,
      createdAt: created_at,
    });

    // 1. Update in comments_by_video (can use UPDATE directly)
    const updateMainQuery = `
      UPDATE comments_by_video
      SET likes_count = ?, dislikes_count = ?
      WHERE video_id = ? AND comment_id = ?
    `;
    await scyllaDbClient.execute(updateMainQuery, [
      updatedLikes,
      updatedDislikes,
      videoId,
      commentId,
    ], { prepare: true });

    // 2. Delete old scored comment (based on old score)
    const deleteQuery = `
      DELETE FROM scored_comments_by_video
      WHERE video_id = ? AND score = ? AND comment_id = ?
    `;
    await scyllaDbClient.execute(deleteQuery, [
      videoId,
      oldScore,
      commentId,
    ], { prepare: true });

    // 3. Insert new scored comment with updated score
    const insertQuery = `
      INSERT INTO scored_comments_by_video (
        video_id, score, comment_id,
        user_id, user_name, user_avatar,
        content, created_at, edited,
        likes_count, dislikes_count, replies_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await scyllaDbClient.execute(insertQuery, [
      videoId,
      newScore,
      commentId,
      user_id,
      user_name,
      user_avatar,
      content,
      created_at,
      edited,
      updatedLikes,
      updatedDislikes,
      replies_count ?? 0,
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