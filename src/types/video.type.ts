export interface Video {
    videoId: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    creatorId?: string;
    createdAt: Date;
    tags?: string[];
}
