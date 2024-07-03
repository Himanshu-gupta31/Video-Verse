import { Router } from "express";
import { loginUser, logoutuser, registerUser,refreshaccesstoken,addVideoToWatchHistory, changepassword, getcurrentuser, updatenameandemail, changeavatar, changecoverimage, getuserchannelprofile, watchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage" ,
            maxCount:1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
//secured route
router.route("/logout").post(verifyJWT,logoutuser)
router.route("/refreshtoken").post(refreshaccesstoken)
router.route("/changepassword").post(verifyJWT,changepassword)
router.route("/getcurrentuser").get(verifyJWT,getcurrentuser)
router.route("/updatedetails").patch(verifyJWT,updatenameandemail) //patch isliye use karte kyunki agar post karenge toh saari details update ho jaayegi post mein toh 
router.route("/changeavatar").patch (verifyJWT,upload.single("avatar"),changeavatar)
router.route("/changecoverimage").patch(verifyJWT,upload.single("coverimage"),changecoverimage)
router.route("/c/:username").get(verifyJWT,getuserchannelprofile)
router.route("/history").get(verifyJWT,watchHistory)
router.route("/addToWatchHistory/:videoId").put(verifyJWT,addVideoToWatchHistory)
export default router