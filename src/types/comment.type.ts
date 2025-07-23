export interface Comment{
    commentId: string;
    videoId: string;
    content: string;
    createdAt: Date;
    edited: boolean;
    likesCount: number;
    dislikesCount: number;
    repliesCount: number;

    userId?: string;
    userName: string;
    userAvatar?: string;
}
