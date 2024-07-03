import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebarfull from "../components/Sidebarfull";
import Navbar from "../components/Navbar";
import axios from "axios";

const Twitter: React.FC = () => {
  const [alltweets, setAllTweets] = useState<any[]>([]);
  const [userdetails, setUserDetails] = useState<any>(null);
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

  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/tweets/alltweets", {
          withCredentials: true,
          //@ts-ignore
          credentials: "include",
        });
        console.log("All Tweets", response.data);
        setAllTweets(response.data.data.alltweet);
      } catch (error) {
        console.error("Error getting all tweets", error);
      }
    };
    getTweets();
  }, []);

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
            {alltweets.map((tweet: any) => (
              <div key={tweet._id} className="bg-black rounded-2xl border border-white mb-4 p-4">
                <p className="text-white">{tweet.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Twitter;
