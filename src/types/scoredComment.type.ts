import { Comment } from './comment.type';
export interface ScoredComment extends Comment {
    score: number;
    repliesCount: number;
}