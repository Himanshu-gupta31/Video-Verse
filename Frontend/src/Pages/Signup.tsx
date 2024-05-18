import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
const Signup:React.FC=()=>{
  const[fullname,SetFullname]=useState('')
  const[username,SetUsername]=useState('')
  const[password,SetPassword]=useState('')
    return(
        <>
        <div className="bg-black text-white flex justify-center items-center h-screen">
            <div className="p-8 bg-black border border-white h-1/2 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105">
                <h1 className="text-white text-2xl text-center mb-4">Sign Up</h1>
            <div className="mb-4">
             <InputBox
             inputTile="Fullname"
             inputPlaceholder="Enter your Fullname"
             type="text"
             className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
             inputOnChange={(e)=>SetFullname(e.target.value)}
             />
            </div>
            <div className="mb-4">
             <InputBox
             inputTile="Username"
             inputPlaceholder="Enter your username"
             type="email"
             className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
             inputOnChange={(e)=>SetUsername(e.target.value)}
             />
            </div>
            <div className="mb-4">
             <InputBox
             inputTile="Password"
             inputPlaceholder="Enter your Password"
             type="password"
             className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
             inputOnChange={(e)=>SetPassword(e.target.value)}
             />
             <button className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8">Signup</button>
             <p className="text-sm text-white mt-4">
             Already have an account?
             </p>
            </div>
            </div>
        </div>
        </>
    )
}
export default Signup