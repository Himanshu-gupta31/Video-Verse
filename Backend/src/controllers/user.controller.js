import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary } from "../utils/Cloudinary.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"
;
const generaterefreshandaccesstoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = await user.generateAccessToken();
    const refreshtoken = await user.generateRefreshToken();
    user.accesstoken = accesstoken;
    user.refreshtoken = refreshtoken;
    await user.save({ ValidationBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new Apierror(
      500,
      "Something went wrong while generating refresh and access tokeb",
    );
  }
};


// const registerUser = asyncHandler(async (req, res) => {
//   const { fullname, email, username, password } = req.body;

//   if (fullname === "") {
//     throw new Apierror(400, "Fullname is required");
//   }
//   if (email === "") {
//     throw new Apierror(400, "Email is required");
//   }
//   if (username === "") {
//     throw new Apierror(400, "username is required");
//   }
//   if (password === "") {
//     throw new Apierror(400, "password is required");
//   }
//   const existeduser = await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (existeduser) {
//     throw new Apierror(409, "User already exists ");
//   }

//   console.log("Request files: ", req.files);
//   // const avatarlocalpath= req.files?.avatar[0]?.path;
//   let avatarlocalpath;

//   if (
//     req.files &&
//     Array.isArray(req.files.avatar) &&
//     req.files.avatar.length > 0
//   ) {
//     avatarlocalpath = req.files.avatar[0].path;
//   }

//   let coverimagelocalpath;
//   if (
//     req.files &&
//     Array.isArray(req.files.coverimage) &&
//     req.files.coverimage.length > 0
//   ) {
//     coverimagelocalpath = req.files.coverimage[0].path;
//   }

//   if (!avatarlocalpath) {
//     throw new Apierror(400, "Avatar file is compulsory ");
//   }
//   const avatar = await uploadOncloudinary(avatarlocalpath);
//   const coverimage = await uploadOncloudinary(coverimagelocalpath);
//   if (!avatar) {
//     throw new Apierror(400, "Avatar file is compulsory ");
//   }
//   const user = await User.create({
//     fullname,
//     email,
//     password,
//     avatar: avatar.url,
//     coverimage: coverimage?.url || "",
//     username: username.toLowerCase(),
//   });
//   const createduser = await User.findById(user._id).select(
//     "-password -refreshToken",
//   );
//   if (!createduser) {
//     throw new Apierror(500, "Something went wrong while registering the user");
//   }
//   return res
//     .status(201)
//     .json(new Apisuccess(200, "User is registered successfully ", createduser));
// });

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (fullname === "") {
    throw new Apierror(400, "Fullname is required");
  }
  if (email === "") {
    throw new Apierror(400, "Email is required");
  }
  if (username === "") {
    throw new Apierror(400, "username is required");
  }
  if (password === "") {
    throw new Apierror(400, "password is required");
  }
  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existeduser) {
    throw new Apierror(409, "User already exists ");
  }

  console.log("Request files: ", req.files);
  // const avatarlocalpath= req.files?.avatar[0]?.path;
  let avatarlocalpath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarlocalpath = req.files.avatar[0].path;
  }

  let coverimagelocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimagelocalpath = req.files.coverimage[0].path;
  }

  if (!avatarlocalpath) {
    throw new Apierror(400, "Avatar file is compulsory ");
  }
  const avatar = await uploadOncloudinary(avatarlocalpath);
  const coverimage = await uploadOncloudinary(coverimagelocalpath);
  if (!avatar) {
    throw new Apierror(400, "Avatar file is compulsory ");
  }
  const user = await User.create({
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    username: username.toLowerCase(),
  });
  const createduser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createduser) {
    throw new Apierror(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new Apisuccess(200, "User is registered successfully ", createduser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new Apierror(400, "Email or Username is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Apierror(404, "User does not exist ");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new Apierror(401, "Password entered is incorrect");
  }
  const { refreshtoken, accesstoken } = await generaterefreshandaccesstoken(
    user._id,
  );
  const loggedinuser = User.findById(user._id).select(
    "-password -refreshtoken",
  ).lean;
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new Apisuccess(
        200,
        {
          user: loggedinuser,
          refreshtoken,
          accesstoken,
        },
        "User is logged in",
      ),
    );
});
const logoutuser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshtoken: 1, // why not access token and undefined se kyu nahi chal raha tha
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new Apisuccess(200, {}, "User logout"));
});
const refreshaccesstoken = asyncHandler(async (req, res) => {
  const incomingrefreshtoken =
    req.cookies.refreshtoken || req.body.refreshtoken;
  if (!incomingrefreshtoken) {
    throw new Apierror(401, "Unauthorized Access");
  }
  try {
    const decodedtoken = jwt.verify(
      incomingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedtoken?._id);
    if (!user) {
      throw new Apierror(401, " Refresh token is invalid");
    }
    if (incomingrefreshtoken !== user.refreshtoken) {
      throw new Apierror(401, "Refresh token is expired or used");
    }
    const { refreshtoken, accesstoken } = await generaterefreshandaccesstoken(
      user._id,
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("Access token", accesstoken, options)
      .cookie("Refresh token", refreshtoken, options)
      .json(200, { refreshtoken, accesstoken }, "Access token refreshed ");
  } catch (error) {
    throw new Apierror(401, error?.message || "Invalid refresh token");
  }
});
const changepassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const user = await User.findById(req.user?._id);
  const correctpassword = await user.isPasswordCorrect(oldpassword);
  if (!correctpassword) {
    throw new Apierror(400, "Password entered is wrong");
  }
  user.password = newpassword;
  await user.save({ ValidationBeforeSave: false }); //save isliye kara hai kyunki user model mein pre use kara hai uske baad apne save use kara hai and use.password is value enter hogi but woh hook .save se run hoga and validatiobeforesave ka matlab hota ki aur koi validation naa check kare jaise email and username check karna
  return res
    .status(200)
    .json(new Apisuccess(200, {}, "Password changes successfully "));
});

const getcurrentuser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new Apisuccess(200, req.user, "Current user fetched successfully"));
});

const updatenameandemail = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new Apierror(400, "Fields provided are empty");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email,
      },
    },
    { new: true },
  ).select("-password");
  return res
    .status(200)
    .json(new Apisuccess(200, user, "Accounts details updated successfully "));
});
const changeavatar = asyncHandler(async (req, res) => {
  const avatarlocalpath = req.file?.path;
  if (!avatarlocalpath) {
    throw new Apierror(400, "Avatar file is missing");
  }
  const avatar = await uploadOncloudinary(avatarlocalpath);
  if (!avatar.url) {
    throw new Apierror(400, "Error while uploading avatar ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url, //.url isliye le rahe kyunki agar avatar liya toh woh poora object milega but hume bass strong chahiye aka the url
      },
    },
    { new: true }, //new isliye use karte kyunki update hone ke baad jo result hota woh return hota phir
  ).select("-password");
  return res
    .status(200)
    .json(new Apisuccess(200, user, "Avatar successfully changes"));
});
const changecoverimage = asyncHandler(async (req, res) => {
  coverimagelocalpath = req.file?.path;
  if (!coverimagelocalpath) {
    throw new Apierror(400, "Cover image is missing");
  }
  const coverimage = await uploadOncloudinary(coverimagelocalpath);
  if (!coverimage) {
    throw new Apierror(400, "Error while uploading cover image");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverimage: coverimage.url,
      },
    },
    { new: true },
  ).select("-password");
  return res
    .status(200)
    .json(new Apisuccess(200, user, "Cover image uploaded successfully"));
});
const getuserchannelprofile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new Apierror(400, "Username is missing");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberscount: {
          $size: "$subscribers",
        },
        channelsubscribedtocount: {
          $size: "$subscribedTo",
        },
        issubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        coverimage: 1,
        subscriberscount: 1,
        channelsubscribedtocount: 1,
        issubscribed: 1,
      },
    },
  ]);
  console.log(channel);
  if (!channel?.length) {
    throw new Apierror(400, "Channel does not exist");
  }
  return res
    .status(200)
    .json(new Apisuccess(200, channel[0], "User channel fetched successfully"));
});

const addVideoToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return Apierror(401, "Unauthorized.");
  }

  if (!user.watchHistory.includes(videoId)) {
    user.watchHistory.push(videoId);
    await user.save();
  }

  return res
    .status(200)
    .json(
      new Apisuccess(200, `${videoId} added to watch history for ${user._id}`),
    );
});

const watchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
                {
                  $addFields: {
                    owner: { $arrayElemAt: ["$owner", 0] },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);
  const watchHistory = user[0]?.watchHistory || [];
  return res
    .status(200)
    .json(
      new Apisuccess(
        200,
        { watchHistory },
        "Watch history fetched successfully",
      ),
    );
});

export {
  registerUser,
  loginUser,
  logoutuser,
  refreshaccesstoken,
  changepassword,
  getcurrentuser,
  updatenameandemail,
  changeavatar,
  changecoverimage,
  getuserchannelprofile,
  watchHistory,
  addVideoToWatchHistory,
};
