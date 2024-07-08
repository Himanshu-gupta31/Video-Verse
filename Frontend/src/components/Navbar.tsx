import React from "react";

const Navbar: React.FC = () => {
  return (
    <>
      <div className="relative w-full">
        <div className="absolute left-[16rem] top-16 bottom-0 bg-white border-l h-screen overflow-y-hidden"></div>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 rounded-full w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white"
          />
        </div>
      </div>
      <hr className="absolute w-screen top-20 border border-t border-white"></hr>
    </>
  );
};

export default Navbar;
