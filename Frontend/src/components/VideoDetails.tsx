// VideoDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VideoDetail: React.FC = () => {
    const { videoId } = useParams<{ videoId: string }>();
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/video/${videoId}`, {
                    withCredentials: true,
                    //@ts-ignore
                    credentials: 'include',
                });

                console.log(response.data);  // Inspect the response data structure
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bg-black text-white flex justify-center items-center h-screen">
            {video && (
                <div className="p-8 border border-white rounded-lg w-3/4 h-3/4">
                    <h1 className="text-2xl mb-4">{video.title}</h1>
                    <video controls className="w-3/4 h-3/4 mb-4">
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <p>{video.description}</p>
                </div>
            )}
        </div>
    );
};

export default VideoDetail;
