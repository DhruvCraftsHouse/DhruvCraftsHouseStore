"use client";

import React, { useRef } from 'react';
import HeadingPage from "./components/headingpage"; 
import SecondPage from "./components/secondpage";
import ThirdPage from "./components/thirdpage";

const ContactTemplate = () => {
  // Create a reference to the ThirdPage component
  const thirdPageRef = useRef(null);

  return (
    <div className="h-auto w-full border-b border-ui-border-base relative flex flex-col" style={{ fontFamily: "Warnock Pro Display",background: "#F5F6FA" }}>
      {/* Pass the reference down to HeadingPage */}
      <HeadingPage scrollToRef={thirdPageRef} />
      <SecondPage />
      {/* Attach the reference to the ThirdPage component */}
      <div ref={thirdPageRef}>
        <ThirdPage />
      </div>
    </div>
  );
};

export default ContactTemplate;
