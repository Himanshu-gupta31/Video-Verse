import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"

const addComment=asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {content}=req.body
    const video= await Video.findById(videoId)
    if(!video){
        throw new Apierror(400,"Video not found")
    }
    const comment=await Comment.create({
        content:content,
        video:video,
        owner:req.user?._id
    })
    if(!comment){
        throw new Apierror(404,"Couldnt comment")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Commented Successfully",comment))
})
const updateComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const {content}=req.body
    if(!content || content.trim().length===0){
        throw new Apierror(400,"Content cannot be empty")
    }
    const verifycomment=await Comment.findById(commentId)
    if(!verifycomment){
      throw new Apierror(400,"Couldnt find the comment")
    }
    if(!verifycomment?.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only valid user can update comment")
    }
    const comment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },{new:true}
    )
    if(!comment){
        throw new Apierror(404,"Couldnt update the comment")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Comment updated successfully",comment))
})
const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new Apierror(402,"Couldnt find the comment")
    }
    if(comment.owner?.toString()!==req.user?._id.toString()){ 
        throw new Apierror(400,"Only the owner can delete comment")
    }
    const newcomment=await Comment.findByIdAndDelete(commentId)
    if(!newcomment){
        throw new Apierror(500,"Couldnt delete the comment")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Comment deleted successfully",newcomment))
})
export {addComment,updateComment,deleteComment}