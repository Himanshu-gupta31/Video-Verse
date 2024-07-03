import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { createtweet, updatetweet,deletetweet, getusertweets,getAllTweets } from "../controllers/tweet.controller.js";
const router=Router();
router.use(verifyJWT)
router.route("/tweet").post(createtweet)
router.route("/updatetweet/u/:tweetId").patch(updatetweet)
router.route("/deletetweet/d/:tweetId").delete(deletetweet)
router.route("/user/:userId").get(getusertweets)
router.route("/alltweets").get(getAllTweets)
export default router