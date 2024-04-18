"use client"

import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin} from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faTelegram} from '@fortawesome/free-brands-svg-icons/faTelegram';

import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'; // Import chevron icons for the dropdown
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp'; // Import chevron icons for the dropdown

// import LoadingSpinner from '@modules/loader'; // Ensure this path matches where your LoadingSpinner component is located.
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import './FooterNav.css';

const LoadingSpinner = () => {
  return (
    <div className="loader-style">

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
        
      `}</style>
    </div>
  );
};

const FooterNav = () => {
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
      // console.log("Already on the same page:", pathWithoutHash);
      // Do not proceed with navigation
      return;
    }
  
    // console.log("Link clicked with path:", pathWithoutHash);
    setClickedPath(pathWithoutHash); // Update clickedPath to the target path without the hash
    setIsNavigating(true); // Assume navigation is starting
  };
  
 
 // State for managing dropdown visibility
 const [showCategories, setShowCategories] = useState(false);
 const [showForClients, setShowForClients] = useState(false);
 const [showAboutCompany, setShowAboutCompany] = useState(false);

  return (
    <>
    {isNavigating && <LoadingSpinner />}
    
    <div className="border-t border-ui-border-base w-screen" style={{width:"99.5%"}}>
      <div className="content-container flex flex-col">
        
      <div className="main-footer flex gap-y-1 sm:gap-y-2 md:gap-y-4 xsmall:flex-row items-start justify-between py-10" style={{width:"88%", marginLeft:"3%",marginTop:"2%"}}>
          {/* Use gap-x-4 on larger screens if using flex-row, adjust py-10 for padding top and bottom */}
<div className="flex flex-col gap-y-5" style={{ fontSize: "10.5px", fontWeight: 900,fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
<ul className="list-none" style={{lineHeight:"2.5em",textTransform:"uppercase"}}>

            <ul><Link href="/" className="option-list"
                       onClick={ ()=> handleLinkClick('/') } 
>CRAFTS</Link></ul>
            <ul><Link href="/" className="option-list"
                       onClick={ ()=> handleLinkClick('/') } 
>DECORATIONS</Link></ul>
            <ul><Link href="/" className="option-list"
                       onClick={ ()=> handleLinkClick('/') } 
>CREATE DECORATION</Link></ul>
            <ul><Link href="/" className="option-list"
                       onClick={ ()=> handleLinkClick('/') } 
>GIFT CERTIFICATES</Link></ul>
            <ul><Link href="/" className="option-list"
                       onClick={ ()=> handleLinkClick('/') } 
>EXCLUSIVE</Link></ul>
            <ul><Link href="/" className="option-list"
                       onClick={ ()=> handleLinkClick('/') } 
>SPECIAL PROJECTS</Link></ul>

</ul>
            {/* Add more links or text here as needed */}
          </div>
          <div className="footer-nav-container-md flex gap-x-20">
                  <div className="" style={{ fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="txt-black" style={{fontWeight:"bold"}}>CATEGORIES</h3>
            <ul className="list-none mt-3" style={{lineHeight:"3em", textTransform:"uppercase", fontSize:"8px"}}>
              {/* Replace with actual links or text */}
              <li><Link className="option-li" href="/">Rings</Link></li>
              <li><Link className="option-li" href="/">Earrings</Link></li>
              <li><Link className="option-li" href="/">Studs</Link></li>
              <li><Link className="option-li" href="/">Bracelets</Link></li>
              <li><Link className="option-li" href="/">PENDANTS</Link></li>
              <li><Link className="option-li" href="/">BROOCHES</Link></li>
              <li><Link className="option-li" href="/">NECKLACE</Link></li>
              <li><Link className="option-li" href="/">MONO EARRINGS</Link></li>
              <li><Link className="option-li" href="/">CHAINS</Link></li>
              <li><Link className="option-li" href="/">CUFFS</Link></li>
            </ul>
          </div>
          <div className="" style={{fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="txt-black" style={{ fontWeight: "bold"}}>FOR CLIENTS</h3>
            <ul className="list-none mt-3" style={{lineHeight:"3em", textTransform:"uppercase", fontSize:"8px"}}>
              {/* Replace with actual links or text */}
              <li ><Link className="option-li" href="/privacypolicy">Privacy Policy</Link></li>
              <li><Link className="option-li" href="/refundandcancellation">Refund and cancellation Policy</Link></li>
              <li><Link className="option-li" href="/shippinganddelivery">Shipping and Delivery</Link></li>
              <li><Link className="option-li" href="/termsandconditions">Terms and Conditions</Link></li>
              {/* <li><Link className="option-li" href="/">QUESTIONS AND ANSWERS</Link></li> */}
              {/* <li><Link className="option-li" href="/">FOR LEGAL ENTITIES</Link></li>
              <li><Link className="option-li" href="/">BLOG</Link></li> */}
              <li><Link className="option-li" href="/contact">ASK A QUESTION</Link></li>
              
            </ul>
             </div>
          <div className="" style={{fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="txt-black"  style={{ fontWeight: "bold"}}>ABOUT COMPANY</h3>
            <ul className="list-none mt-3" style={{lineHeight:"3em", textTransform:"uppercase", fontSize:"8px"}}>
              {/* Replace with actual links or text */}
              <li><Link className="option-li" href="/careers">CAREERS</Link></li>
              <li><Link className="option-li" href="/corporategiftsandspecialoccasions">Corporate Gifts and Special Occasions</Link></li>
              <li><Link className="option-li" href="/socialresponsibility">Social Responsibility</Link></li>
              <li><Link className="option-li" href="/tailormadecreativesolutions">Tailormade creative solutions</Link></li>
              <li><Link className="option-li" href="/environmentalresponsibility">ENVIRONMENTAL RESPONSIBILITY</Link></li>
            </ul>
                  </div>
                  </div>
          <div className="footer-nav-container">
        <div className="dropdown-section">
          <div className="dropdown-header" onClick={() => setShowCategories(!showCategories)}
          style={{ fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="txt-black" style={{fontWeight:"bold"}}>CATEGORIES</h3>
            <FontAwesomeIcon icon={showCategories ? faChevronUp : faChevronDown} />
            </div>
          {showCategories && (
            <ul className="dropdown-content list-none mt-3" style={{lineHeight:"3em", textTransform:"uppercase", fontSize:"8px"}}>
              {/* Replace with actual links or text */}
              <li className="option-list">Rings</li>
              <li className="option-list">Earrings</li>
              <li className="option-list">Studs</li>
              <li className="option-list">Bracelets</li>
              <li className="option-list">PENDANTS</li>
              <li className="option-list">BROOCHES</li>
              <li className="option-list">NECKLACE</li>
              <li className="option-list">MONO EARRINGS</li>
              <li className="option-list">CHAINS</li>
              <li className="option-list">CUFFS</li>
            </ul>
          )}
          </div>
  
          <div className="dropdown-section">
          <div className="dropdown-header" onClick={() => setShowForClients(!showForClients)}
          style={{fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="txt-black" style={{ fontWeight: "bold"}}>FOR CLIENTS</h3>,
            <FontAwesomeIcon icon={showForClients ? faChevronUp : faChevronDown} />
          </div>
          {showForClients && (
            <ul className="dropdown-content list-none mt-3" style={{lineHeight:"3em", textTransform:"uppercase", fontSize:"8px"}}>
              {/* Replace with actual links or text */}
              <li className="option-list">GUARANTEES</li>
              <li ><Link href="/"
                         onClick={ ()=> handleLinkClick('/') } 
              >PAYMENT AND DELIVERY</Link></li>
              <li className="option-list">FITTING</li>
              <li className="option-list">CERTIFICATION</li>
              <li className="option-list">PERSONALIZATION</li>
              <li className="option-list">QUESTIONS AND ANSWERS</li>
              <li className="option-list">FOR LEGAL ENTITIES</li>
              <li className="option-list">BLOG</li>
              <li className="option-list">ASK A QUESTION</li>
              
              </ul>
          )}
        </div>

        <div className="dropdown-section">
          <div className="dropdown-header" onClick={() => setShowAboutCompany(!showAboutCompany)}
          style={{fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="txt-black"  style={{ fontWeight: "bold"}}>ABOUT COMPANY</h3>
            <FontAwesomeIcon icon={showAboutCompany ? faChevronUp : faChevronDown} />
          </div>
          {showAboutCompany && (
            <ul className="dropdown-content list-none mt-3" style={{lineHeight:"3em", textTransform:"uppercase", fontSize:"8px"}}>
              {/* Replace with actual links or text */}
              <li className="option-list">ABOUT ALROSA</li>
              <li className="option-list">THE WAY OF THE DIAMOND</li>
              <li className="option-list">RUSSIAN CUT</li>
              <li className="option-list">KIMBERLEY PROCESS</li>
              <li className="option-list">SOCIAL RESPONSIBILITY</li>
              <li className="option-list">ENVIRONMENTAL RESPONSIBILITY</li>
              </ul>
          )}
        </div>
                  </div>
                  
                 
          <div className="" style={{fontSize: "10.5px", fontFamily:"Avenir Next LT W02 Regular",letterSpacing:"0.1em" }}>
            <h3 className="option-list" style={{ fontWeight: "bold",fontSize:"10.5px"}}> <Link href="/contact" onClick={ ()=> handleLinkClick('/contact') }>CONTACTS</Link></h3>
            <div className="mt-4" style={{fontSize:"9px"}}>MAIN OFFICE</div>
            <div className="mt-1" style={{color:"#7F3F98", fontWeight: "bolder",letterSpacing:"0.2em", fontFamily:"Avenir Next LT W02 Regular", fontSize:"10px"}}> <span style={{fontWeight: 900}}>(+91) 7259533331</span></div>
            <div className="mt-4" style={{fontSize:"9px"}}>CUSTOMER SERVICE</div>
            <div className="mt-1"  style={{color:"#713787", fontWeight: "bolder",letterSpacing:"0.2em", fontFamily:"Avenir Next LT W02 Regular", fontSize:"10px", textTransform:"uppercase"}}>
              <a href="mailto:vikram@rflabs.in" >vikram@rflabs.in</a>
            </div>
            <div className="social-media-links mt-5" style={{ display: 'flex', gap: '30px' }}>
  <a href="mailto:example@email.com" aria-label="Email">
    <FontAwesomeIcon icon={faEnvelope} color="#713787" style={{width:"18px",height:"auto"}} />
  </a>
  <a href="https://instagram.com/yourprofile" aria-label="Instagram">
    <FontAwesomeIcon icon={faTelegram} color="#713787" style={{width:"18px",height:"auto"}} />
  </a>
  <a href="https://www.linkedin.com/in/yourprofile" aria-label="LinkedIn">
    <FontAwesomeIcon icon={faLinkedin} color="#713787" style={{width:"18px",height:"auto"}} />
  </a>
</div>

              </div>
        </div>
        <div style={{marginLeft:"4%",marginBottom:"4%"}}>
        <div className="justify-between items-center mb-4 main-footer" style={{ fontSize: "8.5px", fontFamily: "Avenir Next LT W02 Regular", letterSpacing: "0.1em", fontWeight: 400 }}>
        <div className="copyright-footer" style={{   justifyContent: 'space-between', alignItems: 'center' }}>
  <p className="footer-paragraph">
  © 2024 by VNS Ventures. Powered and secured by RFLABS
    </p>
    <div className="footer-set" style={{display:"flex", gap: "15px", fontSize:"8px"}}>

  <p className="footer-paragraph">
    PRIVACY POLICY
  </p>
  <p className="footer-paragraph">
    PUBLIC OFFER
  </p>
  <p className="footer-paragraph">
    SITE MAP
  </p>
  </div>
  {/* MedusaCTA component or other content here */}
</div>


<div className="payment-footer" style={{   gap: "10px" }}>
  <img src="/gpay.webp" alt="gpay" style={{ width: "28px", height: "auto" }} />
  <img src="/applepay.png" alt="applepay" style={{ width: "28px", height: "auto" }} />
  <img className="samsung-img" src="/samsungpay.png" alt="samsungpay" style={{ width: "28px"}} />
  <img className="visa-img" src="/visa.png" alt="visa" style={{ width: "28px"}} />
  <img src="/mastercard.png" alt="mastercard" style={{ width: "28px", height: "auto" }} />
  <img src="/mnp.jpg" alt="mnp" style={{ width: "40px", height: "auto" }} />
  {/* MedusaCTA component or other content here */}
</div>

        </div>
 
<div className="flex mb-16 justify-between site-policy" style={{ fontSize: "8.5px", fontFamily: "Avenir Next LT W02 Regular", letterSpacing: "0.1em", fontWeight:  400 }}>
  <p className="footer-paragraph">
  THIS SITE IS PROTECTED BY RECAPTCHA AND THE GOOGLE PRIVACY POLICY AND TERMS OF SERVICE APPLY.
  </p>
  {/* MedusaCTA component or other content here */}
</div>
        </div>
     

      </div>
     
    </div>

    </>
  );
};

export default React.memo(FooterNav);