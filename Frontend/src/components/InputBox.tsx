import React from "react";
 
interface InputBoxProps{
    inputTitle:string,
    inputPlaceholder:string,
    type:string,
    inputOnChange:(event:React.ChangeEvent<HTMLInputElement>)=>void,
    className:string
    accept?:string
}
export const InputBox:React.FC<InputBoxProps>=({
    inputPlaceholder,
    type,
    inputOnChange,
    className,
    inputTitle
    

    
}) => {
    return(
        <>
        <div className="flex justify-center items-center">
            <input
            type={type}
            placeholder={inputPlaceholder}
            className={className}
            onChange={inputOnChange}
            required
            title={inputTitle}
            ></input>
            
        </div>
        </>
    )
}