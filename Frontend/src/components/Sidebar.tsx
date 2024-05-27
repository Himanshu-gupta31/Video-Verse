import React from "react";
interface Sidebarprops{
    SidebarTitle:string,
    classname:string
}
export const Sidebar:React.FC<Sidebarprops>=({
    SidebarTitle,
    classname
})=>{
    return(
        <>
        <div className={`w-full p-2 h-8 text-white hover:bg-slate-900 hover:rounded-lg font-serif text-center ${classname}`} >
            {SidebarTitle}
            
            </div>
        </>
    )
}