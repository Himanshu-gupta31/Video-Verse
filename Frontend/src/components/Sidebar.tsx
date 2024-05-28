import React from "react";
interface Sidebarprops {
  SidebarTitle: string;
  icon: JSX.Element;
}
export const Sidebar: React.FC<Sidebarprops> = ({
  SidebarTitle,
  icon,
}) => {
  return (
    <>
      <div className="flex items-center p-2 my-2 hover:bg-slate-900 hover:rounded-lg w-[12rem]">
        <div className="mx-2">{icon}</div>
        <div className="text-white font-serif text-left"
        >
          {SidebarTitle}
        </div>
      </div>
    </>
  );
};