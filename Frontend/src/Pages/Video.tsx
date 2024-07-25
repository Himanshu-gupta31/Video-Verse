import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Video: React.FC = () => {
    const [title, SetTitle] = useState('');
    const [description, SetDescription] = useState('');
    const [ispublished, SetIsPublished] = useState(false);
    const [thumbnail, SetThumbnail] = useState<File | null>(null);
    const [videoFile, SetVideoFile] = useState<File | null>(null);
    const [error, SetError] = useState<string | null>(null);
    const navigate = useNavigate();

    const postVideoData = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (videoFile) formData.append("videoFile", videoFile);
        if (thumbnail) formData.append("thumbnail", thumbnail);
        formData.append("isPublished", ispublished.toString());
    
        try {
            // Log formData to inspect its contents before making the request
            console.log("Form Data:", formData);
    
            const response = await axios.post(
                "http://localhost:8000/api/v1/video/publishvideo",
                formData,
                {
                    withCredentials: true,
                    //@ts-ignore
                    credentials: "include"
                }
            );
            console.log("Video fetched successfully", response);
            navigate("/");
        } catch (error) {
            console.log("Error in video uploading", error);
            SetError("Video cannot be added");
        }
    };
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add form validation logic here if needed
        postVideoData();
    };
   
    return (
        <>
            <div className="bg-black text-white flex justify-center items-center h-screen">
                <div className="p-8 bg-black border border-white h-fit shadow-md rounded-lg transform transition-x-full w-[44%] duration-500 hover:scale-105 max-sm:w-[80%]">
                    <form onSubmit={handleSubmit}>
                        <InputBox
                            type="text"
                            inputPlaceholder="Title"
                            inputOnChange={(e) => SetTitle(e.target.value)}
                            className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500 mt-4 mb-4"
                            inputTitle="Title"
                        />
                        <InputBox
                            type="text"
                            inputPlaceholder="Description"
                            inputOnChange={(e) => SetDescription(e.target.value)}
                            className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500 mt-4 mb-4"
                            inputTitle="Description"
                        />
                        <InputBox
                            inputPlaceholder="Video File"
                            inputTitle="Video File"
                            type="file"
                            accept="video/*"
                            className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500 mt-4 mb-4"
                            inputOnChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    SetVideoFile(e.target.files[0]);
                                }
                            }}
                        />
                        <InputBox
                            inputPlaceholder="Thumbnail"
                            inputTitle="Thumbnail"
                            type="file"
                            accept="image/*"
                            className="w-full rounded-md bg-black border border-white h-11 px-2 outline-gray-500 mt-4 mb-4"
                            inputOnChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    SetThumbnail(e.target.files[0]);
                                }
                            }}
                        />
                        <div className="flex flex-row  items-center">
                        <label>Is Public:</label>
                        <InputBox
                            inputPlaceholder="IsPublished"
                            inputTitle="IsPublished"
                            type="checkbox"
                            className="w-full rounded-md bg-black border border-white h-8 px-2 outline-gray-500 mt-4 mb-4"
                            inputOnChange={(e) => SetIsPublished(e.target.checked)}
                        />
                        </div>
                        <button type="submit" className="h-11 bg-gray-700 hover:bg-slate-600 w-full text-center rounded-md mt-8">Submit</button>
                    </form>
                    <div>
                        {error && <p>{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Video;
