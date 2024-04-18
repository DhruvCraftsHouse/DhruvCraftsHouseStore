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
  const [isImageVisible, setIsImageVisible] = useState(false); // New state for image visibility
  const [isCollectionVisible, setIsCollectionVisible] = useState(false);

  const [isLineVisible, setIsLineVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState('0%'); // State to control line width

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const imageRef = useRef(null); // You might not need this anymore if using useInView for the image

  // useInView hook for the image
  const [imageInViewRef, imageInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [h1Ref, h1InView] = useInView({
    triggerOnce: true,
    threshold: 0.5, // Consider adjusting the threshold based on how much of the element you want in view
  });

  // Effect to trigger animations in sequence once <h1> is in view
  useEffect(() => {
    if (inView) {
      const timeoutSubtitle = setTimeout(() => setIsSubTitleVisible(true), 500);
      const timeoutDescription = setTimeout(() => setIsDescriptionVisible(true), 1000);
      const timeoutCollection = setTimeout(() => setIsCollectionVisible(true), 1500);
      const timeoutImage = setTimeout(() => setIsImageVisible(true), 2000);
      const timeoutTitle = setTimeout(() => setIsTitleVisible(true), 2800);

      return () => {
        clearTimeout(timeoutSubtitle);
        clearTimeout(timeoutDescription);
        clearTimeout(timeoutCollection);
        clearTimeout(timeoutImage);
        clearTimeout(timeoutTitle);
      };
    }
  }, [inView]);

  const fadeInStyle = {
    opacity: 1,
    transition: 'opacity 2s ease-in-out' // Increased duration to 2 seconds
  };

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
    if (h1InView) {
      
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
            // transition: 'width 0.4s ease-out',
          });
          setTimeout(() => setLineStyle(prev => ({ ...prev, width: "40%" })), 10); // Delay to trigger transition
        } else {
          // Line grows from right to left
          setLineStyle({
            ...initialLineState,
            right: '23px', // Adjust based on your layout
            width: '0%',
            // transition: 'width 0.4s ease-out',
          });
          setTimeout(() => setLineStyle(prev => ({ ...prev, width: "40%" })), 10); // Delay to trigger transition
        }
      }, 1400);
    }
  }, [h1InView, isImageLeftAligned]);

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
    ...fadeInStyle,
    fontFamily: 'Avenir Next LT W02 Regular',
    fontSize: '24px',
    whiteSpace: 'normal',
    position: 'absolute', // Position the title absolutely
    right: '0', // Align the title to the right
    top: '130px', // Align the title to the top
    margin: '10px', // Add some space from the top and right edges
    opacity: isTitleVisible ? 1 : 0,

  };
  
  const imageStyle: React.CSSProperties = {
    width: '25%',
    height: 'auto', // Adjust height automatically based on width
    position: 'absolute', // Position the title absolutely
    right: '150px', // Align the title to the right
    top: '180px', // Align the title to the top
 
    // No absolute positioning
  };
  const imageContainerStyle: React.CSSProperties = {
    // Add your desired styles for the image container here
    // For example, ensuring the container allows for the animation of its child image
    overflow: 'hidden', // Ensuring overflow content is not visible, important for animations
    width: '25%', // Example width, adjust according to your needs
    position: 'absolute', // Position the title absolutely
    right: '150px', // Align the title to the right
    top: '180px', 
    // You might want to add a minHeight or specific height if your design requires it
  };
  // Style for the animated image appearance
  const animatedImageStyle: React.CSSProperties = {
    opacity: isImageVisible ? 1 : 0,
    transform: isImageVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
    // Apply your existing image style here as well
    width: '100%', // Adjust as needed
    height: 'auto'
  };


  // Style for the right column where the title, subtitle, and description will be
  const rightColumnStyle: React.CSSProperties = {
    width: '35%', // Right column takes half of the container's width
  };
 
  // Updated style for the subtitle
  const subtitleStyle: React.CSSProperties = {
    ...fadeInStyle,
    marginTop: isMobileView ? '18px' : '35px',
    fontSize: isMobileView ? '20px' : '36px', // Reduce font size on mobile
    // marginLeft: isImageLeftAligned ? (isMobileView ? '130px' : '300px') : '0', // Adjust left margin on mobile
    // marginRight: isImageLeftAligned ? '0' : (isMobileView ? '0px' : '250px'), // Adjust right margin on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: "left",
    lineHeight:"1.1em",
    textTransform:"capitalize",
    opacity: isSubTitleVisible ? 1 : 0,

    // width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  };

  const descriptionStyle: React.CSSProperties = {
    ...fadeInStyle,
    marginTop: isMobileView ? '18px' : '35px',
    fontSize: isMobileView ? '12px' : '18px', // Reduce font size on mobile
    fontFamily: 'Avenir Next LT W02 Regular',
    color: '#000',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    textAlign: "left",
    // CSS for limiting the text to 3 lines
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: isMobileView ? '16px' : '24px', // Adjust the line height as needed
    maxHeight: isMobileView ? '48px' : '72px', // Adjust based on the font size and line height
    opacity: isDescriptionVisible ? 1 : 0,
  };
  
  const collectionStyle: React.CSSProperties = {
    ...fadeInStyle,
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
    width:"60%",
    opacity: isCollectionVisible ? 1 : 0,
    // width: isMobileView ? '100%' : (isImageLeftAligned ? "40%" : '30%'), // Use full width on mobile
  };
  const collectionNameUnderlineStyle: React.CSSProperties = {
    width: collectionUnderlineWidth, // This will be animated
    height: '1.5px', // Thickness of the underline
    backgroundColor: '#000', // Color of the underline
    // transition: 'width 0.4s ease-out', // Animation effect
  };
  const h1Style = {
    ...style, // Spread the existing styles to maintain alignment and other styles
    // position: 'relative',
    // bottom: "150px"
    top: `calc(${style.top} + 260px)`, // This will calculate 30% more from the top value of the image container
    // color:"transparent"
  };
  
    return (
        <div className="product-item" ref={ref} style={containerStyle}>
          <div style={leftColumnStyle}>
            {/* {isTitleVisible && ( */}
            <Text className={`product-label ${isTitleVisible ? 'fadeIn' : ''}`} style={titleStyle}>
 {title}
</Text>

            {/* )} */}
            
      <h1 ref={h1Ref} style={h1Style}>{thumbnail}</h1>  {/* Attach ref directly to h1 tag */}

<div className={containerAnimationClass} style={imageContainerStyle}>
        {/* Update the ref and style to use the animation */}
        <img ref={imageInViewRef} src={thumbnail} alt={title} style={animatedImageStyle} />
      </div>
          </div>
    

          <div style={rightColumnStyle}>
            {/* Title above the subtitle */}
            
            {/* Subtitle acts as the heading here */}
            {/* {isSubTitleVisible && subtitle && <Text className="product-subtitle" style={subtitleStyle}>{subtitle}</Text>}
            
            {isDescriptionVisible && description && <Text className="product-description" style={descriptionStyle}>{description}</Text>} */}
            
            <Text className={`product-subtitle ${isSubTitleVisible ? 'fadeIn' : ''}`} style={subtitleStyle}>
 {subtitle}
</Text>

<Text className={`product-description ${isCollectionVisible ? 'fadeIn' : ''}`} style={descriptionStyle}>
 {description}
</Text>

            {isCollectionVisible && collection_name && (
  <div style={{ width: '100%', textAlign: 'center', position: 'relative' }}>
    <Text className="product-description" style={collectionStyle}>
      {collection_name}
    </Text>
  </div>
)}


            {/* Line can be included if necessary */}
            {/* {isLineVisible && <div style={lineStyle}></div>} */}
          </div>
        </div>
      );
    };

    const MobileProductItem = ({ thumbnail, title, subtitle, description, collection_name, style }: ProductItemProps) => {
      // Ref and inView state for each element
      const [collectionRef, collectionInView] = useInView({ threshold: 0.1, triggerOnce: true });
      const [imageRef, imageInView] = useInView({ threshold: 0.1, triggerOnce: true });
      const [titleRef, titleInView] = useInView({ threshold: 0.1, triggerOnce: true });
      const [subtitleRef, subtitleInView] = useInView({ threshold: 0.1, triggerOnce: true });
      const [descriptionRef, descriptionInView] = useInView({ threshold: 0.1, triggerOnce: true });
    
      const [underlineWidth, setUnderlineWidth] = useState('0%');
    
      useEffect(() => {
        if (collectionInView) {
          setUnderlineWidth('50%'); // Trigger the underline to grow to 50% width when in view
        }
      }, [collectionInView]);
    
      const descriptionStyle: React.CSSProperties = {
        fontSize: '12px',
        marginBottom: '20px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '16px', // Adjust the line height to fit the design
        maxHeight: '48px', // This should be 3 times the line-height if it's uniform
        textAlign: 'center',
      };
      
      return (
        <div style={{...style, padding: '10px', textAlign: 'center', marginBottom: '20px' }}>
          <div ref={collectionRef} style={{ marginBottom: '20px' }}>
            <Text className="product-collection-name" style={{ fontSize: '16px', position: 'relative', marginBottom: '20px' }}>
              {collection_name}
              <div style={{
                height: '1px',
                background: 'black',
                width: underlineWidth,
                transition: 'width 0.5s ease',
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}></div>
            </Text>
          </div>
          <div ref={imageRef} className={imageInView ? "imageReveal" : ""} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <img src={thumbnail} alt={title} style={{ width: '70%', height: 'auto', marginBottom: '20px' }} />
          </div>
          <div ref={titleRef} className={titleInView ? "fadeInLeft" : ""}>
        <Text className="product-title" style={{ marginBottom: '20px', fontSize: '16px' }}>
          {title}
        </Text>
      </div>
      <div ref={subtitleRef} className={subtitleInView ? "fadeInLeft" : ""}>
        <Text className="product-subtitle" style={{ marginBottom: '20px', fontSize: '13.5px',textTransform:"capitalize" }}>
          {subtitle}
        </Text>
      </div>
      <div ref={descriptionRef} className={descriptionInView ? "fadeInLeft" : ""}>
  <Text className="product-description" style={descriptionStyle}>
    {description}
  </Text>
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
const secondRailRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToCenter, setHasScrolledToCenter] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Add event listener
  window.addEventListener("resize", handleResize);

  // Remove event listener on cleanup
  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  const handleScroll = () => {
    if (!hasScrolledToCenter && window.scrollY > 0 && secondRailRef.current) {
      const rect = secondRailRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) { // Check if the component is in the viewport
        const railHeight = rect.height;
        const verticalOffset = window.innerHeight * 0.1; // 5% of the viewport height
        const yOffset = window.pageYOffset + rect.top + (railHeight / 2) - (window.innerHeight / 2) - verticalOffset;
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

// Inside SecondProductRail component

// Determine if the screen width is less than 540px to adjust styles accordingly
const isMobileView = windowWidth < 540;

// Now, use this condition to decide which component to render
const productList = products && Array.isArray(products) ? products.map((product, index) => (
  isMobileView ? 
    <MobileProductItem 
      key={product.id} // It's better to use product.id as key if available
      thumbnail={product.thumbnail} 
      title={product.title} 
      subtitle={product.subtitle} 
      description={product.description} 
      collection_name={product.collection_name} 
      style={getStyle(index)} 
    />
    : 
    <ProductItem 
      key={product.id} 
      thumbnail={product.thumbnail} 
      title={product.title} 
      subtitle={product.subtitle} 
      description={product.description} 
      collection_name={product.collection_name} 
      style={getStyle(index)} 
    />
)) : null;

  // Render the SecondProductRail component
  return (
    <div className="second-product-rail" style={{ position: "relative"}}>
      <div className="second-product-collection" style={{ width: "85%" }}>
        {productList}
      </div>
    </div>
  );
};

export default SecondProductRail;