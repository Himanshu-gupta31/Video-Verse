import React, { useEffect, useState } from "react";
import { DashboardComponent } from "../components/DashboardComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [totalVideo, setTotalVideos] = useState<any[]>([]);
  const [userdetails,SetUserDetails]=useState<any>("");
  const navigate=useNavigate()

  useEffect(() => {
    const getChannelTotalVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/dashboard/dashboard/videos",
          {
            withCredentials: true,
            //@ts-ignore
            Credential: "include",
          }
        );
        console.log("Total Videos", response.data);
        setTotalVideos(response.data.data.channelVideo);
      } catch (error) {
        console.error("Error Fetching Total Videos", error);
      }
    };
    getChannelTotalVideos();
  }, []);
  useEffect(()=>{
    const getUser=async ()=>{
      try {
        const response=await axios.get("http://localhost:8000/api/v1/users/getcurrentuser",
          {
            withCredentials:true,
            //@ts-ignore
            credentials: 'include'
          }
        );
        console.log("Current User Details",response.data)
        SetUserDetails(response.data.message)
      } catch (error) {
        console.error("Error Getting User Detailed",error)
        navigate("/signin")
      }
    };
    getUser()
    
 },[])

  return (
    <>
      <div className="w-screen h-screen bg-black ">
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
        <div className="mt-8 ml-4">
          {userdetails &&
          <p className="text-white">Welcome Back ,{userdetails.username} </p>

          } 
        </div>
        <div className="grid grid-cols-4 ml-4">
          <div className="w-[20rem] h-[6rem] border border-white text-center mt-8 text-white">
            <DashboardComponent heading="Total Subscriber" />
          </div>
          <div className="w-[20rem] h-[6rem] border border-white text-center mt-8 text-white flex-col ">
            <DashboardComponent heading="Total Videos" />
            <p>{totalVideo.length}</p>
          </div>
          <div className="w-[20rem] h-[6rem] border border-white text-center mt-8 text-white">
            <DashboardComponent heading="Total Likes" />
          </div>
          <div className="w-[20rem] h-[6rem] border border-white text-center mt-8 text-white">
            <DashboardComponent heading="Total Views" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
