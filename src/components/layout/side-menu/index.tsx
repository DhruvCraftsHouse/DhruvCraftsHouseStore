import LoadingSpinner from '../loader'; // Ensure this path matches where your LoadingSpinner component is located.
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ArrowRightMini } from "@medusajs/icons";
import { useToggleState } from "@medusajs/ui";
import Link from "next/link";
import { useProductCategories } from "medusa-react";
import X from "@/components/common/icons/x";
import ChevronDown from '@/components/common/icons/chevron-down';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SideMenuItems = {
  Home: "/",
  Store: "/store",
  // Search: "",
  Account: "/account",
  Cart: "/cart",
};

const categoriesData = [
  { name: 'Rings', imgSrc: '/violinman.png' },
  { name: 'Earrings', imgSrc: '/ganeshaback.png' },
  { name: 'Studs', imgSrc: '/circleman.png' },
  { name: 'Bracelets', imgSrc: '/dhruvganeshafront.png' },
  { name: 'Gift', imgSrc: '/violinman.png' },
  { name: 'Card', imgSrc: '/ganeshaback.png' },
  { name: 'Toy', imgSrc: '/circleman.png' },
  { name: 'Doll', imgSrc: '/dhruvganeshafront.png' },
  {name: 'Art', imgSrc: '/circleman.png' },
  { name: 'Craft', imgSrc: '/dhruvganeshafront.png' },
  // ... other categories
];

interface SideMenuProps {
  navBackground: string; // Add this line to include the navBackground prop
  searchModalOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ navBackground, searchModalOpen, onOpenChange }) => {
  const handleSearchClick = (close: () => void) => {
    searchModalOpen();
    close();
  };


  const [isDecorationsOpen, setIsDecorationsOpen] = useState(false);

  // Modify the onClick handler for the "DECORATIONS" link
  const handleDecorationsClick = () => {
    setIsDecorationsOpen(!isDecorationsOpen);
  };

  const [showImageList, setShowImageList] = useState(false);
  const toggleImageList = () => {
    setShowImageList(!showImageList);
  };
  
  const pathname = usePathname();
  // console.log('pathname', pathname)
  const [isNavigating, setIsNavigating] = useState(false);
  const [clickedPath, setClickedPath] = useState('');

  // console.log('clickedPath', clickedPath)
  // Initialize clickedPath with the current pathname when the component mounts
  useEffect(() => {
    setClickedPath(pathname);
  }, [pathname]);

  useEffect(() => {
    // Determine if navigation is occurring
    setIsNavigating(pathname !== clickedPath);
  }, [pathname, clickedPath]);

  // Function to handle link clicks
  const handleLinkClick = (targetPath: string) => {
    // Split the targetPath at "#" and take the first part (the URL without the hash)
    const pathWithoutHash = targetPath.split('#')[0];
  
    // Check if the target path without hash is the same as the current pathname
    if (pathWithoutHash === pathname) {
      console.log("Already on the same page:", pathWithoutHash);
      // Do not proceed with navigation
      return;
    }
  
    console.log("Link clicked with path:", pathWithoutHash);
    setClickedPath(pathWithoutHash); // Update clickedPath to the target path without the hash
    setIsNavigating(true); // Assume navigation is starting
  };
  
  
  return (
   

    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => {
            // Place useEffect hook here
            // useEffect(() => {
            //   if (open) {
            //     // console.log("OPENED");
            //     onOpenChange(open)
            //   } else {
            //     // console.log("CLOSES");
            //     onOpenChange(false)

            //   }
            // }, [open]); // This effect will re-run whenever the `open` state changes

             // Add a new state variable to track if the "DECORATIONS" dropdown is open


            return (
              <>
                  {isNavigating && <LoadingSpinner />}

              <>
              <div className="relative flex h-full">
              <Popover.Button className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none " style={{ width: "50%" }}>
                    <img
                      src={navBackground === "rgba(0,0,0,0.4)" ? "/menuicon_white.png" : "/menuicon.png"}
                      alt="Menu"
                    /> 
                    {/* Use the passed `navBackground` to determine which icon to display */}
                  </Popover.Button>

              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-0"
                leaveTo="opacity-100"
              >
                <Popover.Panel 
                  className="flex flex-col absolute w-full z-50 top-0 left-0 right-0 text-sm shadow-lg"
                  style={{ margin: 0, 
                    height: !isDecorationsOpen ? '85vh':'' }}
                >    
                 <>   
            <div className="flex flex-col h-screen bg-white shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-300" style={{fontFamily: "Warnock Pro Display"}}>
                  {!isDecorationsOpen ? (
             <button
             onClick={close}
             className="flex items-center text-gray-800 font-bold hover:" style={{marginLeft:"1.5%",fontFamily:"Avenir Next LT W02 Regular"}}
           >
             <X className="h-5 w-5 mr-1" style={{width:"20%", marginBottom:"3%"}}/> <span style={{fontSize:"10px", color:"black",letterSpacing:"0.2em", fontWeight: "bold"}}>CLOSE</span> 
           </button>
                  ):
                  (
                    <button
                    onClick={handleDecorationsClick}
                    className="flex items-center font-bold hover:" style={{marginLeft:"1.5%", fontFamily:"Avenir Next LT W02 Regular"}}
                  >
                    <FontAwesomeIcon icon={faBars} className="h-5 w-5 mr-1" style={{width:"15%", marginBottom:"3%"}} />
                    <span style={{fontSize:"10px", letterSpacing:"0.2em", fontWeight: "bolder"}}>MENU</span>
                  </button>
                  
                  )}
   
<div className="inline-flex space-x-4 justify-center ml-8 text-black" style={{ fontFamily: "Avenir Next LT W02 Regular" }}>
        <Link href="/"
                   onClick={ ()=> {
                    handleLinkClick('/')
                    close();
                   }} 
         className="hover:underline" style={{ fontSize: "10px", letterSpacing: "0.15em", fontWeight: 600 }}>DIAMONDS
        </Link>
        <Link
          href="#"
          onClick={handleDecorationsClick}
          className="flex items-center hover:underline"
          style={{ fontSize: "10px", letterSpacing: "0.15em", fontWeight:  600,
          textDecoration: isDecorationsOpen ? "underline":""
         }}
        >
          DECORATIONS
          <ChevronDown className="" /> {/* Adjust margin-left as needed */}
        </Link>
        <Link href="/"
        
         className="hover:underline" style={{ fontSize: "10px", letterSpacing: "0.15em", fontWeight: 600 }}>HOROSCOPE
        </Link>
      </div>

                {/* <h2 className="text-xl flex-grow text-black" style={{marginLeft:"10.5%", fontWeight: 600}}>
                  ALROSA DIAMONDS
                </h2> */}
                 <Link
   href="/"
   onClick={ ()=> {
    handleLinkClick('/') 
   close();
  } } 
   className="text-xl flex-grow text-black"
 >
      {/* <img src="/transdhruv.png" alt="Location"  style={{marginLeft:"15%", width:"15%"}} /> */}
      <h1 style={{marginLeft:"15%"}}>Dhruv Crafts House</h1>

 </Link>
                 {/* <button>
          <i className="fas fa-times text-gray-800 text-xl"></i>
        </button> */}
        
        
      </div>

      {!isDecorationsOpen && (

      <div className="flex-grow overflow-y-auto mt-5 text-black" style={{marginLeft:"1.8%"}}>
      <div className="flex-grow overflow-y-auto p-4 flex space-x-8">
          {/* First Column */}
          <div className="space-y-2 flex-1" style={{fontFamily:"Avenir Next LT W02 Regular"}}>
            <h3 className="" style={{fontSize:"10px",fontWeight: "bolder", letterSpacing:"0.2em"}}>FOR BUYERS</h3>
            <ul className="" style={{fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight: 500, lineHeight:"2.5em"}}>
                <li>Guarantees</li>
                <li>
                  <Link href="/refundandcancellation"
                                     onClick={ ()=> {
                                      handleLinkClick('/refundandcancellation')
                                      close();
                                    } } 
                  >Refund and Cancellation Policy</Link>
                  </li>
                <li><Link href="/shippinganddelivery"
                onClick={ ()=> {
                  handleLinkClick('/shippinganddelivery') 
                close();
              }} 
                >Ship and Delivery Policy</Link></li>
                <li>Questions and Answers</li>
                <li>Blog</li>
                <li>Ask a Question</li>
                <li><Link href="/contact"
 onClick={ ()=> {
  handleLinkClick('/contact') 
 close();
}} 
                >Contact US </Link></li>
                <li><Link href="/termsandconditions"
                 onClick={ ()=> {
                  handleLinkClick('/termsandconditions')
                  close();
                } } 
                >Terms and Conditions</Link></li>
                <li style={{fontWeight:"bold",marginTop:"10%"}}><Link href="/privacypolicy"
                                 onClick={ ()=> {
                                  handleLinkClick('/privacypolicy')
                                  close();
                                } } 
                >Privacy Policy</Link></li>
                <li style={{fontWeight:"bold"}}>Gift Certifications</li>
            </ul>
          </div>

          {/* Second Column */}
          <div className="space-y-2 flex-1" style={{fontFamily:"Avenir Next LT W02 Regular"}}>
            <h3 className="" style={{fontSize:"10px",fontWeight: "bolder", letterSpacing:"0.2em"}}>ABOUT COMPANY</h3>
            <ul className="" style={{fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight: 500, lineHeight:"2.5em"}}>
            <li>ABOUT </li>
                <li>Social Responsibility</li>
                <li>Environmental Responsibility</li>
            </ul>
          </div>

          {/* Third Column */}
          <div className="space-y-4 flex-1" style={{ fontFamily: "Avenir Next LT W02 Regular" }}>
  <div className="relative h-80 flex items-center justify-center" style={{ background: "#F5F6FA" }}>
    <img
      src="/ganesha_transparent.png"
      alt="Elegant diamond necklace on a dark background"
      style={{ maxWidth: '65%', height: 'auto' }}
    />
  </div>
  <Link href="/"
             onClick={ ()=> {
              handleLinkClick('/')
              close();
            } } 
   className="text-sm hover:underline block italic text-center" style={{ fontFamily: "Warnock Pro Display",background:"",textAlign:"left",color:"black",fontWeight: 400 }}>Create your own decoration <ArrowRightMini className="inline-block" />
  </Link>
</div>
       
        </div>
      </div>

      )}
      {/* Image and Call to Action */}
       {/* Conditionally render the new layout when the "DECORATIONS" dropdown is open */}
       {isDecorationsOpen && (
        <>
        <div style={{ background: "#F5F6FA", textAlign: "center", padding: "15px 0",color:"black" }}>
         
          <Link href="/create-decoration" style={{ fontSize: "16px",textDecoration: "none",fontFamily: "Times New Roman, sans-serif", color: "#183E61", fontStyle:"italic" }}>
            Create your own decoration →
          </Link>
        </div>
        <div style={{textAlign: "center", marginTop:"3%",color:"black"}}>
        <h2 style={{ fontSize: "16px", margin: "0 0 20px 0", fontWeight: 400, fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.2em" }}>DIAMOND JEWELRY</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "15px" }}>
            <Link href="/categories" style={{ textDecoration: "none", fontWeight: 500 , fontSize: "10px",fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.15em" }}><span style={{textDecoration:"underline"}}>CATEGORIES</span></Link>
            <Link href="/style" style={{ textDecoration: "none", fontWeight: 500 , fontSize: "10px",fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.15em" }}>STYLE</Link>
            <Link href="/occasion" style={{ textDecoration: "none", fontWeight: 500 , fontSize: "10px",fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.15em" }}>OCCASION</Link>
            <Link href="/collections" style={{ textDecoration: "none", fontWeight: 500 , fontSize: "10px",fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.15em" }}>COLLECTIONS</Link>
            <Link href="/gift-certificates" style={{ textDecoration: "none", fontWeight: 500 , fontSize: "10px",fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.15em" }}>GIFT CERTIFICATES</Link>
          </div>
        </div>
  <div className="grid grid-cols-5 p-4 text-black"  style={{ alignItems: 'center', justifyContent: 'center' }}>
    {categoriesData.map((category, index) => (
      <div 
        key={category.name} 
        className="flex flex-col items-center justify-center" 
        style={{ 
          borderBottom: "1px solid #ccc",
          borderTop: index < 5 ? "1px solid #ccc" : "", // Apply top border for first 5 items
          borderLeft: index % 5 === 0 ? "1px solid #ccc" : "", // Apply left border for first item in every row
          borderRight: "1px solid #ccc", // Apply right border for last item in every row
        }}
      >
        <img 
          src={category.imgSrc} 
          alt={category.name} 
          style={{ width: "80px", height: "80px", objectFit: 'cover', marginBottom: "10px",paddingTop:"10%" }} // Set both width and height to fixed values
        />
<span style={{ paddingBottom:"10%",textAlign: "center", fontFamily: "Times New Roman, sans-serif", fontWeight: 400, fontStyle: 'italic' }}>
  {category.name}
</span>
      </div>
    ))}
  </div>
  <div style={{textAlign:"center",color:"black"}}>
  <Link href="/create-decoration" style={{ fontSize: "10px",textDecoration: "none",fontFamily:"Avenir Next LT W02 Regular", color:"black", letterSpacing:"0.1em", textAlign:"center", fontWeight: 600  }}>
  ALL DECORATIONS {`>`}
</Link>
  </div>
  </>
)}    
    </div>
    {open && (
      <>
       <div
  style={{
    position: 'fixed', // Use fixed positioning to stay in place even when scrolling
    right: '130px', //  10px from the right
    bottom: '25px', //  5px from the bottom
    backgroundColor: '#fff', // Background color of the phone number container
    padding: '12px  25px', // Padding around the text
    borderRadius: '50px', // Rounded borders
    boxShadow: '0px  4px  6px rgba(0,  0,  0,  0.1)', // Optional shadow effect
    color:"black",
    cursor: 'pointer', // Add cursor pointer style
  }}
>
        {/* <img src="/message.png" alt="Phone Icon" style={{ marginRight: '10px' }} /> Add your phone icon here */}
        <span style={{fontFamily:"Avenir Next LT W02 Regular", fontSize:"11px", fontWeight: 600,letterSpacing:"0.1em"}}>(+91) 7259533331</span>
      </div>
      {showImageList ? (
  // Render your image list here
<div
  style={{
    position: 'fixed',
    right: '65px', // Adjust as necessary
    bottom: '15px', // Adjust as necessary
    display: 'flex',
    flexDirection: 'column', // Arrange children vertically
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    backgroundColor: '#fff',
    width: '65px', // Adjust the size as necessary
    height: 'auto', // Let the height grow with content
    borderRadius: '20px',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    padding: '10px', // Add padding to avoid touching the borders
    boxSizing: 'border-box', // Include padding in the width and height calculations
    gap: '30px', // Spacing between children
    zIndex: 1000, // Ensure it's above other elements
    color:"black",
    cursor: 'pointer', // Add cursor pointer style
  }}
>
  <img src="/cloud.png" alt="Cloud" style={{ width: '40px', height: 'auto',paddingTop:"8px" }} />
  <img src="/whatsapp.jpg" alt="WhatsApp" style={{ width: '25px', height: 'auto' }} />
  <img src="/call.png" alt="Call" style={{ width: '25px', height: 'auto' }} />
  <X style={{ color:"red",width: '25px', height: 'auto',paddingBottom:"8px" }} onClick={toggleImageList}
 />
</div>

) : (
<div
      style={{
        position: 'fixed',
        right: '50px', // Adjust as necessary
        bottom: '-5px', // Adjust as necessary
        display: 'flex',
        alignItems: 'flex-start', // Align items to the top
        justifyContent: 'center',    
      // backgroundColor: '#fff',
      width: '80px', // Adjust the size as necessary
      height: '80px', // Adjust the size as necessary
      borderRadius: '50px',
        boxShadow: '0px  1px  2px rgba(0,  0,  0,  0.1)',
        backgroundImage: 'linear-gradient(to right, white, transparent)', // Gradient effect
        opacity:  1, // Full opacity
        color:"black",
        cursor: 'pointer', // Add cursor pointer style

      }}
    >
         <div
           onClick={toggleImageList}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          top: "5%",
          justifyContent: 'center',
          backgroundColor: '#fff', // Adjust the background color as needed
          borderRadius: '50%', // Creates a circular shape
          width: '45px', // Adjust the size as necessary
          height: '45px', // Adjust the size as necessary
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Optional: add shadow to the button
          cursor: 'pointer', // Add cursor pointer style
        }}
      >
        <img
          src="/messenger.png" // Replace with the correct path to your message icon
          alt="Contact Us"
          style={{
            width: '40%', // Adjust the size as necessary
            height: 'auto',
          }}
        />
      </div>
        
      </div>
)}
      </>
    )} 
   </>
                </Popover.Panel>
              </Transition>
              {!open && (
      <>
       <div
  style={{
    position: 'fixed', // Use fixed positioning to stay in place even when scrolling
    right: '130px', //  10px from the right
    bottom: '25px', //  5px from the bottom
    backgroundColor: '#fff', // Background color of the phone number container
    padding: '12px  25px', // Padding around the text
    borderRadius: '50px', // Rounded borders
    boxShadow: '0px  4px  6px rgba(0,  0,  0,  0.1)', // Optional shadow effect
    color:"black",
    cursor: 'pointer', // Add cursor pointer style
  }}
>
        {/* <img src="/message.png" alt="Phone Icon" style={{ marginRight: '10px' }} /> Add your phone icon here */}
        <span style={{fontFamily:"Avenir Next LT W02 Regular", fontSize:"11px", fontWeight: 600,letterSpacing:"0.1em"}}>(+91) 7259533331</span>
      </div>
      {showImageList ? (
  // Render your image list here
<div
  style={{
    position: 'fixed',
    right: '65px', // Adjust as necessary
    bottom: '15px', // Adjust as necessary
    display: 'flex',
    flexDirection: 'column', // Arrange children vertically
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    backgroundColor: '#fff',
    width: '65px', // Adjust the size as necessary
    height: 'auto', // Let the height grow with content
    borderRadius: '20px',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    padding: '10px', // Add padding to avoid touching the borders
    boxSizing: 'border-box', // Include padding in the width and height calculations
    gap: '30px', // Spacing between children
    zIndex: 1000, // Ensure it's above other elements
    color:"black",
    cursor: 'pointer', // Add cursor pointer style
  }}
>
  <img src="/cloud.png" alt="Cloud" style={{ width: '40px', height: 'auto',paddingTop:"8px" }} />
  <img src="/whatsapp.jpg" alt="WhatsApp" style={{ width: '25px', height: 'auto' }} />
  <img src="/call.png" alt="Call" style={{ width: '25px', height: 'auto' }} />
  <X style={{ color:"red",width: '25px', height: 'auto',paddingBottom:"8px" }} onClick={toggleImageList}
 />
</div>

) : (
<div
      style={{
        position: 'fixed',
        right: '50px', // Adjust as necessary
        bottom: '-5px', // Adjust as necessary
        display: 'flex',
        alignItems: 'flex-start', // Align items to the top
        justifyContent: 'center',    
      // backgroundColor: '#fff',
      width: '80px', // Adjust the size as necessary
      height: '80px', // Adjust the size as necessary
      borderRadius: '50px',
        boxShadow: '0px  1px  2px rgba(0,  0,  0,  0.1)',
        backgroundImage: 'linear-gradient(to right, white, transparent)', // Gradient effect
        opacity:  1, // Full opacity
        color:"black",
        cursor: 'pointer', // Add cursor pointer style
      }}
    >
         <div
           onClick={toggleImageList}
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          top: "5%",
          justifyContent: 'center',
          backgroundColor: '#fff', // Adjust the background color as needed
          borderRadius: '50%', // Creates a circular shape
          width: '45px', // Adjust the size as necessary
          height: '45px', // Adjust the size as necessary
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Optional: add shadow to the button
          cursor: 'pointer', // Add cursor pointer style
        }}
      >
        <img
          src="/messenger.png" // Replace with the correct path to your message icon
          alt="Contact Us"
          style={{
            width: '40%', // Adjust the size as necessary
            height: 'auto',
          }}
        />
      </div>
        
      </div>
)}
      </>
    )} 
             
              </>
              </>
            );
          }}
        </Popover>
      </div>
    </div>
  );
};

export default SideMenu;
