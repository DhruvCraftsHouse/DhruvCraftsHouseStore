"use client";

import React, { useState, useEffect, useRef } from "react";
import { Text } from "@medusajs/ui";
import "./ProductRail.css";
import Medusa from "@medusajs/medusa-js";
import { useInView } from "react-intersection-observer";

type ProductItemProps = {
  thumbnail: string;
  title: string;
  subtitle?: string;
  style: React.CSSProperties;
  index: number;
  initialDelay?: number;  // Delay before starting the animation sequence for this item
};


const ProductItem = ({ thumbnail, title, subtitle, style, index, initialDelay = 0 }: ProductItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubTitleVisible, setIsSubTitleVisible] = useState(false);
  const [isLineVisible, setIsLineVisible] = useState(false);
  
  const [lineStyle, setLineStyle] = useState<React.CSSProperties>({});
  
  const isImageLeftAligned = style?.left !== undefined;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [animationClass, setAnimationClass] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setAnimationClass("fade-in");
  }, initialDelay); // Start fade-in after initialDelay

  return () => clearTimeout(timer);
}, [initialDelay]);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  // console.log('isVisible', isVisible,'title ',title)
  const imgRef = useRef<HTMLImageElement>(null); // Ref for the image element

    // useRef for the <h1> element
    // const h1Ref = useRef<HTMLHeadingElement>(null);

   // useInView hook to monitor when the <h1> tag enters the viewport
   const { ref: h1Ref, inView: isH1InView } = useInView({
    triggerOnce: true,
    delay: 100, // Optional: add a delay to debounce or throttle the inView updates
  });


  // Effect to handle the visibility based on the <h1> element's inView state
  // useEffect(() => {
  //   console.log('isH1inView', isH1InView)
  //   setIsVisible(isH1InView);
  // }, [isH1InView]);

  // Use an effect for initial delay to control the animations
  useEffect(() => {
    // Set a timeout for the initial delay plus any additional delay for this specific item
    const totalDelay = initialDelay + (index === 0 ? 2000 : 0); // Add 5 seconds if it's the first item

    // Timeouts for each animation stage
    const imageTimeout = setTimeout(() => setIsVisible(true), totalDelay);
    const titleTimeout = setTimeout(() => setIsTitleVisible(true), totalDelay + 500);  // 500ms after the image becomes visible
    const subtitleTimeout = setTimeout(() => setIsSubTitleVisible(true), totalDelay + 1000); // 1000ms after the image

    // Clean up timeouts when the component is unmounted or when the dependencies change
    return () => {
      clearTimeout(imageTimeout);
      clearTimeout(titleTimeout);
      clearTimeout(subtitleTimeout);
    };
  }, [initialDelay, index]);
  
  const containerAnimationClass = isVisible ? 'reveal-animation' : '';

   // Determine if the screen width is less than 540px to adjust styles accordingly
   const isMobileView = windowWidth < 540;
   const isTablet = windowWidth >= 540 && windowWidth <= 1024; // Example breakpoint for tablet

   useEffect(() => {
    if (isSubTitleVisible) {
      // setIsVisible(true);
      // setTimeout(() => setIsTitleVisible(true), 800);
      // setTimeout(() => setIsSubTitleVisible(true), 1200);
      setTimeout(() => {
        setIsLineVisible(true);
        const initialLineState: React.CSSProperties = {
          border: "1px solid rgba(0,0,0,0.7)",
          position: "absolute",
          bottom: '0', // Adjust based on your layout
        };
  
        const commonLineStyle = {
          ...initialLineState,
          width: '0%',
          transition: 'width 0.4s ease-out',
        };
  
        if (isTablet) {
          // Adjustments specific to tablet view
          if (!isImageLeftAligned) {
            // For right-aligned images in tablet view
            setLineStyle({
              ...commonLineStyle,
              left: '200px',
              width: '0%',
            });
          } else {
            // For left-aligned images in tablet view
            setLineStyle({
              ...commonLineStyle,
              right: '180px',
              width: '0%',
            });
          }
          // Adjust line width for tablet view
          setTimeout(() => setLineStyle(prev => ({ ...prev, width: "40%" })), 10);
        } else {
          // Adjustments for mobile and desktop views remain as they were
          if (!isImageLeftAligned) {
            setLineStyle({
              ...commonLineStyle,
              left: isMobileView ? '40px' : '23px',
              width: '0%',
            });
            setTimeout(() => setLineStyle(prev => ({ ...prev, width: isMobileView ? "60%" : "30%" })), 10);
          } else {
            setLineStyle({
              ...commonLineStyle,
              right: isMobileView ? '40px' : '23px',
              width: '0%',
            });
            setTimeout(() => setLineStyle(prev => ({ ...prev, width: "50%" })), 10);
          }
        }
      }, 1400);
    }
  }, [isSubTitleVisible, isImageLeftAligned, isMobileView, isTablet]);
  
  
  const containerStyle: React.CSSProperties = {
    ...style,
    display: 'flex',
    // opacity: isVisible ? 1 : 0,
    flexDirection: isImageLeftAligned ? 'row' : 'row-reverse',
    alignItems: 'flex-start', // Adjust to align items at the start
  };

  const titleStyle: React.CSSProperties = {
    marginLeft: isTablet ? '220px' : isImageLeftAligned ? (isMobileView ? '130px' : '240px') : '0',
    marginRight: isTablet ? '200px' : isImageLeftAligned ? '0' : (isMobileView ? '0px' : '450px'),
    marginTop: isMobileView ? '-30px' : '10px', 
    fontFamily: 'Avenir Next LT W02 Regular',
    fontSize: isMobileView ? '16px' : '24px', // Reduce font size on mobile
    whiteSpace: 'normal',
    width: isMobileView ? '130px' : '190px', // Use full width on mobile
    textAlign:"left"
  };
  
  
  // Updated style for the subtitle
  const subtitleStyle: React.CSSProperties = {
    marginTop: isMobileView ? '8px' : '35px',
    fontSize: isMobileView ? '12px' : '14px', // Reduce font size on mobile
    marginLeft: isTablet ? '220px' : isImageLeftAligned ? (isMobileView ? '130px' : '230px') : '0',
    marginRight: isTablet ? '280px' : isImageLeftAligned ? '0' : (isMobileView ? '0px' : '0px'),
   // marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '220px') : '0', // Adjust left margin on mobile
    // marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '600px'), // Adjust right margin on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: isImageLeftAligned ? 'left' : 'right',
    width: isMobileView ? '50%' : (isImageLeftAligned ? "50%" : '30%'), // Use full width on mobile
  };

    const getImageContainerStyle = (index: number, isMobileView: boolean): React.CSSProperties => {
      // Define the style object with a flexible type
      let style: React.CSSProperties = {
        // padding: isMobileView ? "4%" : "10%",
        height: "auto",
        overflow: "hidden",
      };
    
      // Adjust width based on index and mobile view
      if (isMobileView) {
        style.width = '120px'; // Set container width for mobile view
      } 
      else if (isTablet) {
        style.width = '250px'; // Set container width for mobile view
      } 
      else {
        // Adjust container width for desktop view based on index
        if (index === 0) {
          style.width = '500px';
        } else if (index === 1) {
          style.width = '300px';
        }
      }
    
      return style;
    };
    
    const getImageStyle = (index: number, isMobileView: boolean): React.CSSProperties => {
      let style: React.CSSProperties = {
        height: 'auto',
      };
    
      if (isMobileView) {
        style.width = '120px'; // Set image width for mobile view
      }
      else if (isTablet) {
        style.width = '250px'; // Set container width for mobile view
      }  else {
        // Adjust image width for desktop view based on index
        if (index === 0) {
          style.width = '370px';
        } else if (index === 1) {
          style.width = '250px';
        }
      }
    
      return style;
    };
    
    const imageContainerStyle = getImageContainerStyle(index, isMobileView);
    const imageStyle = getImageStyle(index, isMobileView);

      // Calculate H1 top value based on image top style + 30%
  const h1Style = {
    ...style, // Spread the existing styles to maintain alignment and other styles
    top: `calc(${style.top} + 200px)`, // This will calculate 30% more from the top value of the image container
    color:"transparent"
  };

  const mobileImageStyle: React.CSSProperties = isMobileView
    ? {
        width: '100%', // Full width of the screen
        height: 'auto', // Maintain aspect ratio
        position: 'absolute', // Absolutely position to the left
        left: 0, // Align to the left edge
        top: style.top, // Use top from passed style for vertical alignment
      }
    : {};
 
  return (
    
    <div className="product-item" style={containerStyle}>
      <h1 ref={h1Ref} style={h1Style}>{thumbnail}</h1>  {/* Attach ref directly to h1 tag */}

      <div
        className={containerAnimationClass}
        style={!isMobileView ? imageContainerStyle : mobileImageStyle}
      >
        {isVisible && (
          <img
            ref={imgRef}
            src={thumbnail}
            alt={title}
            style={imageStyle}
          />
        )}
      </div>

        <div style={{ marginTop: "12%", marginRight: "", position: "absolute" }}>
      
        {isTitleVisible && (

        <Text className="product-label" style={titleStyle}>
          {title}
        </Text>
              )}

        {subtitle && 
        subtitle!=="No subtitle" &&
         (
          <div>
                    {isSubTitleVisible && (

            <Text className="product-subtitle" style={subtitleStyle}>
              {subtitle || "Test Subtitle"}
            </Text>
                    )}
                    {(isLineVisible && (
            <div style={lineStyle}></div>

                    ))}
          </div>
        )}
      </div>
            
    </div>
  );
};




type Product = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
};

type FirstCollectionProps = {
  products: Product[]; // Assuming Product is the type of individual products
};


// console.log('products', productsData)
// Update the ProductRail component
const ProductRail: React.FC<FirstCollectionProps> = ({ products }) => {
  // State to store the current window width
const [windowWidth, setWindowWidth] = useState(window.innerWidth);
const railRef = useRef<HTMLDivElement>(null);
const [hasScrolledToCenter, setHasScrolledToCenter] = useState(false);


useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  const handleScroll = () => {
    if (!hasScrolledToCenter && window.scrollY > 0 && railRef.current) {
      const rect = railRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) { // Check if in viewport
        const railHeight = rect.height;
        const verticalOffset = window.innerHeight * 0.08; // 8% of the viewport height
        const yOffset = window.pageYOffset + rect.top + (railHeight / 2) - (window.innerHeight / 2)- verticalOffset;
        window.scrollTo({ top: yOffset, behavior: 'smooth' });
        setHasScrolledToCenter(true);
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [hasScrolledToCenter]);

const getStyle = (index: number): React.CSSProperties => {
  // Define breakpoints or use a library like 'use-media'

  if (windowWidth < 540) {
    return {
      position: 'relative', // Changed from 'absolute' to 'relative'
      left: '50%',
      transform: 'translateX(-50%)',
      top: `${index * 100}%`, // Each item is placed one after another
      width: '100%', // Optional: Adjust width as per your design
      marginBottom:'5%'
    };
  }
  const isMobile = windowWidth < 540; // Example breakpoint for mobile
  const isTablet = windowWidth >= 540 && windowWidth <= 1024; // Example breakpoint for tablet

  // Adjust styles based on screen size
  switch (index) {
    case 0:
      return isMobile
        ? { position: 'absolute', left: '11%', top: '5%' }
        : isTablet
        ? { position: 'absolute', right: '3%', top: '5%' }
        : { position: 'absolute', right: '0%', top: '10%' };
    case 1:
      return isMobile
        ? { position: 'absolute', right: '11%', top: '40%' }
        : isTablet
        ? { position: 'absolute', left: '3%', top: '37%' }
        : { position: 'absolute', left: '5%', top: '40%' }; 
    default:
      return {} as React.CSSProperties; // Default style if none of the cases match
  }
};

const isVerticalLayout = windowWidth < 540;
// Map your product data to ProductItem components
 // Before mapping, check if 'products' is defined and is an array to prevent runtime errors.
const productList = hasScrolledToCenter && products && Array.isArray(products) ? products.map((product, index) => (
  <ProductItem
  key={index}
  index={index}
  thumbnail={product.thumbnail}
  title={product.title}
  subtitle={product.subtitle}
  style={getStyle(index)}
  initialDelay={index * 3500}  // Each item starts its animation 1.5 seconds after the previous
/>
)) : null;


console.log('products', products)
  // Render the ProductRail component
  return (
    <div ref={railRef} className="product-rail" style={{ position: "relative"}}>
      <div className="product-collection" style={{ width: "95%" }}>
        {productList}
      </div>
    </div>
  );
};

export default ProductRail;