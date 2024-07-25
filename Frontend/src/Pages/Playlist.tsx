import axios from "axios";
import React, { useState } from "react";
import { InputBox } from "../components/InputBox";
import Sidebarfull from "../components/Sidebarfull";
import Navbar from "../components/Navbar";

const Playlist: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [playlists, setPlaylists] = useState<{ name: string, description: string }[]>([]);

    const createPlaylist = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/playlist/createplaylist",
                {
                    name: name,
                    description: description
                },
                {
                    withCredentials: true,
                    //@ts-ignore
                    credentials: 'include'
                }
            );
            console.log("Create Playlist", response.data);
            
            // Add the new playlist to the state
            setPlaylists([...playlists, { name: name, description: description }]);
            // Reset the input fields
            setName("");
            setDescription("");
        } catch (error) {
            console.error("Error creating playlist", error);
        }
    };

    return (
        <>
            <div>
                <Navbar />
            </div>

            <div className="mt-8 w-[15rem] relative ">
                <Sidebarfull />
            </div>
            <div className="">
                <div className="flex flex-col justify-center items-center overflow-hidden absolute top-24 left-[20rem]">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        createPlaylist();
                    }}>
                        <InputBox
                            inputPlaceholder="Title"
                            type="text"
                            inputOnChange={(e) => setName(e.target.value)}
                            className="border border-white bg-black w-[30rem] h-[3rem] rounded-xl mb-4 p-4"
                            inputTitle="title"
                            
                        />
                        <textarea
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-white bg-black w-[30rem] rounded-xl text-left p-2 px-2"
                            title="Description"
                            rows={10}
                            value={description}
                        />
                        <button className="bg-gray-500 rounded-xl w-[8rem] h-[3rem] mt-4 flex justify-center items-center">
                            Create Playlist
                        </button>
                    </form>
                </div>
                <div>
                    {playlists.length > 0 && (
                        <div className="grid grid-cols-3 absolute left-[20rem] mt-36">
                            {playlists.map((playlist, index) => (
                                <div key={index} className="border border-white w-[20rem] h-[15rem] bg-gray-900  flex flex-col">
                                    <div className="flex ">{playlist.name}</div>
                                    <div>{playlist.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Playlist;
