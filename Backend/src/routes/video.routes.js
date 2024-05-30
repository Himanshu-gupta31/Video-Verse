import { Router } from 'express';
import {
    
    updateVideothumbnail,
    updateTitleAndDescription,
    getVideoById,
    togglePublishedStatus,
    publishVideo,
    deleteVideo
    
} from "../controllers/video.controller.js"
import { verifyJWT } from '../middlewares/Auth.middleware.js';
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideothumbnail)
    .patch(updateTitleAndDescription)

router.route("/toggle/publish/:videoId").patch(togglePublishedStatus);
router.route("/publishvideo").post(publishVideo)

export default router