import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import axios from "axios";
import Sidebarfull from "../components/Sidebarfull";
const Twitter:React.FC=()=>{
    
    const [content,SetContent]=useState('')
    const [error,SetError]=useState<string|null>(null)
    const postTweetData=async()=>{
        try {
            const response=await axios.post("http://localhost:8000/api/v1/tweets/tweet",
            {
                content:content
            },
            {
                withCredentials:true,
                //@ts-ignore
                credentials:"include"
            }
        )
        console.log("Twitted Successfully",response.data)
        } catch (error) {
            console.log("Something went wrong while publishing tweet",error)
            SetError("Cannot Tweet")
        }
    }
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
         e.preventDefault()
         postTweetData()
    }
    return(
       <>
       
       <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
        <div>
       <Sidebarfull/>
       </div>
        <div className="p-8 bg-black border border-white h-1/2 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105">
            <form onSubmit={handleSubmit}>
            <InputBox
            type="text"
            inputOnChange={(e)=>SetContent(e.target.value)}
            inputPlaceholder="Content"
            inputTitle="Content"
            className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
            />
            <button className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8" type="submit">Submit</button>
            </form>
            <div>
                {error && <p>{error}</p>}
            </div>
        </div>
       </div>
       </>
    )
}
export default Twitter