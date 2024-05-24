import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import {Video} from "../models/video.model.js"
import { mongoose } from "mongoose";
const getChannelStatus = asyncHandler(async (req, res) => {
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
    .json(new Apisuccess(200,"Videos liked",{}))
})

export {getChannelStatus}