import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";
import axios from "axios";
import Cookies from "js-cookie";

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [userdetails,SetUserDetails]=useState<any>("")
  const navigate=useNavigate()
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/video",
          
          {
          withCredentials: true,
          //@ts-ignore
          credentials: 'include',
        });
        console.log("API response:", response.data);

        // Set videos state with the array of videos
        setVideos(response.data.data.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
        
      }
    };

    fetchVideos();
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
   
    const logoutUser=async()=>{
      try {
        const response=await axios.post("http://localhost:8000/api/v1/users/logout",
          {},
          {
            withCredentials: true,
            //@ts-ignore
            credentials: 'include',
          }
        )
        Cookies.remove("accesstoken")
        Cookies.remove("refreshtoken")
        console.log("Logout Succesfully",response.data)
        navigate("/signin")
      } catch (error) {
         console.error("Error logging out",error)
      }
    }
    
   
  return (
    <div className="bg-black w-screen h-screen overflow-y-hidden flex">
      {/* Sidebar */}
      <hr className="absolute w-screen top-20 border border-t border-white"></hr>
      <div className="absolute right-0 mt-4 mr-4 z-10">
      {userdetails ? <img src={userdetails.avatar} className="rounded-full border border-white w-[3rem] h-[3rem]"/> :<div>
        <Link to="/signin">
          <button className="border border-white text-white h-8 rounded-lg w-20 text-center ">
            Sign in
          </button>
        </Link>
        
      </div>}
      </div>
      
      <div className="flex-shrink-0 w-36 mt-2">
        <div className="mt-20">
          <Sidebarfull />
        </div>
        <div className="border-t w-[17rem] bg-slate-500"></div>
        <button className="w-full h-[2rem] rounded-md mt-4 ml-14 font-serif text-white border border-white" onClick={logoutUser}>
          Logout
        </button>
      </div>
      <div className="flex-1 relative">
        <div className="absolute left-32 top-20 bottom-0 bg-white border-l"></div>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 rounded-full w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white"
          />
        </div>
        <div className="mt-8 p-4">
          <div className="grid grid-cols-3 gap-4 ml-[8rem]">
            {videos.map((video: any) => (
              <Link key={video._id} to={`/video/${video._id}`} className="bg-black p-4 rounded-lg border border-white">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40  rounded-xl mb-2 border border-gray-700"
                />
                <h3 className="text-white text-lg font-bold">{video.title}</h3>
                <p className="text-gray-400">{video.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
