import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/Cloudinary.js"
import { Apisuccess } from "../utils/Apisuccess.js";
const registerUser=asyncHandler(async(req,res)=>{
   const {fullname,email,username} =req.body
   console.log("email:",email)
   if(fullname === ""){
       throw new Apierror(400,"Fullname is required")
   }
   if(email===""){
       throw new Apierror(400,"Email is required")
   }
   if(username===""){
       throw new Apierror(400,"username is required")
   }
   const existeduser=User.findOne({
    $or:[{username},{email}]
   })
   if(existeduser){
    throw new Apierror(409,"User already exists ")
   }
    const avatarlocalpath= req.files?.avatar[0]?.path;
    const coverimagelocalpath=req.files?.coverimage[0]?.path; 
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
export {registerUser}