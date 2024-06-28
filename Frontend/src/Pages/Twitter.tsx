import React, { useState } from 'react';
 
import axios from 'axios';
import Sidebarfull from '../components/Sidebarfull';

const Twitter: React.FC = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  
   
  const postTweetData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/tweets/tweet',
        {
          content: content,
        },
        {
          withCredentials: true,
          //@ts-ignore
          credentials: 'include',
        }
      );
      console.log('Twitted Successfully', response.data);
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
      <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
        <hr className="absolute w-screen top-20 border border-t border-white"></hr>
        <hr className="absolute h-screen left-[17rem] top-20 border border-l border-white"></hr>
        <div className="absolute left-0 top-20">
          <Sidebarfull />
        </div>
        <div className="p-8 bg-black border border-white h-3/4 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105 mt-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-start w-full mb-4">
              <label className="mb-2 text-sm font-medium text-gray-300">Content</label>
              <textarea
                placeholder="Content"
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
              Submit
            </button>
            <button
              className="ml-4 h-11 bg-gray-700 hover:bg-slate-600 w-[8rem] text-center rounded-md mt-8"
              type="submit"
            >
              Edit Comment
            </button>
          </form>
          <div>{error && <p>{error}</p>}</div>
        </div>
      </div>
    </>
  );
};

export default Twitter;
