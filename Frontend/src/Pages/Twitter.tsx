import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";
import Navbar from "../components/Navbar";
import axios from "axios";

const Twitter: React.FC = () => {
  const [alltweets, setAllTweets] = useState<any[]>([]);
  const [userdetails, setUserDetails] = useState<any>(null);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null); // State to handle dropdown visibility
  const [likedTweets, setLikedTweets] = useState<Set<string>>(new Set())

  const navigate = useNavigate();
  
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/getcurrentuser", {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        });
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
      const response = await axios.patch(
        `http://localhost:8000/api/v1/tweets/updatetweet/u/${tweetId}`,
        {}, 
        {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        }
      );
      console.log("Edited tweet", response.data);
      navigate("/createtweet");
    } catch (error) {
      console.error("Error editing tweet", error);
    }
  };
  
  const DeleteTweet = async (tweetId:string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/tweets/deletetweet/d/${tweetId}`,
        
        {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        }
      );
      console.log("Deleted tweet", response.data);
      
    } catch (error) {
      console.error("Error deleting tweet", error);
    }
  
  };

  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/tweets/alltweets", {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        });
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
      const response=await axios.post(`http://localhost:8000/api/v1/likes/toggle/c/${tweetId}`,
        {},
        {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        }
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
      <div className="text-white">
        <Navbar />
        <div className="absolute right-0 top-0 mt-4 mr-4 z-10">
          {userdetails ? (
            <img src={userdetails.avatar} className="rounded-full border border-white w-[3rem] h-[3rem]" alt="User Avatar" />
          ) : (
            <div>
              <Link to="/signin">
                <button className="border border-white text-white h-8 rounded-lg w-20 text-center">
                  Sign in
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="mt-8 flex">
          <Sidebarfull />
          <div className="ml-8 flex-grow">
            <Link to='/createTweet'>
          <div className="mb-4 flex justify-center">
            <button className="border-2 p-4 rounded-xl border-white bg-indigo-500 my-2">
              <span className="font-semibold"> What are you thinking today?! </span>  <span className="font-bold">Tweet Now!</span>
            </button>
          </div>
            </Link>
            {alltweets.length > 0 ? (
              alltweets.map((tweet: any, index: number) => (
                <div key={tweet._id} className="bg-black rounded-2xl border border-white mb-4 p-4 flex flex-row relative">
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
              <p>No tweets available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Twitter;
