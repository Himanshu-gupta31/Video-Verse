import React, { useState,useEffect } from 'react';
import Sidebarfull from '../components/Sidebarfull';
import { Link,useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import {newRequest} from "../utils/request.ts"

const CreateTweet: React.FC = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()
  const [userdetails, SetUserDetails] = useState<any>("");
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await newRequest.get("/users/getcurrentuser", 
         );
        console.log("Current User Details", response.data);
        SetUserDetails(response.data.message);
      } catch (error) {
        console.error("Error Getting User Detailed", error);
        navigate("/signin");
      }
    };
    getUser();
  }, []);
  const postTweetData = async () => {
    try {
      const response = await newRequest.post(
        '/tweets/tweet',
        {
          content: content,
        },
        
      );
      console.log('Twitted Successfully', response.data);
      navigate("/twitter")
    } catch (error) {
      console.log('Something went wrong while publishing tweet', error);
      setError('Cannot Tweet');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postTweetData();
  };

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
        <div className="mt-8 p-4">
        <div className="p-8 bg-black  h-3/4 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105 mt-4 ml-[11rem]">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-start w-full mb-4">
              <label className="mb-2 text-sm font-medium text-gray-300"></label>
              <textarea
                placeholder="What is happening..."
                className="w-full rounded-md bg-black border border-white px-2 outline-gray-500 "
                onChange={(e) => setContent(e.target.value)}
                title="Content"
                rows={10}
              />
            </div>
            <button
              className="h-11 bg-gray-700 hover:bg-slate-600 w-[6rem] text-center rounded-md mt-8"
              type="submit"
            >
              Post
            </button>
            
          </form>
          <div>{error && <p>{error}</p>}</div>
        </div>
        </div>
        </div>
        </div>
    </>
  );
};

export default CreateTweet;
