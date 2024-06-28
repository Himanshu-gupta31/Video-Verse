import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";
import axios from "axios";

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch videos from the backend
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/video");
        setVideos(response.data.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="bg-black w-screen h-screen overflow-y-hidden flex">
      {/* Sidebar */}
      <hr className="absolute w-screen top-20 border border-t border-white"></hr>
      <div>
        <Link to="/signin">
          <button className="border border-white text-white h-8 rounded-lg w-20 text-center absolute right-0 mt-6 mr-4 z-10 ">
            Sign in
          </button>
        </Link>
      </div>
      <div className="flex-shrink-0 w-36 mt-2 ">
        <div className="mt-20">
          <Sidebarfull />
        </div>
        <div className="border-t w-[17rem] bg-slate-500"></div>
        <button className="w-full h-[2rem] rounded-md mt-4 ml-14 font-serif text-white border border-white">
          Logout
        </button>
      </div>

      <div className="flex-1 relative">
        <div className="absolute left-32 top-20 bottom-0 bg-white border-l"></div>

        {/* Search Bar */}
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 rounded-full w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white"
          />
        </div>

        {/* Videos List */}
        <div className="mt-8 p-4">
          <div className="grid grid-cols-3 gap-4">
            {videos.map((video:any) => (
              <div key={video._id} className="bg-gray-800 p-4 rounded-lg">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-white text-lg font-bold">{video.title}</h3>
                <p className="text-gray-400">{video.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
