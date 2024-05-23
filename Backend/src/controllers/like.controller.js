import { asyncHandler } from "../utils/asyncHandler";
import { Apierror } from "../utils/ApiError";
import { Apisuccess } from "../utils/Apisuccess";
import { Like } from "../models/like.model";
import { isValidObjectId } from "mongoose";

const togglevideoliked=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid Videoid")
    }
    const videolikealready=await Like.findOne({
        $and:[{video:videoId},{likedby:req.body?._id}]
    })
    if(videolikealready){
        await Like.findByIdAndDelete(
            videolikealready?._id
        )
    }
    else{
        await Like.create({
            video:videoId,
            likedby:req.body?._id
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
        $and:[{comment:commentId},{likedby:req.body?._id}]
    })
    if(comment){
        await Like.findByIdAndDelete(comment?._id)
    }
    else{
        await Like.create({
            comment:commentId,
            likedby:req.body?._id
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
        $and:[{tweet:tweetId},{likedby:req.body?._id}]
    })
    if(tweet){
        await Like.findByIdAndDelete(tweetId)
    }
    else{
        await Like.create({
            tweet:tweetId,
            likedby:req.body?._id
        })
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweet liked successfully",{}))
})
const getlikedvideos=asyncHandler(async(req,res)=>{
    await Like.aggregate([{
        $match:{
            likedby:req.body?._id
        },
    },
    {
        $lookup:{
            
        }
    }
    
    ])
})
export {togglevideoliked,togglecomment,toggletweet}