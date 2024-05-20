import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware";
import { createtweet } from "../controllers/tweet.controller";
const router=Router();
router.use(verifyJWT)
router.route("/").post(createtweet)