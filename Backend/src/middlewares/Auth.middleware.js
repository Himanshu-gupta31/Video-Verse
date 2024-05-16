import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT= asyncHandler(async(req,_,next)=>{
     try {
        const token=req.cookies?.accesstoken || req.header("Authorisation")?.replace("Bearer ","")
        if(!token){
           throw new Apierror(401,"Unauthorised access")
        }
       const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const user=  User.findById(decodedtoken?._id).select("-password -refreshtoken")
       if(!user){
           throw new Apierror(401,"Invalid Access Token")
       }
       req.user=user
       next()
     } catch (error) {
        throw new Apierror(401,error?.message || "Invalid acess token")
     }
})