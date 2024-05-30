import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import { Video } from "../models/video.model.js";
import { uploadOncloudinary } from "../utils/Cloudinary.js";
import { isValidObjectId } from "mongoose";
const getAllVideos=asyncHandler(async(req,res)=>{
    const {page = 1, limit = 10, query, sortBy, sortType, userId}=req.query
    
})
const publishVideo=asyncHandler(async(req,res)=>{
    const {title,description}=req.body
    if(!title && title.length===0){
        throw new Apierror(400,"Title field cannot be empty")
    }
    if(!description && description.length===0){
        throw new Apierror(400,"Description cannot be empty")
    }
    let videoFilepath=req.files?.videoFile[0].path;
    let thumbnailPath=req.files?.thumbnail[0].path;
    if(!videoFilepath){
        throw new Apierror(400,"No video uploaded")
    }
    if(!thumbnailPath){
        throw new Apierror(400,"No thumbnail found")
    }
    const video=await uploadOncloudinary(videoFilepath)
    const thumbnail=await uploadOncloudinary(thumbnailPath)
    if(!video){
        throw new Apierror(400,"Video should be added compulsory")
    }
    if(!thumbnail){
        throw new Apierror(400,"Video should be added compulsory")
    }
    const uploadvideo=await Video.create({
        title:title,
        owner:req.user?._id,
        description:description,
        video:video,
        thumbnail:thumbnail,
        duration:duration.video,
        isPublished:true,
        
    })
    if(!uploadvideo){
        throw new Apierror(404,"Couldnt upload the video")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Video uplaoded successfully",{uploadvideo}))
})
const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new Apierror("Couldnt Find the video or video does not exist")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Video found successfully",{video}))

})
const updateVideothumbnail=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid Video Id")
    }
    const video=await Video.findById(videoId)
    if(video.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only the owner of the video can update the thumbnail")
    }
    const thumbnailPath=req.file?.path
    if (!thumbnailPath) {
        throw new Apierror(400, "No thumbnail file uploaded");
    }
    const thumbnail=await uploadOncloudinary(thumbnailPath)
    const updatevideo=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail:thumbnail.url
            }
        },{new:true}
              
    )
    if(!updatevideo){
        throw new Apierror(404,"Thumbnail couldnt be updated")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Thumbnail updated successfully",{thumbnail}))
})
const updateTitleAndDescription=asyncHandler(async(req,res)=>{
    const {title,description}=req.body
    const {videoId}=req.params
    if(!title || title.length===0){
        throw new Apierror(400,"Title field cannot be empty")
    }
    if(!description || description.length===0){
        throw new Apierror(400,"Description field cannot be empty")
    }
    const video=await Video.findById(videoId)
    if(video.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only the owner of the video can update the title and description")
    }
    const updatetitleanddescription=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title:title,
                description:description
            }
        },{new:true}
    )
    if(!updatetitleanddescription){
        throw new Apierror(400,"Title and description could not be updated")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Title and description updated successully",{updatetitleanddescription}))
})
const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid Video Id")
    }
    const video=await Video.findById(videoId)
    if(video.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only the owner of the video can delete the video")
    }
    const deletevideo=await Video.findByIdAndDelete(videoId)
    if(!deletevideo){
        throw new Apierror(404,"Video couldnt be deleted")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Video deleted successfully",{deletevideo}))
})
const togglePublishedStatus=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid video id")
    }
    const video=await Video.findById(videoId)
    if(video.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only the owner of the video can toggle publish")
    }
    const toggle=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                isPublished:!video.isPublished
            }
        },{new:true}
    )
    if(!toggle){
        throw new Apierror(400,"Failed to toggle published")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Video published toggle successfully",{toggle}))
})
export {getAllVideos,publishVideo,getVideoById,updateVideothumbnail,updateTitleAndDescription,deleteVideo,togglePublishedStatus}