import React,{useState} from "react";
import { InputBox } from "../components/InputBox";
import axios from "axios";
const Signin:React.FC=()=>{
     const[username,SetUsername]=useState('')
    const[password,SetPassword]=useState('')
    const[error,SetError]=useState<string|null>(null)
    const postSigninData=async()=>{
        try {
            const response=await axios.post("http://localhost:8000/api/v1/users/login",{
                username:username,
                password:password
            });
            console.log("Sign-in Successfull",response.data)//response.data samjhna hai
        } catch (error) {
            console.error("Error signing in",error)
            SetError("Invalid credentials,Sign-in Failed")
        }
    }
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        postSigninData()
    }
    return(
       <div>
        <div className="bg-black text-white flex justify-center items-center h-screen">
            <div className="p-8 bg-black border border-white h-1/2 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105">
                <h1 className="text-white text-2xl text-center mb-4">Sign In</h1>
                <form onSubmit={handleSubmit}>
            <div className="mb-4">
             <InputBox
             inputTitle="Email"
             inputPlaceholder="Enter your Email"
             type="email"
             className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
             inputOnChange={(e)=>SetUsername(e.target.value)}
             />
            </div>
            <div className="mb-4">
             <InputBox
             inputTitle="Password"
             inputPlaceholder="Enter your Password"
             type="password"
             className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
             inputOnChange={(e)=>SetPassword(e.target.value)}
             />
             </div>
             {error && <p className="text-red-500">{error}</p>}
             <button type="submit" className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8">Signin</button>
             </form>
             </div>
             </div>
             </div>
    )
}
export default Signin