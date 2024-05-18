import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [fullname, SetFullname] = useState("");
  const [username, SetUsername] = useState("");
  const [password, SetPassword] = useState("");
  const [email, SetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [avatar,SetAvatar]=useState<File| null>(null);
  const [coverimage,SetCoverimage] =useState<File|null>(null)

  const postSignUpData = async () => {
    const formData=new FormData()
    formData.append("Fullname",fullname)
    formData.append("Username",username)
    formData.append("Password",password)
    formData.append("Email",email)

    if(!avatar){
    setError("Avatar is required")
    return;
    }
    if(coverimage){
    formData.append("coverimage",coverimage)
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
    });
      console.log("Sign-up successful:", response.data);
    } catch (error) {
      console.error("Error signing up!", error);
      setError("Error signing up!!Please try again later");
    }
  };

  return (
    <>
      <div className="bg-black text-white flex justify-center items-center h-screen">
        <div className="p-8 bg-black border border-white h-3/4 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105">
          <h1 className="text-white text-2xl text-center mb-4">Sign Up</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              postSignUpData();
            }}
          >
            <div className="mb-4">
              <InputBox
                inputTitle="Email"
                inputPlaceholder="Enter your Email"
                type="email"
                className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
                inputOnChange={(e) => SetEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <InputBox
                inputTitle="Fullname"
                inputPlaceholder="Enter your Fullname"
                type="text"
                className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
                inputOnChange={(e) => SetFullname(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <InputBox
                inputTitle="Username"
                inputPlaceholder="Enter your username"
                type="text"
                className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
                inputOnChange={(e) => SetUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <InputBox
                inputTitle="Password"
                inputPlaceholder="Enter your Password"
                type="password"
                className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
                inputOnChange={(e) => SetPassword(e.target.value)}
              />
              <label className="block text-white mb-2"></label>
              <InputBox
              type="file"
              accept="image/*"
              inputTitle="Avatar"
              inputPlaceholder="Avatar"
              className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
              inputOnChange={(e)=>{
                if(e.target.files && e.target.files.length>0){
                  SetAvatar(e.target.files[0])
                }
              }}
              />
              <InputBox
              type="file"
              accept="image/*"
              className="w-full rounded-md bg-black border border-white h-11 px-2  outline-gray-500"
              inputTitle="coverimage"
              inputPlaceholder="coverimage"
              inputOnChange={(e)=>{
                if(e.target.files && e.target.files.length>0){
                  SetCoverimage(e.target.files[0])
                }
              }}
              />

              <button className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8">
                Signup
              </button>
            </div>
          </form>
          <p className="text-sm text-white mt-4">
            Already have an account?
            <Link className="px-2 font-bold underline text-gray-400" to="/signin">
              Sign In
            </Link>
          </p>
          <p>{error && "Error Signing up please try again!"}</p>
        </div>
      </div>
    </>
  );
};
export default Signup;
