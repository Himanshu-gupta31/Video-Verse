import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Signup: React.FC = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const postSignUpData = async () => {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);

    if (!avatar) {
      setError("Avatar is required");
      return;
    } else {
      formData.append("avatar", avatar);
    }

    if (coverImage) {
      formData.append("coverimage", coverImage);
    }

    try {
      const response = await axios.post(
        'https://video-verse-4.onrender.com/api/v1/users/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      
      console.log("Sign-up successful:", response.data);
 

      navigate("/signin");
      // Handle successful sign-up (e.g., redirect to login page)
    } catch (error: any) {
      console.error("Error signing up!", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Error signing up! Please try again later.");
      }
    }
  };

  return (
    <div className="bg-black text-white flex justify-center items-center h-screen">
      <div className="p-8 bg-black border border-white h-fit shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105 max-sm:w-[90%]">
        <h1 className="text-white text-2xl text-center mb-4">Sign Up</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postSignUpData();
          }}
        >
          <div className="mb-4">
            <InputBox
              inputTitle="Fullname"
              inputPlaceholder="Enter your Fullname"
              type="text"
              className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
              inputOnChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <InputBox
              inputTitle="Username"
              inputPlaceholder="Enter your username"
              type="text"
              className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
              inputOnChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <InputBox
              inputTitle="Email"
              inputPlaceholder="Enter your Email"
              type="email"
              className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
              inputOnChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <InputBox
              inputTitle="Password"
              inputPlaceholder="Enter your Password"
              type="password"
              className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
              inputOnChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-white mb-2 block">Avatar</label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setAvatar(e.target.files[0]);
                }
              }}
            />
          </div>
          <div className="mb-4">
            <label className="text-white mb-2 block">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setCoverImage(e.target.files[0]);
                }
              }}
            />
          </div>
          <button className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8">
            Signup
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <p className="text-sm text-white mt-4">
          Already have an account?
          <Link className="px-2 font-bold underline text-gray-400" to="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
