import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import { Video } from "../models/video.model.js";
import { uploadOncloudinary } from "../utils/Cloudinary.js";
import { isValidObjectId } from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;

  // Ensure the page and limit are integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const sortDirection = sortType === "asc" ? 1 : -1;

  // Build the filter query
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" }; // Assuming you want to search by title, case insensitive
  }
  if (userId) {
    filter.userId = userId;
  }

  try {
    // Fetch the videos with pagination, filtering, and sorting
    const videos = await Video.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Get the total count of videos that match the filter
    const totalVideos = await Video.countDocuments(filter);

    // Send the response
    res.status(200).json(
      new Apisuccess(200, "Data send successfully", {
        success: true,
        data: videos,
        totalVideos,
        totalPages: Math.ceil(totalVideos / limitNumber),
        currentPage: pageNumber,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

// publish video controller function
const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(title);
  console.log(description);
  console.log(req.body);
  console.log(req.files);
  if (!title || title.length === 0) {
    throw new Apierror(400, "Title field cannot be empty");
  }
  if (!description || description.length === 0) {
    throw new Apierror(400, "Description cannot be empty");
  }
  let videoFilepath = req.files?.videoFile[0].path;
  let thumbnailPath = req.files?.thumbnail[0].path;
  if (!videoFilepath) {
    throw new Apierror(400, "No video uploaded");
  }
  if (!thumbnailPath) {
    throw new Apierror(400, "No thumbnail found");
  }
  const video = await uploadOncloudinary(videoFilepath);
  const thumbnail = await uploadOncloudinary(thumbnailPath);
  console.log(thumbnail);
  if (!video) {
    throw new Apierror(400, "Video should be added compulsory");
  }
  if (!thumbnail) {
    throw new Apierror(400, "Video should be added compulsory");
  }
  const uploadvideo = await Video.create({
    title: title,
    owner: req.user?._id,
    description: description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    duration: video.duration,
    isPublished: true,
  });
  if (!uploadvideo) {
    throw new Apierror(404, "Couldnt upload the video");
  }
  return res
    .status(200)
    .json(new Apisuccess(200, "Video uplaoded successfully", { uploadvideo }));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new Apierror(400, "Invalid video id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new Apierror("Couldnt Find the video or video does not exist");
  }
  return res
    .status(200)
    .json(new Apisuccess(200, "Video found successfully", { video }));
});
const updateVideothumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new Apierror(400, "Invalid Video Id");
  }
  const video = await Video.findById(videoId);
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new Apierror(
      400,
      "Only the owner of the video can update the thumbnail",
    );
  }
  const thumbnailPath = req.file?.path;
  if (!thumbnailPath) {
    throw new Apierror(400, "No thumbnail file uploaded");
  }
  const thumbnail = await uploadOncloudinary(thumbnailPath);
  const updatevideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    { new: true },
  );
  if (!updatevideo) {
    throw new Apierror(404, "Thumbnail couldnt be updated");
  }
  return res
    .status(200)
    .json(new Apisuccess(200, "Thumbnail updated successfully", { thumbnail }));
});

const updateTitleAndDescription = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoId } = req.params;
  if (!title || title.length === 0) {
    throw new Apierror(400, "Title field cannot be empty");
  }
  if (!description || description.length === 0) {
    throw new Apierror(400, "Description field cannot be empty");
  }
  const video = await Video.findById(videoId);
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new Apierror(
      400,
      "Only the owner of the video can update the title and description",
    );
  }
  const updatetitleanddescription = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    { new: true },
  );
  if (!updatetitleanddescription) {
    throw new Apierror(400, "Title and description could not be updated");
  }
  return res.status(200).json(
    new Apisuccess(200, "Title and description updated successully", {
      updatetitleanddescription,
    }),
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new Apierror(400, "Invalid Video Id");
  }
  const video = await Video.findById(videoId);
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new Apierror(400, "Only the owner of the video can delete the video");
  }
  const deletevideo = await Video.findByIdAndDelete(videoId);
  if (!deletevideo) {
    throw new Apierror(404, "Video couldnt be deleted");
  }
  return res
    .status(200)
    .json(new Apisuccess(200, "Video deleted successfully", { deletevideo }));
});

const viewsinvideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  // Validate videoId
  if (!isValidObjectId(videoId)) {
    return res.status(400).json(new Apierror(400, "Invalid videoId"));
  }

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json(new Apierror(404, "Video not found"));
    }

    // Initialize views as an empty array if it is not already an array
    if (!Array.isArray(video.views)) {
      video.views = [];
    }

    // Check if the user has already viewed the video
    if (!video.views.includes(userId)) {
      video.views.push(userId);
      await video.save();
    }

    const totalViews = video.views.length;

    return res
      .status(200)
      .json(
        new Apisuccess(200, "Total views fetched successfully", { totalViews }),
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new Apierror(500, "Internal Server Error"));
  }
});


const togglePublishedStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new Apierror(400, "Invalid video id");
  }
  const video = await Video.findById(videoId);
  if (video.owner.toString() !== req.user?._id.toString()) {
    throw new Apierror(400, "Only the owner of the video can toggle publish");
  }
  const toggle = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    { new: true },
  );
  if (!toggle) {
    throw new Apierror(400, "Failed to toggle published");
  }
  return res
    .status(200)
    .json(
      new Apisuccess(200, "Video published toggle successfully", { toggle }),
    );
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideothumbnail,
  updateTitleAndDescription,
  deleteVideo,
  togglePublishedStatus,
  viewsinvideo,
};
