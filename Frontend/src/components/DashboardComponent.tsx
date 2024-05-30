import React from "react";

interface DashboardProps {
  heading: string;
  count: number;
}

export const DashboardComponent: React.FC<DashboardProps> = ({
  heading,
  count
}) => {
  return (
    
      <div className="w-[20rem] h-[6rem] border border-white text-center mt-8 text-white">
        <div className="flex flex-col">
          <div className="mt-4">{heading}</div>
          <div className="mt-4">{count}</div>
        </div>
      </div>
    
  );
};
