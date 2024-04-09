"use client";

import React, { useState, useEffect, useRef } from "react";
import { Text } from "@medusajs/ui";
import "./SecondProductRail.css";
import Medusa from "@medusajs/medusa-js";
import { useInView } from "react-intersection-observer";


type ProductItemProps = {
  thumbnail: string;
  title: string;
  subtitle?: string; // Make subtitle optional
  description?: string;
  collection_name?: string;
  style: React.CSSProperties;
};

const ProductItem = ({ thumbnail, title, subtitle, description, collection_name, style }: ProductItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubTitleVisible, setIsSubTitleVisible] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isCollectionVisible, setIsCollectionVisible] = useState(false);

  const [isLineVisible, setIsLineVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState('0%'); // State to control line width

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  
  const [lineStyle, setLineStyle] = useState<React.CSSProperties>({});
  const [collectionUnderlineWidth, setCollectionUnderlineWidth] = useState('0%');

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
      setTimeout(() => setIsDescriptionVisible(true), 1200);
      setTimeout(() => setIsCollectionVisible(true), 1200);
      setTimeout(() => {
        setCollectionUnderlineWidth('60%'); // Set the underline to full width
      }, 1400); // Adjust the timing as needed

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

  // Container style updated for the two-column layout
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    // background:" green",
    justifyContent: 'space-between', // This will ensure that the child divs are spread out
    alignItems: 'flex-start',
    width: '100%', // The container takes the full width of its parent
  };

  const leftColumnStyle: React.CSSProperties = {
    paddingTop: "50%",
    width: '60%',
    position: 'relative', // Relative position for absolute child elements
  };
  
  // Title style inside the left column
  const titleStyle: React.CSSProperties = {
    fontFamily: 'Avenir Next LT W02 Regular',
    fontSize: '24px',
    whiteSpace: 'normal',
    position: 'absolute', // Position the title absolutely
    right: '0', // Align the title to the right
    top: '130px', // Align the title to the top
    margin: '10px', // Add some space from the top and right edges
  };
  
  const imageStyle: React.CSSProperties = {
    width: '30%',
    height: 'auto', // Adjust height automatically based on width
    position: 'absolute', // Position the title absolutely
    right: '150px', // Align the title to the right
    top: '180px', // Align the title to the top
 
    // No absolute positioning
  };
  

  // Style for the right column where the title, subtitle, and description will be
  const rightColumnStyle: React.CSSProperties = {
    width: '35%', // Right column takes half of the container's width
  };
 
  // Updated style for the subtitle
  const subtitleStyle: React.CSSProperties = {
    marginTop: isMobileView ? '18px' : '35px',
    fontSize: isMobileView ? '20px' : '36px', // Reduce font size on mobile
    // marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '300px') : '0', // Adjust left margin on mobile
    // marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '250px'), // Adjust right margin on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: "left",
    // width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  };

  const descriptionStyle: React.CSSProperties = {
    marginTop: isMobileView ? '18px' : '35px',
    fontSize: isMobileView ? '12px' : '18px', // Reduce font size on mobile
    // marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '300px') : '0', // Adjust left margin on mobile
    // marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '250px'), // Adjust right margin on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: "left",
    // width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  };
  const collectionStyle: React.CSSProperties = {
    marginTop: isMobileView ? '18px' : '35px',
    fontSize: isMobileView ? '12px' : '18px', // Reduce font size on mobile
    // marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '300px') : '0', // Adjust left margin on mobile
    // marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '250px'), // Adjust right margin on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: "left",
    marginLeft:"5%",
    // background:"red",
    width:"60%"
    // width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  };
  const collectionNameUnderlineStyle: React.CSSProperties = {
    width: collectionUnderlineWidth, // This will be animated
    height: '1.5px', // Thickness of the underline
    backgroundColor: '#000', // Color of the underline
    transition: 'width 0.4s ease-out', // Animation effect
  };
  
    return (
        <div className="product-item" ref={ref} style={containerStyle}>
          <div style={leftColumnStyle}>
            {isTitleVisible && (
              <Text className="product-label" style={titleStyle}>
                {title}
              </Text>
            )}
            <img
              ref={imgRef}
              src={thumbnail}
              alt={title}
              style={imageStyle}
            />
          </div>
    

          <div style={rightColumnStyle}>
            {/* Title above the subtitle */}
            
            {/* Subtitle acts as the heading here */}
            {isSubTitleVisible && subtitle && <Text className="product-subtitle" style={subtitleStyle}>{subtitle}</Text>}
            
            {/* Description below the subtitle */}
            {isDescriptionVisible && description && <Text className="product-description" style={descriptionStyle}>{description}</Text>}
            
            {isCollectionVisible && collection_name && (
  <div style={{ width: '100%', textAlign: 'center', position: 'relative' }}>
    <Text className="product-description" style={collectionStyle}>
      {collection_name}
    </Text>
    <div style={collectionNameUnderlineStyle}></div>
  </div>
)}


            {/* Line can be included if necessary */}
            {/* {isLineVisible && <div style={lineStyle}></div>} */}
          </div>
        </div>
      );
    };




type Product = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  collection_name: string;
};

type FirstCollectionProps = {
  products: Product[]; // Assuming Product is the type of individual products
};
// console.log('products', productsData)
// Update the SecondProductRail component
const SecondProductRail: React.FC<FirstCollectionProps> = ({ products }) => {
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
        ? { position: 'absolute', right: '11%', top: '5%' }
        : isTablet
        ? { position: 'absolute', left: '3%', top: '5%' }
        : { position: 'absolute', left: '10%', top: '5%' };
    case 1:
      return isMobile
        ? { position: 'absolute', left: '11%', top: '32%' }
        : isTablet
        ? { position: 'absolute', right: '3%', top: '30%' }
        : { position: 'absolute', right: '10%', top: '25%' };
    default:
      return {} as React.CSSProperties; // Default style if none of the cases match
  }
};

const isVerticalLayout = windowWidth < 540;
// Map your product data to ProductItem components
 // Before mapping, check if 'products' is defined and is an array to prevent runtime errors.
 const productList = products && Array.isArray(products) ? products.map((product, index) => (
  <ProductItem key={index} thumbnail={product.thumbnail} title={product.title} subtitle={product.subtitle} description={product.description} collection_name={product.collection_name} style={getStyle(index)} />
)) : null;

console.log('products', products)
  // Render the SecondProductRail component
  return (
    <div className="second-product-rail" style={{ position: "relative", }}>
      <div className="second-product-collection" style={{ width: "85%" }}>
        {productList}
      </div>
    </div>
  );
};

export default SecondProductRail;