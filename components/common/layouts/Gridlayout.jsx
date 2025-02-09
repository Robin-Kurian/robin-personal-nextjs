import React from "react";

const Gridlayout = ({ children, className = "" }) => {
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
};

export default Gridlayout;
