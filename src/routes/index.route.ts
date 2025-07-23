import { Router } from "express";
import userRoutes from "./users.route";
import commentRoutes from "./comments.route";
import videoRoutes from "./video.route";
import replyRoutes from "./reply.route";
const router = Router();

// Mount user routes
router.use("/user", userRoutes);
router.use("/comment", commentRoutes);
router.use("/video", videoRoutes);
router.use("/reply", replyRoutes);


export default router;