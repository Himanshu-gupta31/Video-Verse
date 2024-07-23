import { Router } from "express";
import { getChannelSubscriber, getSubscribedChannel, togglesSubscription , checkSubscriber } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router=Router()
router.use(verifyJWT)
router.route("/toggle/sub/:channelId").post(togglesSubscription)
router.route("/getchannel/sub/:channelId").get(getChannelSubscriber)
router.route("/getsubscribedchannel/sub/:subscriberId").get(getSubscribedChannel)
router.route("/checksubscription/:channelId").get(checkSubscriber)
export default router