import React, { useEffect, useState } from "react";
import { DashboardComponent } from "../components/DashboardComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";

const Dashboard: React.FC = () => {
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [totalVideos, setTotalVideos] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalSubs, setTotalSubs] = useState<any[]>([]);
  const navigate = useNavigate();
  const [channelId, setChannelId] = useState<string>("");

  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        if (videoIds.length > 0) {
          const response = await axios.get(
            `http://localhost:8000/api/v1/video/views/${videoIds.join(',')}`,
            { withCredentials: true }
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
    const getChannelTotalVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/dashboard/dashboard/videos",
          {
            withCredentials: true,
          }
        );
        console.log("Total Videos", response.data);
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
        const response = await axios.get("http://localhost:8000/api/v1/users/getcurrentuser", {
          withCredentials: true,
        });
        console.log("Current User Details", response.data);
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
          const response = await axios.get(
            `http://localhost:8000/api/v1/subscribe/getchannel/sub/${channelId}`,
            {
              withCredentials: true,
            }
          );
          console.log(response.data);
          setTotalSubs(response.data.data.subscriber);
        }
      } catch (error) {
        console.error("Error fetching Channel Subscriber", error);
      }
    };
    getChannelSubs();
  }, [channelId]);

  return (
    <div className="w-screen h-screen bg-black">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-700 rounded-full w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white mt-3"
        />
      </div>
      <div>
        <hr className="absolute w-screen top-20 border border-t border-white"></hr>
      </div>
      <div className="flex flex-grow ml-1">
        <div className="mt-4 relative"><Sidebarfull /></div>
        <div className="absolute left-64 top-20 bottom-0 bg-white border-l"></div>
        <div className="flex flex-col mt-2 ml-0">
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
          <div className="grid grid-cols-4 ml-4 gap-4">
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
              <DashboardComponent heading="Total Subscriber" />
              <p>{totalSubs.length}</p>
            </div>
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white flex-col">
              <DashboardComponent heading="Total Videos" />
              <p>{totalVideos.length}</p>
            </div>
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
              <DashboardComponent heading="Total Likes" />
              {/* Add logic for total likes if needed */}
            </div>
            <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
              <DashboardComponent heading="Total Views" />
              <p>{totalViews}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
