import scyllaDbClient from "../db/scyllaDbClient";
import logger from "../logger/winston";
import { Video } from "../types/video.type";

async function getAllVideos(): Promise<Video[]> {
    try {
        const query = `SELECT * FROM videos`;
        const result = await scyllaDbClient.execute(query, [], { prepare: true });
        return result.rows.map(row => ({
            videoId: row.video_id,
            title: row.title,
            createdAt: row.created_at
        })) as Video[];
    } catch (error) {
        logger.error("Error fetching videos:", error);
        throw new Error("Failed to fetch videos");
    }
}

export default {
    getAllVideos
};