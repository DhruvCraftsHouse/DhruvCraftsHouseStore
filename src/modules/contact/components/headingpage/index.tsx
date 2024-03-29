import { Heading } from "@medusajs/ui";
import '../Contact.css';
import React, { CSSProperties, FC } from 'react';

interface HeadingPageProps {
  scrollToRef: React.RefObject<HTMLElement>;
}

const HeadingPage: FC<HeadingPageProps> = ({ scrollToRef }) => {
  const scrollToThirdPage = () => {
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

   // Define the background style with the image using CSSProperties
  const backgroundStyle: CSSProperties = {
    height: '73vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:"90px",
    // backgroundImage: `linear-gradient(top center,#3e0273 30%,#260a38 15%,#08040d 50% )`
    background: `radial-gradient(circle at top center, #260a38 10%, #08040d 90%)`
    // background: `radial-gradient(circle at center, #170a1f, #34114a)` // Replace with your actual color values
  };
  

  // Define the style for the top left corner text
  const topLeftTextStyle: CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '20px',
    padding: '1rem',
    fontFamily: "Avenir Next LT W02 Regular",
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: "0.3em"
  };

  // Define the style for the button around "ASK YOUR QUESTION"
  const askButtonStyle: CSSProperties = {
    // border: '3px solid #7e0696', // Colored border with some transparency
    color: 'white',
    backgroundColor: 'transparent', // No background color
    padding: '10px 20px', // Padding inside the button
    fontSize: '16.5px',
    fontFamily: "AvenirNextCyr-Regular",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    borderRadius: '30px', // Rounded corners
    cursor: 'pointer', // Cursor to indicate it's clickable
    outline: 'none', // Remove outline on focus for aesthetics
    transition: 'all 0.3s ease', // Smooth transition for hover effects
  };
  // Define the style for the "HOME >" text
  const homeStyle: CSSProperties = {
    color: 'rgba(253,253,253,0.4)'
  };

  // Define the style for the "PAYMENT AND DELIVERY" text
  const paymentDeliveryStyle: CSSProperties = {
    color: 'rgba(255,255,255)'
  };

  return (
<div className="div-style">
      {/* Text in top left corner */}
      <div style={topLeftTextStyle}>
        <span style={homeStyle}>HOME </span>
        <span className="pl-3" style={paymentDeliveryStyle}> CONTACTS</span>
      </div>
      
      {/* Background and Warranty Info with background image */}
      <div className="text-center" style={backgroundStyle}>
        <Heading level="h1" className="text-4xl mb-3" style={{ fontSize:"32px",fontFamily: "AvenirNextCyr-Regular", fontWeight: 500, color: "white", textTransform: "uppercase",letterSpacing:"0.2em" }}>
        CONTACTS
        </Heading>
        <Heading level="h3" className="mb-4" style={{ fontSize:"16.5px",fontFamily: "AvenirNextCyr-Regular", fontWeight: 500, color: "white", textTransform: "uppercase",letterSpacing:"0.01em" }}>
        OUR TEAM IS AVAILABLE FOR YOU 24/7
        </Heading>
        <div className="mt-9 pt-5" style={{fontSize:"16.5px",fontFamily: "AvenirNextCyr-Regular", fontWeight: 500, color: "white", textTransform: "uppercase",letterSpacing:"0.1em"}}>
        <button className="ask-button" style={askButtonStyle} onClick={scrollToThirdPage}>
          ASK YOUR QUESTION
        </button>
        </div>
      </div>
   
    </div>
  );
};

export default HeadingPage;
