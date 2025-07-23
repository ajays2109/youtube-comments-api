export interface Reply {
    parentCommentId: string;
    replyId: string;
    videoId: string;

    userId?: string;
    userName: string;
    userAvatar?: string;

    content: string;
    createdAt: Date;
    edited: boolean;
    likesCount: number;
    dislikesCount: number;
}
