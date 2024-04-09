"use client";

import React, { useState, useEffect, useRef } from "react";
import { Text } from "@medusajs/ui";
import "./ProductRail.css";
import Medusa from "@medusajs/medusa-js";
import { useInView } from "react-intersection-observer";


type ProductItemProps = {
  thumbnail: string;
  title: string;
  subtitle?: string; // Make subtitle optional
  style: React.CSSProperties;
};

const ProductItem = ({ thumbnail, title, subtitle, style }: ProductItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubTitleVisible, setIsSubTitleVisible] = useState(false);
  const [isLineVisible, setIsLineVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState('0%'); // State to control line width

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  
  const [lineStyle, setLineStyle] = useState<React.CSSProperties>({});
  
  const isImageLeftAligned = style?.left !== undefined;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
      setTimeout(() => setIsTitleVisible(true), 800);
      setTimeout(() => setIsSubTitleVisible(true), 1200);
      setTimeout(() => {
        setIsLineVisible(true);
        const initialLineState: React.CSSProperties = {
          border: "1px solid rgba(0,0,0,0.7)",
          position: "absolute",
          bottom: '0', // Adjust based on your layout
        };
        if (!isImageLeftAligned) {
          // Line grows from left to right
          setLineStyle({
            ...initialLineState,
            left: '23px', // Adjust based on your layout
            width: '0%',
            transition: 'width 0.4s ease-out',
          });
          setTimeout(() => setLineStyle(prev => ({ ...prev, width: "40%" })), 10); // Delay to trigger transition
        } else {
          // Line grows from right to left
          setLineStyle({
            ...initialLineState,
            right: '23px', // Adjust based on your layout
            width: '0%',
            transition: 'width 0.4s ease-out',
          });
          setTimeout(() => setLineStyle(prev => ({ ...prev, width: "40%" })), 10); // Delay to trigger transition
        }
      }, 1400);
    }
  }, [inView, isImageLeftAligned]);

  // console.log('isVisible', isVisible,'title ',title)
  const imgRef = useRef<HTMLImageElement>(null); // Ref for the image element

  // Intersection Observer callback function
  const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true); // Set image as visible
        observer.unobserve(entry.target); // Stop observing the current target
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Adjust threshold according to your needs
    });
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [imgRef]);
  const containerAnimationClass = isVisible ? 'container-grow-animation' : '';

   // Determine if the screen width is less than 540px to adjust styles accordingly
   const isMobileView = windowWidth < 540;

  const containerStyle: React.CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: isImageLeftAligned ? 'row' : 'row-reverse',
    alignItems: 'flex-start', // Adjust to align items at the start
  };

  const titleStyle: React.CSSProperties = {
    marginLeft: isImageLeftAligned ? (isMobileView ? '50px' : '210px') : '0', // Adjust left margin on mobile
    marginRight: isImageLeftAligned ? '0' : (isMobileView ? '70px' : '230px'), // Adjust right margin on mobile 
    marginTop: '10px', 
    fontFamily: 'Avenir Next LT W02 Regular',
    fontSize: isMobileView ? '18px' : '24px', // Reduce font size on mobile
    whiteSpace: 'normal',
    width: isMobileView ? '100%' : '200px', // Use full width on mobile
  };
  
  
  // Updated style for the subtitle
  const subtitleStyle: React.CSSProperties = {
    marginTop: isMobileView ? '18px' : '35px',
    fontSize: isMobileView ? '12px' : '14px', // Reduce font size on mobile
    marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '300px') : '0', // Adjust left margin on mobile
    marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '250px'), // Adjust right margin on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: isImageLeftAligned ? 'left' : 'right',
    width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  };
//  const lineStyle: React.CSSProperties = {
//     marginLeft: style?.left !== undefined ? '280px' : '23px',
//     border: "1px solid rgba(0,0,0,0.7)",
//     width: lineWidth, // Use dynamic width for the animation
//     maxWidth: style?.left !== undefined ? "40%" : "35%", // Set maximum width based on alignment
//     position: "absolute",
//     transition: 'width 0.4s ease-out', // Smooth out the animation
//   };
    // Adjust containerStyle to potentially include other necessary styles for animation
    const imageContainerStyle: React.CSSProperties = {
      background: "#e3e4e6",
      padding: isMobileView ? "4%":"10%",
      width: isMobileView ? "100px":"250px",
      height: "auto", // Ensure container can grow in height
      overflow: "hidden", // Optional, to ensure content fits within animated dimensions
    };
  
    const imageStyle: React.CSSProperties = {
      width: isMobileView ? '80px' : '200px', // Full width on mobile
      height: 'auto',
    };

  return (
    <div className="product-item" ref={ref} style={containerStyle}>
  <div
        className={containerAnimationClass} // Apply the animation class to this div
        style={imageContainerStyle}
      >
        <img
          ref={imgRef} // Attach the ref to the image
          src={thumbnail}
          alt={title}
          style={imageStyle}// You might adjust this depending on animation needs
        />
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

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Add event listener
  window.addEventListener("resize", handleResize);

  // Remove event listener on cleanup
  return () => window.removeEventListener("resize", handleResize);
}, []);

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
        : { position: 'absolute', right: '10%', top: '5%' };
    case 1:
      return isMobile
        ? { position: 'absolute', right: '11%', top: '32%' }
        : isTablet
        ? { position: 'absolute', left: '3%', top: '30%' }
        : { position: 'absolute', left: '10%', top: '25%' };
    // case 2:
    //   return isMobile
    //     ? { position: 'absolute', left: '11%', top: '69%' }
    //     : isTablet
    //     ? { position: 'absolute', left: '3%', top: '65%' }
    //     : { position: 'absolute', left: '10%', top: '55%' };
    // case 3:
    //   return isMobile
    //     ? { position: 'absolute', right: '11%', top: '80%' }
    //     : isTablet
    //     ? { position: 'absolute', left: '3%', top: '80%' }
    //     : { position: 'absolute', left: '10%', top: '65%' };
    default:
      return {} as React.CSSProperties; // Default style if none of the cases match
  }
};

const isVerticalLayout = windowWidth < 540;
// Map your product data to ProductItem components
 // Before mapping, check if 'products' is defined and is an array to prevent runtime errors.
 const productList = products && Array.isArray(products) ? products.map((product, index) => (
  <ProductItem key={index} thumbnail={product.thumbnail} title={product.title} subtitle={product.subtitle} style={getStyle(index)} />
)) : null;

console.log('products', products)
  // Render the ProductRail component
  return (
    <div className="product-rail" style={{ position: "relative" }}>
      <div className="product-collection" style={{ width: "85%" }}>
        {productList}
      </div>
    </div>
  );
};

export default ProductRail;