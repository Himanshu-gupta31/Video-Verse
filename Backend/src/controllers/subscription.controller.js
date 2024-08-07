import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Apisuccess } from "../utils/Apisuccess.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";

const checkSubscriber = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { channelId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new Apierror(400, "Invalid User Id");
  }

  try {
    const SubscribedChannel = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (!SubscribedChannel) {
      return res.status(200).json(
        new Apisuccess(200, {
          subscribed: false,
          message: `${userId} has not been subscribed to ${channelId}`,
        }),
      );
    }

    return res.status(200).json(
      new Apisuccess(200, {
        subscribed: true,
        message: `${userId} has been subscribed to ${channelId}`,
        SubscribedChannel,
      }),
    );
  } catch (error) {
    throw new Apierror(500, "Server error");
  }
});

const togglesSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new Apierror(400, "Invalid channel ID");
  }
  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id,
  });
  if (subscription) {
    await Subscription.findByIdAndDelete(subscription._id);
    return res.status(200).json(
      new Apisuccess(200, "Unsubscribed successfully", {
        subscription: null,
      }),
    );
  } else {
    const newSubscription = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new Apisuccess(200, "Subscribed succesfully", { newSubscription }));
  }
});

const getChannelSubscriber = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new Apierror(400, "Channel id is invalid");
  }

  try {
    const subscriber = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribercount",
        },
      },
      {
        $addFields: {
          subs: {
            $size: "$subscribercount",
          },
        },
      },
      {
        $project: {
          subs: 1,
          subscribercount: {
            _id: 1,
            fullname: 1,
            username: 1,
          },
        },
      },
    ]);

    if (!subscriber || subscriber.length === 0) {
      return res.status(200).json(
        new Apisuccess(
          201,
          {subscriber},
          {
            numberOfSubscribers : 0,
            message : '0 Subscribers'
          }
        ),
      );
    }

    return res.status(200).json(
      new Apisuccess(200, "All subscribers fetched successfully", {
        subscriber,
      }),
    );
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    throw new Apierror(500, "Something went wrong!");
  }
});

const getSubscribedChannel = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new Apierror(400, "Invalid subscriber id");
  }
  const subscribed = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribed",
      },
    },
    {
      $addFields: {
        subscribed: {
          $first: "$subscribed",
        },
      },
    },
    {
      $addFields: {
        totalchannelsubscribed: {
          $size: "$subscribed",
        },
      },
    },
    {
      $project: {
        totalchannelsubscribed: 1,
        subscribed: {
          username: 1,
          fullname: 1,
        },
      },
    },
  ]);
  if (!subscribed || Object.entries(subscribed).length === 0) {
    throw new Apierror(404, "No channel subscribed");
  }
  return res.status(200).json(
    new Apisuccess(200, "All subscribed channel fetched successfully", {
      subscribed,
    }),
  );
});
export {
  togglesSubscription,
  getChannelSubscriber,
  getSubscribedChannel,
  checkSubscriber,
};
