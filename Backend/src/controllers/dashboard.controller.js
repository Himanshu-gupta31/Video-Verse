import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import { isValidObjectId, mongoose } from "mongoose";
const getChannelStatstotallikes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
  
    if (!userId) {
      throw new Apierror('User ID is required', 400);
    }
  
    const videoLiked = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "owner",
          foreignField: "_id", 
          as: "likes"
        }
      },
      {
        $addFields:{
            Likes:{
                $size:"$likes"
            }
        }
      },
      {
        $project:{
            Likes:1
        }
      }
    ])
    if (!videoLiked || videoLiked.length === 0) {
        throw new Apierror('No videos found for the given user', 404);
      }
    return res.status(200)
    .json(new Apisuccess(200,"Videos liked",{videoLiked}))
})
const getChannelStatusTotalVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!isValidObjectId(userId)) {
    throw new Apierror(400, "Invalid User Id");
  }

  const totalVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$owner",
        totalVideos: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        totalVideos: 1,
        userDetails: {
          username: 1,
          email: 1,
          fullname: 1,
        },
      },
    },
  ]);

  if (!totalVideos || totalVideos.length === 0) {
    throw new Apierror(404, "No videos found for this user");
  }

  return res.status(200).json(new Apisuccess(200, "Total video count fetched successfully", { totalVideos: totalVideos[0] }));
});
const getChannelStatusTotalSubscriber=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
    if(!userId){
      throw new Apierror(400,"Invalid User Id")
    }
    const totalSubscriber=await Subscription.aggregate([
      {
        $match:{
          channel:new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group:{
          _id:"$channel",
          totalSubscriber:{ $sum:1 }
        }
      },
      {
        $project:{
          totalSubscriber:1
        }
      }
    ])
    if(!totalSubscriber || totalSubscriber.length===0){
      throw new Apierror(404,"Total subscriber couldnt be fetched")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Total subscriber fetched successfully",{totalSubscriber}))

})
const getChannelVideos=asyncHandler(async(req,res)=>{
  const userId=req.user?._id;
  if(!isValidObjectId(userId)){
    throw new Apierror(400,"Invalid User Id")
  }
  const channelVideo=await Video.aggregate([
  {
    $match:{
      owner:new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $lookup:{
        from:"users",
        localField:"owner",
        foreignField:"_id",
        as:"allvideos"
    }
  },
  {
    $addFields:{
      totalvideo:{
        $size:"$allvideos"
      },
    }
  },
  {
    $project:{
      allvideo:1,
      totalvideo:1,
      title:1,
     }
  }
])

 if(!channelVideo || channelVideo.length===0){
  throw new Apierror(404,"All Videos cannot be fetched or no video uploaded")
 }
 return res.status(200)
 .json(new Apisuccess(200,"All videos fetched successfully",{channelVideo}))
})
export {getChannelStatstotallikes,getChannelVideos,getChannelStatusTotalVideos,getChannelStatusTotalSubscriber}