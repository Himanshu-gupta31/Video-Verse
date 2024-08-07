import { Router } from "express";
import { togglecomment, togglevideoliked,getlikedvideos, toggletweet,checkVideoLiked } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router=Router()
router.use(verifyJWT)
router.route("/toggle/v/:videoId").post(togglevideoliked)
router.route("/toggle/c/:commentId").post(togglecomment)
router.route("/toggle/t/:tweetId").post(toggletweet)
router.route("/videos").get(getlikedvideos)
router.route("/check/v/:videoId").get(checkVideoLiked);

export default router