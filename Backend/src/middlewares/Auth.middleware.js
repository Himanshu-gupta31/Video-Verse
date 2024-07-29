import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        console.log(req.headers.cookie?.split('accesstoken=')[1])
        console.log("Accesstoken",req.cookies?.accesstoken)
        console.log("Token:", token); // Debugging log
        
        if (!token) {
            throw new Apierror(401, "Unauthorized access");
        }
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken");
        if (!user) {
            throw new Apierror(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid access token");
    }
});
