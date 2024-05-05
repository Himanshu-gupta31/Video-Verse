import { Router } from "express";
import { loginUser, logoutuser, registerUser,refreshaccesstoken } from "../controllers/user.controller.js";
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
export default router