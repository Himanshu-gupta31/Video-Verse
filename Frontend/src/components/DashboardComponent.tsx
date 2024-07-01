import React from "react";

interface DashboardProps {
  heading: string;
  
}

export const DashboardComponent: React.FC<DashboardProps> = ({
  heading,
  
}) => {
  return (
    
      <div className="">
        <div className="flex flex-col">
          <div className="mt-4">{heading}</div>
          
        </div>
      </div>
    
  );
};
