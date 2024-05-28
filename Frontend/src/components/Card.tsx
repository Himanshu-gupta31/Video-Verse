import React from "react";
interface CardProps{
    title:string,
    avatar:string,
    owner:string,
    views:string,
    image:string,
    uploaded:string
}
export const Card:React.FC<CardProps>=({
    title,
    avatar,
    owner,
    views,
    image,
    uploaded

})=>{
    return(
        <div className="grid grid-rows-3 border border-white p-2 cursor-pointer ml-2 mr-2 ">
            <div className="col-span-11 pl-2">
            {title}
            </div>
            <img src={avatar} className="rounded-full" alt="Profile Image"/>
            <div className="col-span-11 text-gray-500">
            {owner}
            </div>
            {views}
            <img src={image} className="rounded-lg" />
            <div className="col-span-11 text-gray-500">
            {uploaded}
            </div>
        </div>
    )
}