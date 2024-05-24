import { asyncHandler } from "../utils/asyncHandler.js";
import {Playlist} from "../models/playlist.model.js"
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import { isValidObjectId } from "mongoose";
const createplaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body
    
    const playlist=await Playlist.create({
        name:name,
        description:description,
        owner:req.user?._id
    })
    if(!playlist){
        throw new Apierror(404,"Playlist couldnt be created")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Playlist created successfully",playlist))
})
const updateplaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    const {name,description}=req.body
    if(!isValidObjectId(playlistId)){
        throw new Apierror(400,"Invalid playlist id")
    }
    if(!description || description.length===0){
        throw new Apierror(400,"Add some description cannot be empty")
    }
    if(!name || name.length===0){
        throw new Apierror(400,"Playlist name cannot be empty")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new Apierror(400,"Playlist not found")
    }
    if(playlist?.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only the valid owner can change playlist")
    }
    const updated=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:name,
                description:description
            }
        },{new:true}
    )
    if(!updated){
        throw new Apierror(500,"Playlist cannot be updated now.Try again later")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Playlist updated successfully",{}))
})
const deleteplaylist=asyncHandler(async(req,res)=>{
     const {playlistId}=req.params
     if(!isValidObjectId(playlistId)){
        throw new Apierror(400,"Invalid Playlist id")
     }
     const playlist=await Playlist.findById(playlistId)
     if(playlist?.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(400,"Only the valid owner can change playlist")
     }
     const deleted=await Playlist.findByIdAndDelete(playlistId)
     if(!deleted){
        throw new Apierror(500,"Couldnt delete Playlist.Try again later")
     }
     return res.status(200)
     .json(new Apisuccess(200,"Playlist deleted successfully",{}))
})
const getuserplaylist=asyncHandler(async(req,res)=>{
     const {userId}=req.params
     if(!isValidObjectId(userId)){
        throw new Apierror(400,"Invalid userId")
     }
     const playlist=await Playlist.find({
        owner:userId
     })
     if(!playlist || playlist.length===0){
        throw new Apierror(404,"No playlist found")
     }
     return res.status(200)
     .json(new Apisuccess(200,"Playlist successfully fetched",{}))
})
const getplaylistbyid=asyncHandler(async(req,res)=>{
      const {playlistId}=req.params
      if(!isValidObjectId(playlistId)){
        throw new Apierror(400,"Invalid playlist id")
      }
      const playlist=await Playlist.findById(playlistId)
      if(!playlist){
        throw new Apierror(404,"Couldnt find the playlist")
      }
      return res.status(200)
      .json(new Apisuccess(200,"Playlist found",{playlist}))
})

export default {createplaylist,updateplaylist,deleteplaylist,getuserplaylist,getplaylistbyid}