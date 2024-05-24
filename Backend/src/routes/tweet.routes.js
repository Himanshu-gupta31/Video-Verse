import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { createtweet, updatetweet,deletetweet } from "../controllers/tweet.controller.js";
const router=Router();
router.use(verifyJWT)
router.route("/tweet").post(createtweet)
router.route("/updatetweet/u/:tweetId").patch(updatetweet)
router.route("/deletetweet/d/:tweetId").delete(deletetweet)
export default router