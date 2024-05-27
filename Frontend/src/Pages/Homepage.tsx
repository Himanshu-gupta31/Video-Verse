import React from "react";
import { Sidebar } from "../components/Sidebar";

const HomePage: React.FC = () => {
    return (
        <div className="bg-black w-screen h-screen overflow-y-hidden flex">
            {/* Sidebar */}
            <hr className="w-screen absolute top-20"></hr>
            <div className="flex-shrink-0 w-36 mt-2 ">
                <Sidebar 
                SidebarTitle="Home"
                 classname="mt-20 ml-20" 
                 />
                <Sidebar 
                SidebarTitle="Shorts"
                 classname="mt-3 ml-20"
                 />
                 <Sidebar
                 SidebarTitle="Subscription"
                 classname="mt-3 ml-20 mb-4"/>
                 <div className=" border-t w-[17rem] bg-slate-500"></div>
                 <Sidebar 
                 SidebarTitle="Your channel"
                 classname="mt-3 ml-20 w-full"/>
                 <Sidebar 
                 SidebarTitle="History"
                 classname="mt-3 ml-20 w-full"/>
                 <Sidebar 
                 SidebarTitle="Playlist"
                 classname="mt-3 ml-20 w-full"/>
                 <Sidebar 
                 SidebarTitle="Your Videos"
                 classname="mt-3 ml-20 w-full"/>
                 <Sidebar 
                 SidebarTitle="Liked Videos"
                 classname="mt-3 ml-20 w-full mb-4"/>
                <div className=" border-t w-[17rem] bg-slate-500"></div>
            </div>

            
            <div className="flex-1 relative">
                
                <div className="absolute left-32 top-20 bottom-0 bg-white border-l "></div>

                {/* Search Bar */}
                <div className="flex justify-center mt-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-gray-700 rounded-full w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white"
                    />
                </div>

                {/* Additional content */}
                <div className="mt-8 p-4">
                    {/* Add other content here */}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
