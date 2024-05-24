import { Router } from "express";
import {createplaylist,updateplaylist,deleteplaylist,getplaylistbyid,getuserplaylist} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router=Router()
router.use(verifyJWT)
router.route("/").post(createplaylist)
router.route("/updateplaylist/u/:playlistId").patch(updateplaylist)
router.route("/deleteplaylist/d/:playlistId").delete(deleteplaylist)
router.route("getplaylistbyid/:playlistId").get(getplaylistbyid)
router.route("/user/:userId").get(getuserplaylist)
export default router