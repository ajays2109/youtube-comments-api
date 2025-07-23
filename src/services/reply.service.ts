import scyllaDbClient from '../db/scyllaDbClient';
import logger from '../logger/winston';
import { Reply } from '../types';
import { calculateCommentScore } from '../utils/score';

/**
 * Service to handle reply-related operations.
 */

async function createReply(reply: Reply): Promise<void> {
  try {
    const {
      parentCommentId,
      replyId,
      videoId,
      userId,
      userName,
      userAvatar,
      content,
      createdAt,
      edited,
      likesCount,
      dislikesCount,
    } = reply;

    // Step 1: Insert reply into replies_by_comment
    const insertReplyQuery = `
            INSERT INTO replies_by_comment (
                parent_comment_id, reply_id, video_id,
                user_id, user_name, user_avatar, content,
                created_at, edited, likes_count, dislikes_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const replyParams = [
      parentCommentId,
      replyId,
      videoId,
      userId,
      userName,
      userAvatar ?? null,
      content,
      createdAt,
      edited,
      likesCount,
      dislikesCount,
    ];
    await scyllaDbClient.execute(insertReplyQuery, replyParams, { prepare: true });

    // Step 2: Fetch existing replies_count and recalculate score
    const scoredCommentsSelectQuery = `
            SELECT likes_count, dislikes_count, created_at, replies_count
            FROM scored_comments_by_video
            WHERE video_id = ? AND comment_id = ?
        `;
    const { rows } = await scyllaDbClient.execute(scoredCommentsSelectQuery, [videoId, parentCommentId], { prepare: true });
    const comment = rows[0];

    if (!comment) {
      throw new Error('Parent comment not found.');
    }

    const newRepliesCount = comment.replies_count + 1;

    // Step 3: Recalculate score
    const newScore = calculateCommentScore({
      likes: comment.likes_count,
      dislikes: comment.dislikes_count,
      createdAt: comment.created_at,
      repliesCount: newRepliesCount,
    });

    // Step 4: Update replies_count and score
    const updateQuery = `
            UPDATE scored_comments_by_video
            SET replies_count = ?, score = ?
            WHERE video_id = ? AND comment_id = ?
        `;
    const updateParams = [newRepliesCount, newScore, videoId, parentCommentId];
    await scyllaDbClient.execute(updateQuery, updateParams, { prepare: true });

    // step 5: Update replies_count in comments_by_video
    const updateRepliesCountQuery = `
            UPDATE comments_by_video
            SET replies_count = ?
            WHERE video_id = ? AND comment_id = ?
        `;
    const updateRepliesCountParams = [newRepliesCount, videoId, parentCommentId];
    await scyllaDbClient.execute(updateRepliesCountQuery, updateRepliesCountParams, { prepare: true });

  } catch (error) {
    logger.error('Error creating reply', {
      error,
      parentCommentId: reply.parentCommentId,
      replyId: reply.replyId,
    });
    throw new Error(`Failed to create reply: ${(error as Error).message}`);
  }
}

async function getRepliesByComment(parentCommentId: string, lastReplyId?: string, limit: number = 10): Promise<Reply[]> {
  try {
    let query = `
            SELECT * FROM replies_by_comment
            WHERE parent_comment_id = ?
        `;
    const params: any[] = [parentCommentId];
    if (lastReplyId) {
      query += ' AND reply_id < ?';
      params.push(lastReplyId);
    }
    query += ' LIMIT ?';
    params.push(limit);

    const result = await scyllaDbClient.execute(query, params, { prepare: true });
    return result.rows.map(row => ({
      parentCommentId: row.parent_comment_id,
      replyId: row.reply_id,
      videoId: row.video_id,
      userName: row.user_name,
      userAvatar: row.user_avatar,
      content: row.content,
      createdAt: row.created_at,
      edited: row.edited,
      likesCount: row.likes_count,
      dislikesCount: row.dislikes_count,
    }));
  } catch (error) {
    logger.error('Error fetching replies by comment', { error, parentCommentId });
    throw new Error(`Failed to fetch replies for comment ${parentCommentId}: ${(error as Error).message}`);
  }
}

async function reactToReply(replyId: string, commentId: string, type: 'like' | 'dislike'): Promise<void> {
  try {
    // Fetch current values from replies_by_comment
    const selectQuery = `
            SELECT created_at, likes_count, dislikes_count
            FROM replies_by_comment
            WHERE parent_comment_id = ? AND reply_id = ?
        `;
    const { rows } = await scyllaDbClient.execute(selectQuery, [commentId, replyId], { prepare: true });
    if (rows.length === 0) {
      throw new Error('Reply not found.');
    }
    const reply = rows[0];

    const updatedLikes = reply.likes_count + (type === 'like' ? 1 : 0);
    const updatedDislikes = reply.dislikes_count + (type === 'dislike' ? 1 : 0);
    // Update the reply with the new like/dislike count
    const updateQuery = `
            UPDATE replies_by_comment
            SET likes_count = ?, dislikes_count = ?
            WHERE parent_comment_id = ? AND reply_id = ?
        `;
    const updateParams = [updatedLikes, updatedDislikes, commentId, replyId];
    await scyllaDbClient.execute(updateQuery, updateParams, { prepare: true });
  } catch (error) {
    logger.error('Error reacting to reply', { error, replyId, commentId });
    throw new Error(`Failed to react to reply: ${(error as Error).message}`);
  }
}

export default {
  createReply,
  getRepliesByComment,
  reactToReply,
};