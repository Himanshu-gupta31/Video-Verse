import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import Sidebarfull from "../components/Sidebarfull";
import axios from "axios";
import Cookies from "js-cookie";

// import Cookies from "js-cookie";

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [userdetails, SetUserDetails] = useState<any>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "https://video-verse-six.vercel.app/api/v1/video",
          {
            withCredentials: true,
          }
        );
        console.log("API response all videos:", response.data);
        setVideos(response.data.data.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "https://video-verse-six.vercel.app/api/v1/users/getcurrentuser",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${Cookies.get("accesstoken")}`,
            },
          });
        console.log("Current User Details", response.data);
        SetUserDetails(response.data.message);
      } catch (error) {
        console.error("Error Getting User Detailed", error);
        navigate("/signin");
      }
    };
    getUser();
  }, []);

  return (
    <div className="bg-black w-screen h-screen overflow-y-hidden flex">
      {/* Sidebar */}
      <hr className="absolute w-screen top-20 border border-t border-white"></hr>
      <div className="absolute right-0 mt-4 mr-4 z-10">
        {userdetails ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <img
                src={userdetails.avatar}
                className="rounded-full border border-white w-[3rem] h-[3rem]"
              />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg outline-none ">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-indigo-500`}
                      onClick={() => navigate("/video")}
                    >
                      Create Video
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-indigo-500`}
                      onClick={() => navigate("/createtweet")}
                    >
                      Create Tweet
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        ) : (
          <div>
            <Link to="/signin">
              <button className="border border-white text-white h-8 rounded-lg w-20 text-center ">
                Sign in
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 w-36 mt-2 max-sm:w-0">
        <div className="mt-20">
          <Sidebarfull />
        </div>
        <div className="border-t w-[17rem] bg-slate-500 max-sm:hidden"></div>
      </div>
      <div className="flex-1 relative">
        <div className="absolute left-32 top-20 bottom-0 bg-white border-l max-sm:hidden"></div>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 rounded-full w-[27rem] max-sm:w-[17rem] h-[3rem] text-left p-3 hover:outline outline-white"
          />
        </div>
        <div className="mt-8 p-4">
          <div className="grid grid-cols-3 gap-4 ml-[8rem] max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:ml-0">
            {videos.map((video: any) => (
              <Link
                key={video._id}
                to={`/video/${video._id}`}
                className="bg-black p-4 rounded-lg border border-white max-sm:w-full"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 rounded-xl mb-2 border border-gray-700"
                />
                <div className="flex flex-col ml-4">
                  <h3 className="text-white text-lg font-bold">
                    {video.title}
                  </h3>
                  <div className="">
                    <p className="text-gray-400">{video.description}</p>
                    <p className="text-gray-400">{video.views.length} Views</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
