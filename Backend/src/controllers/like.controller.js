import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import { Like } from "../models/like.model.js";
import { isValidObjectId } from "mongoose";

const togglevideoliked=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid Videoid")
    }
    const videolikealready=await Like.findOne({
        $and:[{video:videoId},{likedby:req.user?._id}]
    })
    if(videolikealready){
        await Like.findByIdAndDelete(
            videolikealready?._id
        )
    }
    else{
        await Like.create({
            video:videoId,
            likedby:req.user?._id
        })
    }
    return res.status(200)
    .json(new Apisuccess(200,"Liked already",{}))

}) 
const togglecomment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    if(!isValidObjectId(commentId)){
        throw new Apierror(404,"Comment id is invalid")
    }
    const comment=await Like.findOne({
        $and:[{comment:commentId},{likedby:req.user?._id}]
    })
    if(comment){
        await Like.findByIdAndDelete(comment?._id)
    }
    else{
        await Like.create({
            comment:commentId,
            likedby:req.user?._id
        })
    }
    return res.status(200)
    .json(new Apisuccess(200,"Comment liked successfully",{}))
})
const toggletweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if(!isValidObjectId(tweetId)){
        throw new Apierror(400,"Invalid tweet id")
    }
    const tweet=await Like.findOne({
        $and:[{tweet:tweetId},{likedby:req.user?._id}]
    })
    if(tweet){
        await Like.findByIdAndDelete(tweetId)
    }
    else{
        await Like.create({
            tweet:tweetId,
            likedby:req.user?._id
        })
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweet liked successfully",{}))
})
const getlikedvideos=asyncHandler(async(req,res)=>{
    const likedVideos=await Like.aggregate([{
        $match:{
            likedby:req.user?._id
        },
    },
    {
        $lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"like"
        }
    },
    {
        $addFields:{
            totallikedbyuser:{
                $size:"$like"
            }
        }
    },
    {
        $project:{
            likedby:1,
            totallikedbyuser:1,
            like:1
        }
    }
    
    ])
    if (!likedVideos || likedVideos.length === 0) {
        throw new Apierror(404, "Couldn't find liked videos");
    }
    return res.status(200)
    .json(new Apisuccess(200,"Fetched all the liked video successfully",{}))
})
export {togglevideoliked,togglecomment,toggletweet,getlikedvideos}