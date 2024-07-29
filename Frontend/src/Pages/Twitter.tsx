import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";
import { Menu } from "@headlessui/react";
import {newRequest} from "../utils/request.ts"


const Twitter: React.FC = () => {
  const [alltweets, setAllTweets] = useState<any[]>([]);
  const [userdetails, setUserDetails] = useState<any>(null);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null); // State to handle dropdown visibility
  const [likedTweets, setLikedTweets] = useState<Set<string>>(new Set())

  const navigate = useNavigate();
  
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await newRequest.get("/users/getcurrentuser", 
         );
        console.log("Current User Details", response.data);
        setUserDetails(response.data.message);
      } catch (error) {
        console.error("Error Getting User Details", error);
        navigate("/signin");
      }
    };
    getUser();
  }, [navigate]);

  const EditTweet = async (tweetId:string) => {
    try {
      const response = await newRequest.patch(
        `/tweets/updatetweet/u/${tweetId}`,
        {}, 
       
      );
      console.log("Edited tweet", response.data);
      navigate("/createtweet");
    } catch (error) {
      console.error("Error editing tweet", error);
    }
  };
  
  const DeleteTweet = async (tweetId:string) => {
    try {
      const response = await newRequest.delete(
        `/tweets/deletetweet/d/${tweetId}`,
        
       
      );
      console.log("Deleted tweet", response.data);
      
    } catch (error) {
      console.error("Error deleting tweet", error);
    }
  
  };

  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await newRequest.get("/tweets/alltweets", 
        );
        console.log("All Tweets", response.data);
        setAllTweets(response.data.data.alltweets); 
      } catch (error) {
        console.error("Error getting all tweets", error);
      }
    };
    getTweets();
  }, []);
  useEffect(() => {
    
    const likedTweetsFromStorage = localStorage.getItem('likedTweets');
    if (likedTweetsFromStorage) {
      setLikedTweets(new Set(JSON.parse(likedTweetsFromStorage)));
    }
  }, []);
  const updateLikedTweetsInStorage = (newLikedTweets: Set<string>) => {
    
    localStorage.setItem('likedTweets', JSON.stringify(Array.from(newLikedTweets)));
  };
   const getLikedTweet=async(tweetId:string)=>{
    try {
      const response=await newRequest.post(`/likes/toggle/c/${tweetId}`,
        {},
        
      )
      console.log("Liked tweet",response.data)
      setLikedTweets(prevLikedTweets => {
      const newTweetLiked=new Set(prevLikedTweets)
      if(newTweetLiked.has(tweetId)){
        newTweetLiked.delete(tweetId)
      }
      else{
        newTweetLiked.add(tweetId)
      }
      updateLikedTweetsInStorage(newTweetLiked)
      return newTweetLiked
    })
    } catch (error) {
      console.error("Error while liking tweet",error)
    }
     
   }
  const toggleDropdown = (index: number) => {
    setDropdownIndex(dropdownIndex === index ? null : index); // Toggle dropdown visibility
  };

  return (
    <>
       <div className="bg-black w-screen h-screen  flex">
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
        <Link to='/createTweet'>
          <div className="mb-4 flex justify-center">
            <button className="border-2 p-4 rounded-xl border-white bg-indigo-500 my-2">
              <span className="font-semibold"> What are you thinking today?! </span>  <span className="font-bold">Tweet Now!</span>
            </button>
          </div>
            </Link>
            {alltweets.length > 0 ? (
              alltweets.map((tweet: any, index: number) => (
                <div key={tweet._id} className="bg-black rounded-2xl border border-white mb-4 p-4 flex flex-row relative max-sm:mx-4 ml-[9rem]">
                  <div className="flex-col">
                    <p className="text-gray-400 font-semibold">@{tweet.user?.username}</p>
                    <p className="text-white">{tweet.content}</p>
                    <button
                      className={`border border-white rounded-2xl w-fit flex justify-center px-4 py-2 mb-4 mt-4 ${likedTweets.has(tweet._id) ? 'bg-indigo-500' : 'bg-transparent'}`}
                      onClick={() => getLikedTweet(tweet._id)}
                       >
                         <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer mr-2"
                         >
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill="currentColor"
                        />
                         </svg>
                      {likedTweets.has(tweet._id) ? 'Liked' : 'Like'}
                    </button>
                  </div>
                  <div className="flex justify-end items-start flex-grow relative ">
                    <svg
                      onClick={() => toggleDropdown(index)}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer"
                    >
                      <circle cx="12" cy="5" r="2" fill="white" />
                      <circle cx="12" cy="12" r="2" fill="white" />
                      <circle cx="12" cy="19" r="2" fill="white" />
                    </svg>
                    {dropdownIndex === index && (
                      <div className="absolute right-0 mt-8 bg-white text-black rounded-lg shadow-lg w-48 z-20">
                        <button
                          className="block px-4 py-2 text-left w-full hover:bg-indigo-500 hover:text-white"
                          onClick={() => EditTweet(tweet._id)} 
                        >
                          Edit Tweet
                        </button>
                        <button
                          className="block px-4 py-2 text-left w-full hover:bg-indigo-500 hover:text-white"
                          onClick={() => DeleteTweet(tweet._id)}
                        >
                          Delete Tweet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="ml-[10rem] font-bold text-lg">No tweets available</p>
            )}
        </div>
        </div>
        </div>
    </>
  );
};

export default Twitter;
