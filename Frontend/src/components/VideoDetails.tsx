import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function formatDate(isoDateString:any) {
    const date = new Date(isoDateString);

    const padZero = (num:any) => (num < 10 ? '0' : '') + num;

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
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/video/${videoId}`, {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        });

        console.log(response.data); // Inspect the response data structure
        setVideo(response.data.data.video);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching video:", error);
        setError("Failed to fetch video.");
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const getvideoliked = async (videoId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
        {},
        {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        }
      );
      console.log("Liked video", response.data);
      setLiked(!liked); // Toggle the liked state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

    const updateWatchHistory = async () => {
        try {
            await axios.put(`http://localhost:8000/api/v1/users/addToWatchHistory/${videoId}`,{},
                {
                    withCredentials: true,
                    //@ts-ignore
                    credentials : 'include'
                }
            )
        } catch (error) {
            console.error("Error updating watch history",error)
        }
    }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-black text-white flex justify-center items-center h-screen">
      {video && (
        <div className="p-8 border border-white rounded-lg w-3/4 h-fit">
          <h1 className="text-2xl mb-4">{video.title}</h1>
          <video controls className="w-3/4 h-3/4 mb-4" onPlay={updateWatchHistory}>
            <source src={video.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button
            className={`border border-white rounded-2xl w-fit flex justify-center px-4 py-2 mb-4 ${liked ? 'bg-indigo-500' : 'bg-transparent'}`}
            onClick={() => getvideoliked(videoId!)}
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
            {liked ? 'Liked' : 'Like'}
          </button>

          <p>{video.description}</p>
          <p >Published On:{formatDate(video.createdAt)}</p>
        </div>
      )}
    </div>
  );
};

export default VideoDetail;
