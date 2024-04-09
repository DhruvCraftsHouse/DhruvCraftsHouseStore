"use client";

import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loader-style">
      {/* Spinner circle that will rotate */}
      {/* <div className="spinner"></div> */}
      {/* Text that remains static */}
      <div>Please wait while we load the page for you...</div>
      <style>{`
        .loader-style {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          font-size: 20px;
          color: black;
        }
        // .spinner {
        //   border: 6px solid rgba(0, 0, 0, 0.1); /* Adjust the border color and thickness */
        //   border-radius: 50%;
        //   border-top-color: black; /* Color of the spinner */
        //   width: 60px; /* Size of the spinner */
        //   height: 60px; /* Size of the spinner */
        //   animation: spin 1s linear infinite; /* Animation applied to spinner */
        //   margin-bottom: 20px; /* Space between spinner and text */
        // }
        // @keyframes spin {
        //   0% {
        //     transform: rotate(0deg);
        //   }
        //   100% {
        //     transform: rotate(360deg);
        //   }
        // }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
