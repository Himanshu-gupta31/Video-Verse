import React, { useEffect, useState } from "react";
import Sidebarfull from "../components/Sidebarfull";
import Navbar from "../components/Navbar";
import axios from "axios";

interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: string[];
  isPublished: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Likes: React.FC = () => {
  const [likedvideos, setLikedVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/likes/videos", {
          withCredentials: true
        });

        const likedVideoGroups = response.data.data.likedVideos;
        const flattenedLikedVideos = likedVideoGroups.flatMap((group: any) => group.like);
        
        setLikedVideos(flattenedLikedVideos);
      } catch (error) {
        console.error("Error fetching liked videos", error);
      }
    };
    fetchLikedVideos();
  }, []);

  return (
    <>
    
      <div>
        <Navbar />
      </div>

      <div className="mt-8 w-[15rem] relative">
        <Sidebarfull />
      </div>
      

      <div className="">
        <div className="grid grid-cols-3 overflow-hidden absolute top-24 left-[17rem] max-sm:left-0">
          {likedvideos.length > 0 ? (
            likedvideos.map((video) => (
              <div key={video._id} className="bg-black p-4 rounded-lg border border-white ml-[2rem] mt-4 w-[23rem]">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 rounded-xl mb-2 border border-gray-700"
                />
                {/* <div className="flex flex-row mt-4">
                  {userdetails && <img className="rounded-full border border-gray-500 w-12 h-12" src={userdetails.avatar} />} */}
                  <div className="flex flex-col ml-4">
                    <h3 className="text-white text-lg font-bold">{video.title}</h3>
                    <div className="">
                      <p className="text-gray-400">{video.description}</p>
                      <p className="text-gray-400">{video.views.length} Views</p>
                    </div>
                  </div>
              </div>
            ))
          ) : (
            <p>No liked videos found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Likes;
