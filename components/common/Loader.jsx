import React from "react";

const Loader = ({ size = "50px", border = "2px", className = "" }) => {
  return (
    <div className={`flex items-center justify-center h-[calc(100vh-70px)] ${className}`}>
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: ${border} solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #3498db; /* Change this color to customize */
          border-radius: 50%;
          width: ${size}; /* Size of the loader */
          height: ${size}; /* Size of the loader */
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
