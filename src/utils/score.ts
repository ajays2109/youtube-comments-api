export function calculateCommentScore(params:{
    likes: number,
    dislikes: number,
    createdAt: Date,
    repliesCount?: number
}){
    const {likes, dislikes, createdAt, repliesCount} = params;
    const currentTime = new Date();
    const hoursSincePost = (currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 10 - hoursSincePost); 
    const score = (likes * 2) - (dislikes * 0.5) + recencyBoost + (repliesCount || 0) * 1.5;
    return parseFloat(score.toFixed(2));
}