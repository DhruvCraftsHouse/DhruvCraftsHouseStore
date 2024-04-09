"use client";

import React, { useState, useEffect, useRef } from "react";
import { Text } from "@medusajs/ui";
import "./ThirdProductRail.css";
import ImageCarousel from "../image-preview-carousel";
import Medusa from "@medusajs/medusa-js";
import { useInView } from "react-intersection-observer";


type ProductItemProps = {
  thumbnail: string;
  title: string;
  subtitle?: string;
  description?: string;
  collection_name?: string;
  style?: React.CSSProperties;
  images: Image[]; // Add this line to include images in the props
};


const ProductItem = ({ thumbnail, title, subtitle, description, collection_name, images, style  }: ProductItemProps) => {
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
        setCollectionUnderlineWidth('50%'); // Set the underline to full width
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
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically (if you want vertical centering as well)
    // paddingTop: '10%', // This is optional, depending on your design
  };
  
  const titleStyle: React.CSSProperties = {
    fontFamily: 'Avenir Next LT W02 Regular',
    fontSize: '24px',
    whiteSpace: 'normal',
    textAlign: 'center', // Center text horizontally
    margin: '10px 0', // Spacing between title and image
  };
  
  const collectionStyle: React.CSSProperties = {
    fontSize: '18px', // Adjust font size as needed
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: 'center', // Center text horizontally
    width: '100%', // Take full width to center the text within
    marginTop: '25px', // Space from the title or image above
  };
  
  // Remove the position: 'absolute' from the imageStyle
  const imageStyle: React.CSSProperties = {
    width: '80%', // Or '100%' if you want the image to be full width
    height: 'auto',
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
  // const collectionStyle: React.CSSProperties = {
  //   marginTop: isMobileView ? '18px' : '65px',
  //   fontSize: isMobileView ? '12px' : '18px', // Reduce font size on mobile
  //   // marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '300px') : '0', // Adjust left margin on mobile
  //   // marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '250px'), // Adjust right margin on mobile
  //   fontFamily: 'Avenir Next LT W02 Regular',
  //   color: '#000',
  //   whiteSpace: 'pre-wrap',
  //   wordWrap: 'break-word',
  //   // textAlign: "center",
  //   // marginLeft:"5%",
  //   // justifyContent:"center",
  //   // background:"red",
  //   width:"60%"
  //   // width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  // };
  const collectionNameUnderlineStyle: React.CSSProperties = {
    width: '35%', // Adjust this value to control the length of the underline
    height: '1.2px',
    backgroundColor: '#000',
    transition: 'width 0.4s ease-out',
    margin: '0 auto', // Automatically adjust the margins to center the line
  };
  
  
  return (
    <div className="product-item" ref={ref} style={containerStyle}>
      <div style={leftColumnStyle}>
        {isTitleVisible && (
          <Text className="product-label" style={titleStyle}>
            {title}
          </Text>
        )}
        {/* <img
          ref={imgRef}
          src={thumbnail}
          alt={title}
          style={imageStyle}
        /> */}
        {isCollectionVisible && collection_name && (
          <Text className="product-description" style={collectionStyle}>
            {collection_name}
          </Text>
        )}
        {/* The underline can be included here if needed */}
        {isCollectionVisible && collection_name && (
          <div style={collectionNameUnderlineStyle}></div>
        )}
      </div>
    

      <div style={rightColumnStyle}>
        {/* Replace the img tag with ImageCarousel */}
        {isTitleVisible && images && images.length > 0 && (
          <ImageCarousel images={images} />
        )}
      </div>
        </div>
      );
    };



    type Image = {
      id: string;
      url: string;
    };
    
    type Product = {
      id: string;
      title: string;
      subtitle: string;
      thumbnail: string;
      description: string;
      collection_name: string;
      images: Image[]; // This is the new part
    };
    

type FirstCollectionProps = {
  products: Product[]; // Assuming Product is the type of individual products
};
// console.log('products', productsData)
// Update the ThirdProductRail component
const ThirdProductRail: React.FC<FirstCollectionProps> = ({ products }) => {
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
  <ProductItem key={index} thumbnail={product.thumbnail} title={product.title} subtitle={product.subtitle} description={product.description} collection_name={product.collection_name} images={product.images}
  style={getStyle(index)} />
)) : null;

console.log('products', products)
  // Render the ThirdProductRail component
  return (
    <div className="third-product-rail" style={{ position: "relative", }}>
      <div className="third-product-collection" style={{ width: "85%" }}>
        {productList}
      </div>
    </div>
  );
};

export default ThirdProductRail;