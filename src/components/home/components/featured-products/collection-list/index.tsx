import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from 'styled-components';

import "./CollectionList.css";

const StyledButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 5px;
  display: inline-block;
  position: relative;
  text-decoration: none;

  &:after {
    content: '';
    display: block;
    width: 105%;
    height: 1.5px;
    left: 1px;
    background: currentColor;
    position: absolute;
    bottom: -5px; /* Adjust this value to increase gap between text and underline */
    transition: background-color 0.3s;
  }

  &:hover:after {
    background-color: #000; /* Change or remove this if you don't need hover effect */
  }
`;

// Assuming Product type definition remains the same
type Product = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
};

type SecondCollectionProps = {
  products: Product[]; // Assuming Product is the type of individual products
};
const breakpoints = {
  sm: 640, // TailwindCSS's small breakpoint
  md: 768  // TailwindCSS's medium breakpoint
};
const fadeInScale = keyframes`
0% { opacity: 0; }
100% { opacity: 1; }
`;


const CollectionList: React.FC<SecondCollectionProps> = ({ products }) => {
  const collectionRailRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // const checkScrollPosition = () => {
  //   if (collectionRailRef.current) {
  //     const { scrollLeft, scrollWidth, clientWidth } = collectionRailRef.current;
  //     setIsAtStart(scrollLeft === 0);
  //     setIsAtEnd(scrollLeft + clientWidth === scrollWidth);
  //   }
  // };

  // useEffect(() => {
  //   const currentRef = collectionRailRef.current;
  //   currentRef?.addEventListener('scroll', checkScrollPosition);

  //   return () => {
  //     currentRef?.removeEventListener('scroll', checkScrollPosition);
  //   };
  // }, []);
  

  const handleScrollToLast = () => {
    if (collectionRailRef.current) {
      collectionRailRef.current.scrollLeft = collectionRailRef.current.scrollWidth;
    }
    setIsAtEnd(true);
  };

  const handleScrollToStart = () => {
    if (collectionRailRef.current) {
      collectionRailRef.current.scrollLeft = 0;
    }
    setIsAtEnd(false);

  };
  function calculateDelay(index: number): number {
    switch (index) {
      case 1: return 1000;
      case 2: return 2000;
      case 3: return 1000;
      default: return 0;
    }
  }
  return (
    <>
 <div
      ref={collectionRailRef}
      className="collection-main mb-1 custom-cursor"
      style={{
        fontFamily: 'Avenir Next LT W02 Regular',
        display: 'flex',
        cursor:"-webkit-grab",
        overflowX: 'auto',
        paddingTop: "25%",
        // cursor: `url('/palm.png'), pointer` // Replace with the correct path to your cursor image
      }}
    >
             {products.map((product, index) => (
   <ProductItem
   key={product.id}
   {...product}
   delayVisibility={calculateDelay(index)}
 />        ))}
      </div>
      <div style={{ textAlign: 'center', paddingBottom: "5%" }}>
  {!isAtEnd ? (
    <StyledButton onClick={handleScrollToLast}>Go to Last</StyledButton>
  ) : (
    <StyledButton onClick={handleScrollToStart}>Go to Previous</StyledButton>
  )}
</div>

    </>
  );
};


type ProductItemProps = Product & {
  delayVisibility: number; // Define delayVisibility as a required prop
};
interface AnimatedProps {
  isVisible: boolean;
 }
 

 const ProductItem = React.forwardRef<HTMLDivElement, ProductItemProps>((props, ref) => {
  const { thumbnail, title, subtitle, delayVisibility } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
   
  const imgRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(0); // Initialize with 0

  useEffect(() => {
    // Update the state with the actual window width after component mounts
    setWindowWidth(window.innerWidth);

    // Update the windowWidth state whenever the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply delay based on delayVisibility prop for image
            setTimeout(() => {
              setIsVisible(true);
              // Set another timeout for the text to show it after 2 seconds of the image being visible
              setTimeout(() => {
                setIsTitleVisible(true);
              }, 600); // 2 seconds delay for text
              setTimeout(() => {
                setIsSubtitleVisible(true);
              }, 1200); // 2 seconds delay for text
            }, delayVisibility);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [delayVisibility]);

  const imageClass = isVisible ? 'image-reveal-animation' : 'hidden';

    // Determine the height based on the window width
    let imageHeight = '250px'; // Default height
    let marginUp = '-30%';
    if (windowWidth <= breakpoints.md) {
      imageHeight = '200px'; // Medium screens
      marginUp='-20%';
    }
    if (windowWidth <= breakpoints.sm) {
      imageHeight = '200px'; // Small screens
      marginUp = '-10%';
    }
 
    const [itemStyle, setItemStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
      function determineStyles() {
        // Define default styles for large screens
        let styles: React.CSSProperties = {
          display: 'flex',
          flexBasis: '480px',
          alignItems: 'center',
          marginRight: '2px',
          flexShrink: 0,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s',
          marginTop: '-25%',
          // background:"red"
        };
  
        // Adjust styles for medium screens
        if (windowWidth <= breakpoints.md) {
          styles = {
            ...styles,
            flexBasis: '430px',
            marginTop: '-20%',
          };
        }
  
        // Adjust styles for small screens
        if (windowWidth <= breakpoints.sm) {
          styles = {
            ...styles,
            flexBasis: '400px',
            marginTop: '0%',
          };
        }
  
        return styles;
      }
  
      // Set the initial styles
      setItemStyle(determineStyles());
  
      function handleResize() {
        // Update styles on resize
        setWindowWidth(window.innerWidth);
        setItemStyle(determineStyles());
      }
  
      // Add event listener for window resize
      window.addEventListener('resize', handleResize);
  
      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, [isVisible, windowWidth]); // Depend on isVisible and windowWidth
  
    const AnimatedTitle = styled.h3<AnimatedProps>`
    top
 animation: ${fadeInScale} 2s ease-out forwards;
 opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
 transform: ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(0.9)')};
`;

const AnimatedSubtitle = styled.p<AnimatedProps>`
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 4;
overflow: hidden;
text-overflow: ellipsis;
 animation: ${fadeInScale} 2s ease-out forwards;
 opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
 transform: ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(0.9)')};
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; // Establishes a positioning context
  width: 100%;
  margin-right: 5px; // Adjust spacing as needed
`;

const TitleContainer = styled.div`
  position: absolute;
  top: 100px; // Adjust this value so that all titles start from the same position
  left: 0;
  width: 100%;
`;

const SubtitleContainer = styled.div`
  position: absolute;
  top: 130px; // Adjust this value to follow the title consistently
  left: 0;
  width: 100%;
`;
   return (
    <div className="collection-list-main" ref={imgRef} style={itemStyle}>
      <div className={`image-container ${isVisible ? '' : 'hidden'}`} style={{ height: imageHeight, width: 'auto', marginRight: '5px', background: "#e3e4e6", position:"relative" }}>
        <img src={thumbnail} alt={title} style={{ height: imageHeight, width: '100%' }} />
      </div>
      <div style={{ marginTop:"-35%",marginLeft: "-8%", width: "15%", borderTop:"1px solid #B1BDC2", zIndex: 1 }}></div>

      <div className="ml-2" style={{ display: "flex"}}>
  <div style={{ width: "160px",height:"200px" }}> {/* Set a constant width here */}
    {isTitleVisible && (
      <AnimatedTitle isVisible={isTitleVisible} style={{ fontSize: "20px", whiteSpace: 'normal',  textAlign:"left",width:"160px" }}>{title}</AnimatedTitle>
    )}

    {isSubtitleVisible && subtitle && subtitle !== "No subtitle" &&
      <AnimatedSubtitle isVisible={isSubtitleVisible} style={{ whiteSpace: 'normal', textAlign: "left" }}>{subtitle}</AnimatedSubtitle>
    }
  </div>
</div>

    </div>
  );
});

ProductItem.displayName = 'ProductItem';

export default CollectionList;
