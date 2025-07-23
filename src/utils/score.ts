/**
 * Utility function to calculate the score of a comment.
 * The score is calculated based on likes, dislikes, recency, and replies count.
 * The weightage for likes, dislikes, recency, and replies count can be adjusted as needed.
 * Current weightage is :
 * - Likes: 2 points each
 * - Dislikes: -0.5 points each
 * - Recency: A boost that decreases over time, with a maximum of 10 points for comments created within the last 10 hours
 * - Replies count: 1.5 points each
 * The score is designed to be a positive number that can be used for sorting comments.
 */
export function calculateCommentScore(params:{
    likes: number,
    dislikes: number,
    createdAt: Date,
    repliesCount?: number
}){
  const {likes, dislikes, createdAt, repliesCount} = params;
  const currentTime = new Date();
  const hoursSincePost = (currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60); // Hours since the comment was created
  // Recency boost: More recent comments get a higher score
  const recencyBoost = Math.max(0, 10 - hoursSincePost); // A simple recency boost that decreases over time
  // Calculate the score
  const score = (likes * 2) - (dislikes * 0.5) + recencyBoost + (repliesCount || 0) * 1.5; // Replies count also contributes positively to the score
  // Ensure the score is not negative
  if (score < 0) {
    return 0;
  }
  // Return the score rounded to two decimal places
  // This ensures that the score is always a positive number and can be used for sorting or displaying
  if (isNaN(score)) {
    return 0; // If the score calculation results in NaN, return 0
  }
  return parseFloat(score.toFixed(2));
}