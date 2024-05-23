import { Router } from "express";
import { togglecomment, togglevideoliked } from "../controllers/like.controller";
import { verifyJWT } from "../middlewares/Auth.middleware";
const router=Router()
router.use(verifyJWT)
router.route("/toggle/v/:videoId").post(togglevideoliked)
router.route("/toggle/c/:commentId").post(togglecomment)