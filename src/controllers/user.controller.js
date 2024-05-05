import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/Cloudinary.js"
import { Apisuccess } from "../utils/Apisuccess.js";
import jwt from "jsonwebtoken";
const generaterefreshandaccesstoken=async(userId)=>{
   try {
    const user=await User.findById(userId)
    const accesstoken= await user.generateAccessToken()
    const refreshtoken=await user.generateRefreshToken()
    user.refreshtoken=refreshtoken
    await user.save({ValidationBeforeSave:false})
    return {accesstoken,refreshtoken}

   } catch (error) {
     throw new Apierror(500,"Something went wrong while generating refresh and access tokeb")
   }
}
const registerUser=asyncHandler(async(req,res)=>{
   const {fullname,email,username,password} =req.body
   
   if(fullname === ""){
       throw new Apierror(400,"Fullname is required")
   }
   if(email===""){
       throw new Apierror(400,"Email is required")
   }
   if(username===""){
       throw new Apierror(400,"username is required")
   }
   if(password===""){
    throw new Apierror(400,"password is required")
   }
   const existeduser= await User.findOne({
    $or:[{username},{email}]
   })
   if(existeduser){
    throw new Apierror(409,"User already exists ")
   }
    const avatarlocalpath= req.files?.avatar[0]?.path;
    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0  ){
        coverimagelocalpath=req.files. coverimage[0].path
    }
    if(!avatarlocalpath){
        throw new Apierror(400,"Avatar file is compulsory ")
    }
    const avatar= await uploadOncloudinary(avatarlocalpath)
    const coverimage=await uploadOncloudinary(coverimagelocalpath)
    if(!avatar){
        throw new Apierror(400,"Avatar file is compulsory ")
    }
    const user=await User.create({
        fullname,
        email,
        password,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
        username:username.toLowerCase()
    })
    const createduser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createduser){
        throw new Apierror(500,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new Apisuccess(200,"User is registered successfully ", createduser)
    )
})
const loginUser=asyncHandler(async(req,res)=>{
     const {email,username,password}=req.body
     if(!(email||username)){
       throw new Apierror(400,"Email or Username is required")
     }
     const user=await User.findOne({
        $or:[{username},{email}]
     })
     if(!user){
        throw new Apierror(404,"User does not exist ")
     }
     const isPasswordValid= await user.isPasswordCorrect(password)  
     if(!isPasswordValid){
       throw new Apierror(401,"Password entered is incorrect")
     }
     const{refreshtoken,accesstoken}=await generaterefreshandaccesstoken(user._id)
     const loggedinuser=User.findById(user._id).select("-password -refreshtoken").lean
     const options={
        httpOnly:true,
        secure:true
     }
     return res.status(200)
     .cookie("accesstoken",accesstoken,options)
     .cookie("refreshtoken",refreshtoken,options)
     .json(
        new Apisuccess(
            200,
            {
                user:loggedinuser,refreshtoken,accesstoken
            },
            "User is logged in"
        )
     )
    })
    const logoutuser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
            req.user._id,{
                $set:
                {
                    refreshtoken:undefined // why not access token
                }
            },{
                new:true
            }
        )
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .clearCookie("accesstoken",options)
        .clearCookie("refreshtoken",options)
        .json(
            new Apisuccess(200,{},"User logout")
        )
    })
const refreshaccesstoken=asyncHandler(async(req,res)=>{
   const incomingrefreshtoken= req.cookies.refreshtoken || req.body.refreshtoken
   if(!incomingrefreshtoken){
    throw new Apierror(401,"Unauthorized Access")
   }
   try {
    const decodedtoken= jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
     const user=await User.findById(decodedtoken?._id)
     if(!user){
         throw new Apierror(401," Refresh token is invalid")
     }
     if(incomingrefreshtoken !== user.refreshtoken){
         throw new Apierror(401,"Refresh token is expired or used")
     }
     const {refreshtoken,accesstoken}=await generaterefreshandaccesstoken(user._id)
     const options={
         httpOnly:true,
         secure:true 
     }
     return res.status(200)
     .cookie("Access token",accesstoken,options)
     .cookie("Refresh token",refreshtoken,options)
     .json(
         200,
         {refreshtoken,accesstoken},
         "Access token refreshed "
     )
   } catch (error) {
     throw new Apierror(401,error?.message || "Invalid refresh token")
   }
   
})
export {registerUser,loginUser,logoutuser,refreshaccesstoken}