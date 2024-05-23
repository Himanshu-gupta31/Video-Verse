import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {Apisuccess} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createtweet=asyncHandler(async(req,res)=>{
    const {content}=req.body
    if(!content || content.trim().length===0){
        throw new ApiError("Enter Valid content")
    }
    const user=await User.findById(req.body?._id)
    if(!user){
        throw new ApiError(400,"Couldnt Find the User")
    }
    const tweet=await Tweet.create({
        content,
        owner:req.body._id
    })
    if(!tweet){
        throw new ApiError(500,"Try again later")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweeted successfully",tweet))
})
const updatetweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const {content}=req.body
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    if(!content && content.trim().length===0){
        throw new ApiError(400,"Content field is empty")
    }
    const newtweet = await Tweet.findById(tweetId);

    if (!newtweettweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (newtweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit thier tweet");
    }
    const tweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:content
            }
        },{new:true}
    )
    if(!tweet){
        throw new ApiError(500,"Try again later")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweet updated successfully",tweet))
})
const deletetweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit thier tweet");
    }
    await Tweet.findByIdAndDelete(tweetId)
    
    if(!tweet){
        throw new ApiError(500,"Try again later")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweet deleted successfully",{}))
})

//getalltweet
export {createtweet,updatetweet,deletetweet}
