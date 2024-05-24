import mongoose from "mongoose"
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

//getalltweet
export {createtweet,updatetweet,deletetweet}
