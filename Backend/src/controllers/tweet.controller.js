import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {Apierror} from "../utils/ApiError.js"
import {Apisuccess} from "../utils/Apisuccess.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createtweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        throw new Apierror("Enter valid content");
    }
    console.log("req.user:", req.user); // Debug log
    const user = await User.findById(req.user?._id);
    console.log("User found:", user); // Debug log
    if (!user) {
        throw new Apierror(400, "Couldn't find the user");
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });
    if (!tweet) {
        throw new Apierror(500, "Try again later");
    }
    return res.status(200).json(new Apisuccess(200, "Tweeted successfully", tweet));
});
const updatetweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const {content}=req.body
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new Apierror(400, "Invalid tweet ID");
    }
    if(!content && content.trim().length===0){
        throw new Apierror(400,"Content field is empty")
    }
    const newtweet = await Tweet.findById(tweetId);

    if (!newtweet) {
        throw new Apierror(404, "Tweet not found");
    }

    if (newtweet?.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "only owner can edit thier tweet");
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
        throw new Apierror(500,"Try again later")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweet updated successfully",tweet))
})
const deletetweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new Apierror(400, "Invalid tweet ID");
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new Apierror(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "only owner can edit thier tweet");
    }
    await Tweet.findByIdAndDelete(tweetId)
    
    if(!tweet){
        throw new Apierror(500,"Try again later")
    }
    return res.status(200)
    .json(new Apisuccess(200,"Tweet deleted successfully",{}))
})
const getusertweets=asyncHandler(async(req,res)=>{
     const {userId}=req.params
     if(!isValidObjectId(userId)){
        throw new Apierror(400,"Invalid user id")
     }
     const user=await User.findById(userId)
     if(!user){
        throw new Apierror(400,"User does not exist")
     }
     const alltweets=await Tweet.find(
        {
            owner:userId
        }
     )
     if(alltweets.length===0){
        throw new Apierror(400,"No tweets by the user")
     }
     return res.status(200)
     .json(new Apisuccess(200,"All tweets fetched successfully",{alltweets}))
})
const getAllTweets = asyncHandler(async (req, res) => {
    const alltweets = await Tweet.aggregate([
      {
        $lookup: {
          from: 'users', // The name of the users collection
          localField: 'owner', // The field in the tweets collection
          foreignField: '_id', // The field in the users collection
          as: 'user', // The name of the field to add the user data
        },
      },
      {
        $unwind: '$user', // Unwind the user array
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          'user.username': 1, // Include only the username field from the user data
        },
      },
    ]);
  
    return res.status(200).json(new Apisuccess(200, 'All Tweets fetched', { alltweets }));
  });
  
export {createtweet,updatetweet,deletetweet,getusertweets,getAllTweets}
