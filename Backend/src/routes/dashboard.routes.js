import { Router } from "express";
import {getChannelStatstotallikes,getChannelStatusTotalVideos,getChannelStatusTotalSubscriber,getChannelVideos} from "../controllers/dashboard.controller"
import { verifyJWT } from "../middlewares/Auth.middleware";
const router=Router()
router.use(verifyJWT)
router.route("/dashboard/totallikes").get(getChannelStatstotallikes)
router.route("/dashboard/totalvideos").get(getChannelStatusTotalVideos)
router.route("/dashboard/totalsubs").get(getChannelStatusTotalSubscriber)
router.route("/dashboard/videos").get(getChannelVideos)
export default router
