import { Router } from "express";
import { getChannelSubscriber, getSubscribedChannel, togglesSubscription } from "../controllers/subscription.controller";
import { verifyJWT } from "../middlewares/Auth.middleware";
router.use(verifyJWT)
const router=Router()
router.route("/toggle/sub/:channelId").post(togglesSubscription)
router.route("getchannel/sub/:channelId").get(getChannelSubscriber)
router.route("getsubscribedchannel/sub/:subscriberId").get(getSubscribedChannel)
export default router