"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@medusajs/ui";
import Image from 'next/image';
import './Hero.css';
import { yellow } from "@mui/material/colors";

const features = [
  {
    imageSrc: "/ganeshaback.png",
    description: "Feature 1 Description",
  },
  {
    imageSrc: "/violinman.png",
    description: "Feature 2 Description",
  },
  {
    imageSrc: "/circleman.png",
    description: "Feature 3 Description",
  },
];

const Hero = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [screenWidth, setScreenWidth] = useState<number>(0); // State to store screen width

 useEffect(() => {
    // Update the screen width state when the component mounts
    setScreenWidth(window.innerWidth);

    // Optional: Add an event listener to update the screen width when the window is resized
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
 }, []); // Empty dependency array ensures this runs only once after the initial render


  return (
    <div className="h-auto w-full border-b border-ui-border-base relative flex flex-col " style={{ fontFamily: "Avenir Next LT W02 Regular", background: "#F5F6FA",width:"100%" }}>
      <div className="flex flex-row hero-div">
        <div className="flex-1 flex flex-col gap-6 left-hero-div">
        {/* <Heading className="mb-4 drop-shadow-md shadow-black " style={{ fontFamily: "Futura LT W01 Medium",lineHeight:"1.2em" }}>
        Screen Width: {screenWidth}px
      </Heading> */}
          <Heading className="mb-4 drop-shadow-md shadow-black hero-h1" style={{ fontFamily: "Futura LT W01 Medium",lineHeight:"1.2em" }}>
            EXPERIENCE SERENITY
          </Heading>
          <Heading className="max-w-[32rem] mb-6 drop-shadow-md shadow-black hero-h2" style={{ fontFamily: "Avenir Next LT W02 Regular", lineHeight: "1.2em" }}>
            Our crafts brings you home divinity, tranquility and happiness
          </Heading>

          <div className="flex w-full gap-7 hero-features">
          {features.map((feature, index) => (
  <div
    key={index}
    className="flex-1 flex"
    onMouseEnter={() => setHoveredIndex(index)}
    onMouseLeave={() => setHoveredIndex(null)}
    style={{ position: 'relative', transition: 'transform 0.3s ease' }}
  >
    <div className="w-full" style={{ transform: hoveredIndex === index ? 'translateY(-10%)' : 'translateY(0)', display:"flex",justifyContent:"flex-end" }}>
      <img className="feature-img" src={feature.imageSrc} alt={`Feature ${index + 1}`} loading="lazy"/>
    </div>
    <div className="w-full flex flex-col justify-center relative" style={{ transform: hoveredIndex === index ? 'translateY(-10%)' : 'translateY(0)' }}>
  <p className="hero-p ml-1" style={{  overflowWrap: "break-word", overflow: "hidden" }}>{feature.description}</p>
  {hoveredIndex === index && (
    <div className={`border-b border-black absolute bottom-0 left-0 w-full transition-transform transform translate-y-[-5px] ${hoveredIndex === index ? "border-animation" : ""}`}></div>
  )}
</div>


  </div>
))}

          </div>
        </div>
        {/* Image Column (Right Half of Screen) */}
        <div className="right-div">
          <img className="main-img" src="/ganesha_transparent.png" alt="Summer Styles" loading="lazy"/>
        </div>
      </div>
    </div>
  );
};

export default Hero;
