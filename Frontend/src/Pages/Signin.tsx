import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import { Link, useNavigate } from "react-router-dom";
import { newRequest } from "../utils/request.ts";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const postSigninData = async () => {
    try {
      setLoading(true)
      await newRequest.post("/users/login", {
        email: email,
        password: password,
      });
      // console.log("Sign-in Successful", response.data);
      setLoading(false)
      navigate("/");
    } catch (error) {
      console.error("Error signing in", error);
      setError("Invalid credentials, Sign-in Failed");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postSigninData();
  };
  if (loading)
    return (
      <div className="opacity-50 h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />;
      </div>
    );
  return (
    <div>
      
      <div className="bg-black text-white flex justify-center items-center h-screen">
        <div className="p-8 bg-black border border-white h-1/2 shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105 max-sm:w-[85%]">
          <h1 className="text-white text-2xl text-center mb-4">Sign In</h1>
          <form onSubmit={handleSubmit}>
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
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8"
            >
              Sign In
            </button>
          </form>
          <div className="mt-2">
            <p className="font-bold">
              Don't Have an Account?{" "}
              <Link className="text-gray-500 underline" to="/signup">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
