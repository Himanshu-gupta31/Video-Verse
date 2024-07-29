import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { newRequest } from "../utils/request";

function formatDate(isoDateString: string) {
  const date = new Date(isoDateString);
  const padZero = (num: number) => (num < 10 ? "0" : "") + num;

  const day = padZero(date.getUTCDate());
  const month = padZero(date.getUTCMonth() + 1); // Months are zero-based
  const year = date.getUTCFullYear().toString().slice(-2); // Get last two digits of the year

  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());
  const seconds = padZero(date.getUTCSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const VideoDetail: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [channelId, setChannelId] = useState<string>("");
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [subscribed, setSubscribed] = useState<boolean>();

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get(
        `/subscribe/checksubscription/${channelId}`
      );
      setSubscribed(response.data.message.subscribed);
      setLoading(false);
      //   console.log(response.data.message.subscribed);
    } catch (error) {
      console.error("Failed to check subscription:", error);
    }
  };

  const toggleSubscription = async () => {
    try {
      setLoading(true);
      await newRequest.post(`/subscribe/toggle/sub/${channelId}`, {});
      checkSubscription();
      setLoading(false);
    } catch (error) {
      console.error("Error toggling subscription:", error);
      setError("Cannot toggle subscription status!");
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await newRequest.get(`/video/${videoId}`);
        setVideo(response.data.data.video);
        setChannelId(response.data.data.video.owner);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching video:", error);
        setError("Failed to fetch video.");
        setLoading(false);
      }
    };

    const fetchLikedState = async () => {
      try {
        const response = await newRequest.get(`/likes/check/v/${videoId}`);
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Error fetching liked state:", error);
      }
    };

    fetchVideo();
    fetchLikedState();
  }, [videoId]);

  useEffect(() => {
    if (channelId) {
      checkSubscription();
    }
  }, [channelId]);

  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        const response = await newRequest.get(`/video/views/${videoId}`);
        setTotalViews(response.data.data.totalViews);
      } catch (error) {
        console.error("Error fetching total views:", error);
      }
    };

    if (videoId) {
      fetchTotalViews();
    }
  }, [videoId]);

  const toggleLike = async () => {
    try {
      await newRequest.post(`/likes/toggle/v/${videoId}`, {});
      setLiked(!liked); // Toggle the liked state
    } catch (error) {
      console.error("Error toggling like state:", error);
    }
  };

  const updateWatchHistory = async () => {
    try {
      await newRequest.put(`/users/addToWatchHistory/${videoId}`, {});
    } catch (error) {
      console.error("Error updating watch history:", error);
    }
  };

  if (loading)
    return (
      <div className="opacity-50 h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />;
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-black text-white flex justify-center items-center h-screen">
      {video && (
        <div className="p-8 border border-white rounded-lg w-3/4 h-[45rem]">
          <h1 className="text-2xl mb-4">{video.title}</h1>
          <video
            controls
            className="w-3/4 h-[25rem] mb-4"
            onPlay={updateWatchHistory}
          >
            <source src={video.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button
            className={`border border-white rounded-2xl w-fit flex justify-center px-4 py-2 mb-4 ${
              liked ? "bg-indigo-500" : "bg-transparent"
            }`}
            onClick={toggleLike}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer mr-2"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
              />
            </svg>
            {liked ? "Liked" : "Like"}
          </button>
          <button
            className={`border border-white rounded-2xl w-fit flex justify-center px-4 py-2 mb-4 ${
              subscribed ? "bg-indigo-500" : "bg-white text-black"
            }`}
            onClick={toggleSubscription}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer mr-2"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
              />
            </svg>
            <p>{subscribed ? "Unsubscribe" : "Subscribe"}</p>
          </button>

          <p>{video.description}</p>
          <p className="text-gray-400">
            Published On: {formatDate(video.createdAt)}
          </p>
          <p className="text-gray-600">Total Views: {totalViews}</p>
        </div>
      )}
    </div>
  );
};

export default VideoDetail;
