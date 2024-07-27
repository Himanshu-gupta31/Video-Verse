import React from "react";

const Navbar: React.FC = () => {
  return (
    <>
      
      <hr className="w-full border-t border-white fixed top-0 left-0 z-10 md:hidden" />

      <div className="relative w-full mt-16 max-sm:mt-4">
        
        <div className="flex justify-center px-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 rounded-full w-full max-w-[27rem] h-[3rem] text-left p-3 hover:outline outline-white max-sm:w-[16rem]"
          />
        </div>

        <hr className="absolute w-full top-20 border border-t border-white"></hr>
      </div>
    </>
  );
};

export default Navbar;
