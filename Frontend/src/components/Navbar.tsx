import React from "react";

const Navbar: React.FC = () => {
  return (
    <>
      
      <hr className="w-full border-t border-white fixed top-0 left-0 z-10 md:hidden" />

      <div className="relative w-full mt-16 md:mt-0">
        
        <div className="flex justify-center px-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 rounded-full w-full max-w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white"
          />
        </div>

        
        <div className="hidden md:block absolute left-[16rem] top-16 bottom-0 bg-white border-l h-screen overflow-y-hidden z-0"></div>
      </div>
    </>
  );
};

export default Navbar;
