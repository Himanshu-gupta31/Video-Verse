import React, { useEffect, useState } from "react";
import { DashboardComponent } from "../components/DashboardComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";

const Dashboard: React.FC = () => {
  const [totalVideo, setTotalVideos] = useState<any[]>([]);
  const [userdetails, SetUserDetails] = useState<any>("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const getChannelTotalVideos = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8000/api/v1/dashboard/dashboard/videos",
  //         {
  //           withCredentials: true,
  //           //@ts-ignore
  //           Credential: "include",
  //         }
  //       );
  //       console.log("Total Videos", response.data);
  //       setTotalVideos(response.data.data.channelVideo);
  //     } catch (error) {
  //       console.error("Error Fetching Total Videos", error);
  //     }
  //   };
  //   getChannelTotalVideos();
  // }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/getcurrentuser", {
          withCredentials: true,
          //@ts-ignore
          credentials: 'include'
        });
        console.log("Current User Details", response.data);
        SetUserDetails(response.data.message);
      } catch (error) {
        console.error("Error Getting User Details", error);
        navigate("/signin");
      }
    };
    getUser();
  }, []);

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
        <div className="mt-4 relative"><Sidebarfull/></div>
        <div className="absolute left-64 top-20 bottom-0 bg-white border-l"></div>
      <div className="flex flex-col mt-2 ml-0">
      {userdetails &&
        <div className="mt-4 relative ">
          <img className="w-screen h-[15rem] object-cover" src={userdetails.coverimage} alt="Cover" />
          <img className="rounded-full border border-gray-400 w-[6rem] h-[6rem] absolute bottom-[-3rem] left-16" src={userdetails.avatar} alt="Avatar" />
        </div>
      }
      <div className="mt-16 ml-4">
        {userdetails &&
          <p className="text-white">Welcome Back, 
          <span className="text-blue-600 font-bold text-xl ml-2">{userdetails.username}</span>
          </p>
        }
      </div>
      <div className="grid grid-cols-4 ml-4 gap-4">
        <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
          <DashboardComponent heading="Total Subscriber" />
        </div>
        <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white flex-col">
          <DashboardComponent heading="Total Videos" />
          {/* <p>{totalVideo.length}</p> */}
        </div>
        <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
          <DashboardComponent heading="Total Likes" />
        </div>
        <div className="w-[16rem] h-[6rem] border border-white text-center mt-8 text-white">
          <DashboardComponent heading="Total Views" />
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
