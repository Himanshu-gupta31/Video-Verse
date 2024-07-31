import React, { useEffect, useState } from "react";
import { DashboardComponent } from "../components/DashboardComponent";
import { useNavigate,Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import Sidebarfull from "../components/Sidebarfull";
import {newRequest} from "../utils/request.ts"

const Dashboard: React.FC = () => {
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [totalVideos, setTotalVideos] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalSubs, setTotalSubs] = useState<any[]>([]);
  const navigate = useNavigate();
  const [userdetails, SetUserDetails] = useState<any>("");

  const [channelId, setChannelId] = useState<string>("");

  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        if (videoIds.length > 0) {
          const response = await newRequest.get(
            `/video/views/${videoIds.join(',')}`,
            
          );
          setTotalViews(response.data.data.totalViews);
        }
      } catch (error) {
        console.error("Error fetching total views:", error);
      }
    };

    fetchTotalViews();
  }, [videoIds]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await newRequest.get("/users/getcurrentuser", 
         );
        // console.log("Current User Details", response.data);
        SetUserDetails(response.data.message);
      } catch (error) {
        console.error("Error Getting User Detailed", error);
        navigate("/signin");
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    const getChannelTotalVideos = async () => {
      try {
        const response = await newRequest.get(
          "/dashboard/videos"
        );
        // console.log("Total Videos", response.data);
        setTotalVideos(response.data.data.channelVideo);
        setVideoIds(response.data.data.channelVideo.map((video: any) => video._id));
      } catch (error) {
        console.error("Error Fetching Total Videos", error);
      }
    };
    getChannelTotalVideos();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await newRequest.get("https://video-verse-six.vercel.app/api/v1/users/getcurrentuser"
        );
        // console.log("Current User Details", response.data);
        setUserDetails(response.data.message);
        setChannelId(response.data.message._id);
      } catch (error) {
        console.error("Error Getting User Details", error);
        navigate("/signin");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getChannelSubs = async () => {
      try {
        if (channelId) {
          const response = await newRequest.get(
            `/subscribe/getchannel/sub/${channelId}`,
            
          );
          // console.log(response.data);
          setTotalSubs(response.data.data.subscriber);
        }
      } catch (error) {
        console.error("Error fetching Channel Subscriber", error);
      }
    };
    getChannelSubs();
  }, [channelId]);

  return (
     <>
     <div className="bg-black w-screen h-screen overflow-y-hidden flex">
      {/* Sidebar */}
      <hr className="absolute w-screen top-20 border border-t border-white"></hr>
      <div className="absolute right-0 mt-4 mr-4 z-10">
        {userdetails ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <img src={userdetails.avatar} className="rounded-full border border-white w-[3rem] h-[3rem]" />
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
              <button className="border border-white text-white h-8 rounded-lg w-20 text-center ">Sign in</button>
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
        <div className="mt-0 ml-[8.2rem]">
        <div className="flex flex-col mt-1 ml-0">
          {userDetails &&
            <div className="mt-4 relative ">
              <img className="w-screen h-[15rem] object-cover" src={userDetails.coverimage} alt="Cover" />
              <img className="rounded-full border border-gray-400 w-[6rem] h-[6rem] absolute bottom-[-3rem] left-16" src={userDetails.avatar} alt="Avatar" />
            </div>
          }
          <div className="mt-16 ml-4">
            {userDetails &&
              <p className="text-white">Welcome Back,
                <span className="text-blue-600 font-bold text-xl ml-2">{userDetails.username}</span>
              </p>
            }
          </div>
          <div className="grid grid-cols-3 ml-8 ">
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
              <DashboardComponent heading="Total Subscriber" />
              <p>{totalSubs.length}</p>
            </div>
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white flex-col">
              <DashboardComponent heading="Total Videos" />
              <p>{totalVideos.length}</p>
            </div>
            
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
              <DashboardComponent heading="Total Views" />
              <p>{totalViews}</p>
            </div>
          </div>
        </div>
        </div>
        </div>
        </div>
        
     </>
  );
};

export default Dashboard;
