import React from "react";
import { DashboardComponent } from "../components/DashboardComponent";
const Dashboard:React.FC=()=>{
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
        <p className="text-white">Welcome Back , </p>{/*username*/}
        </div>
        <div className="grid grid-cols-4 ml-4">
        <div>
       <DashboardComponent heading="Total Subscriber" count={2}/>
       </div>
       <div>
       <DashboardComponent heading="Total Videos" count={2}/>
       </div>
       <div>
       <DashboardComponent heading="Total Likes" count={2}/>
       </div>
       <div>
       <DashboardComponent heading="Total Views" count={2}/>
       </div>
       </div>
     </div>
     </>
    )
}
export default Dashboard