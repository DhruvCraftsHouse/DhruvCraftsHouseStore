import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRouter } from "next/navigation"


// Define animations using styled-components
const fadeInScale = keyframes`
0% { opacity: 0; }
100% { opacity: 1; }
`;

const revealFromTop = keyframes`
  0% {
    clip-path: inset(0 0 100% 0);
 }
  100% {
    clip-path: inset(0 0 0 0);
 }
`;

// Styled components definitions (same as before)
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  // height: 95vh;
  flex-wrap: wrap; /* Allow items to wrap to the next row */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column; /* Changed to column for default */
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  // width: 100%; /* Full width for small screens */
  
  @media (max-width: 800px) {
    flex-direction: row; /* Change to column layout on small screens */
    align-items: stretch;
    width: auto; /* Reset width to auto */
  }
`;

const EndAlignedColumn = styled(Column)`
  justify-content: flex-end;
  position: relative;
  // width: 100%; /* Full width for small screens */

  @media (max-width: 800px) {
    order: 2; /* Make EndAlignedColumn come after StartAlignedColumn */
    margin-top: 30px; /* Add a vertical gap on small screens */
  }

  @media (max-width: 800px) {
    justify-content: flex-start; /* Align items at the end for small screens */
    width: 90%; /* Reset width to auto */
  }
`;

const TitleEndAligned = styled.h2`
  font-size: 24px;
  font-family: Avenir Next LT W02 Regular;
  position: absolute;
  bottom: 180px;
  line-height: 1em;
  max-width: 180px;
  word-wrap: break-word;
  z-index: 2;
  animation: ${fadeInScale} 100ms ease-out forwards;

  @media (max-width: 800px) {
    left: 45%; /* Adjust for screen width >= 800px */
    max-width: 80%;

  }
  @media (min-width: 801px) {
    // right: -40px; /* Adjust for screen width >= 800px */
    right: 70px; /* Default value */

  }
  @media (max-width: 912px) {
    right: 0px;
  }

  @media (min-width: 1000px) {
    right: 10px; /* Adjust for screen width >= 1000px */
  }

  @media (min-width: 1100px) {
    right: 70px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1200px) {
    right: 60px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1300px) {
    right: 80px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1400px) {
    right: 100px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1500px) {
    right: 120px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1600px) {
    right: 150px; /* Adjust for screen width >= 1100px */
  }
  @media (max-width: 720px) {
    bottom: 130px;
  }
  @media (max-width: 400px) {
    bottom: 130px;
  }

`;

const SubtitleEndAligned = styled.h3`
  font-size: 14px;
  font-family: Avenir Next LT W02 Regular;
  position: absolute;
  bottom: 120px;
  max-width: 120px;
  z-index: 2;
  word-wrap: break-word;
  line-height: 1.4;
  animation: ${fadeInScale} 100ms ease-out forwards;

  // Underline only the last line
  &::after {
    content: '';
    display: block;
    width: 140px;
    height: 1px; /* Underline thickness */
    background: #333; /* Underline color */
    position: absolute;
    left: -25px;
    bottom: -4px; /* Adjust the bottom position as needed */
    animation: ${fadeInScale} 100ms ease-out forwards; /* Apply the fadeInScale animation */
  }

  @media (max-width: 800px) {
    left: 50%; /* Adjust for screen width >= 800px */
    max-width: 80%;
  }
  @media (min-width: 801px) {
    // right: 130px; /* Default value */
    right: 20px; /* Adjust for screen width >= 800px */
  }

  @media (min-width: 1000px) {
    right: 70px; /* Adjust for screen width >= 1000px */
  }

  @media (min-width: 1100px) {
    right: 130px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1200px) {
    right: 110px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1300px) {
    right: 140px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1400px) {
    right: 160px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1500px) {
    right: 180px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1600px) {
    right: 210px; /* Adjust for screen width >= 1100px */
  }
  @media (max-width: 720px) {
    bottom: 85px;
  }
  @media (max-width: 414px) {
    bottom: 85px;
  }

`;

const StartAlignedColumn = styled(Column)`
  justify-content: flex-start;
  position: relative;
  width: 100%; /* Full width for small screens */

  @media (max-width: 800px) {
    justify-content: flex-start; /* Align items at the end for small screens */
    width: 90%; /* Reset width to auto */
  }
  @media (max-width: 800px) {
    order: 1; /* Make StartAlignedColumn come first */
  }
  @media (max-width: 800px) {
    margin-top: 30px; /* Add a vertical gap on small screens */
  }
`;

const ProductImage = styled.img<{ isFirstProduct: boolean }>`
  width: 250px; /* Default width for small screens */
  position: relative;
  z-index: 1;
  animation: ${revealFromTop} 1s ease-out forwards;
  
  @media (max-width: 768px) {
    width: 210px;
    height: auto;
  }
  @media (max-width: 600px) {
    width: 190px;
    height: auto;
  }
  @media (max-width: 500px) {
    width: 230px;
    height: auto;
  }
  @media (max-width: 400px) {
    width: 190px;
    height: auto;
  }
  @media (max-width: 300px) {
    width: 190px;
    height: auto;
  }

  @media (min-width: 769px) {
    width: ${({ isFirstProduct }) => isFirstProduct ? '350px' : '270px'};
  }

  @media (min-width: 1024px) {
    width: ${({ isFirstProduct }) => isFirstProduct ? '350px' : '270px'};
  }

  @media (min-width: 1280px) {
    width: ${({ isFirstProduct }) => isFirstProduct ? '380px' : '290px'};
  }
  @media (min-width: 1300px) {
    width: ${({ isFirstProduct }) => isFirstProduct ? '400px' : '310px'};
  }
  @media (min-width: 1400px) {
    width: ${({ isFirstProduct }) => isFirstProduct ? '420px' : '330px'};
  }
`;



const Title = styled.h2`
  font-size: 24px;
  font-family: Avenir Next LT W02 Regular;
  position: absolute;
  top: 40px;
  left: 100px;
  line-height: 1em;
  max-width: 180px; // Set a maximum width to enable text wrapping
  word-wrap: break-word; // Allows the title to wrap and form new lines if too long
  z-index: 2; // Higher than the image to ensure it's on top
  animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation

  @media (max-width: 800px) {
    left: 45%; /* Adjust for screen width >= 800px */
    max-width: 80%;

  }

  @media (min-width: 801px) {
    left: 0px; /* Adjust for screen width >= 800px */
  }

  @media (min-width: 1000px) {
    left: 0px; /* Adjust for screen width >= 1000px */
  }

  @media (min-width: 1100px) {
    left: 25px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1200px) {
    left: 45px; /* Adjust for screen width >= 1200px */
  }
  @media (min-width: 1300px) {
    left: 50px; /* Adjust for screen width >= 1300px */
  }
  @media (min-width: 1400px) {
    left: 65px; /* Adjust for screen width >= 1400px */
  }
  @media (min-width: 1500px) {
    left: 85px; /* Adjust for screen width >= 1500px */
  }
  @media (min-width: 1600px) {
    left: 105px; /* Adjust for screen width >= 1600px */
  }
`;

const Subtitle = styled.h3`
  font-size: 14px;
  font-family: Avenir Next LT W02 Regular;
  position: absolute;
  top: 120px; // Increase this value to increase the gap between the title and subtitle
  left: 130px;
  max-width: 120px; // Adjust the width as needed for your design
  z-index: 2; // Higher than the image to ensure it's on top
  word-wrap: break-word; // Ensures text breaks into new lines if too long
  line-height: 1.4; // Adjust line-height for better readability
  animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation

  // Underline only the last line
  &::after {
    content: '';
    display: block;
    width: 140px;
    height: 1px; // Underline thickness
    background: #333; // Underline color
    position: absolute;
    left: -25px;
    right: 0px;
    bottom: -4px; // Adjust the bottom position as needed
    animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation

  }
  @media (max-width: 800px) {
    left: 50%; /* Adjust for screen width >= 800px */
    max-width: 80%;
  }
  @media (min-width: 801px) {
    left: 30px; /* Adjust for screen width >= 800px */
  }

  @media (min-width: 1000px) {
    left: 30px; /* Adjust for screen width >= 1000px */
  }

  @media (min-width: 1100px) {
    left: 50px; /* Adjust for screen width >= 1100px */
  }
  @media (min-width: 1200px) {
    left: 70px; /* Adjust for screen width >= 1200px */
  }
  @media (min-width: 1300px) {
    left: 80px; /* Adjust for screen width >= 1300px */
  }
  @media (min-width: 1400px) {
    left: 95px; /* Adjust for screen width >= 1400px */
  }
  @media (min-width: 1500px) {
    left: 112px; /* Adjust for screen width >= 1500px */
  }
  @media (min-width: 1600px) {
    left: 132px; /* Adjust for screen width >= 1600px */
  }
`;


type Product = {
  id: string;
  title: string;
  subtitle: string;
  handle: string;
  thumbnail: string;
  collection_name: string;
};

type FirstCollectionProps = {
  products: Product[];
};

const FirstProductRail: React.FC<FirstCollectionProps> = ({ products }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFirstImageVisible, setIsFirstImageVisible] = useState(false);
    const [isFirstTitleVisible, setIsFirstTitleVisible] = useState(false);
    const [isFirstSubtitleVisible, setIsFirstSubtitleVisible] = useState(false);
    const [isSecondImageVisible, setIsSecondImageVisible] = useState(false);
    const [isSecondTitleVisible, setIsSecondTitleVisible] = useState(false);
    const [isSecondSubtitleVisible, setIsSecondSubtitleVisible] = useState(false);
    const [containerHeight, setContainerHeight] = useState('95vh'); // Default height

    // console.log('FirstProductRail products', products)

    
    const h1Ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setTimeout(() => setIsFirstImageVisible(true), 0); // Set immediately
          setTimeout(() => {
            setIsFirstTitleVisible(true);
            setIsSecondImageVisible(true);
          }, 600); // Set after 1800ms
          setTimeout(() => setIsFirstSubtitleVisible(true), 900); // Set after 2800ms
          setTimeout(() => setIsSecondTitleVisible(true), 1100); // Set after 3420ms
          setTimeout(() => setIsSecondSubtitleVisible(true), 1200); // Set after 4420ms
        }
      }, { threshold: 0.5 });
  
      if (h1Ref.current) {
        observer.observe(h1Ref.current);
      }
  
      return () => {
        if (h1Ref.current) {
          observer.unobserve(h1Ref.current);
        }
      };
    }, [h1Ref]);
  
  useEffect(()=>{
//  console.log('isImageVisible', isFirstImageVisible)
  },[isVisible])
  // UseEffect to safely handle window object
  useEffect(() => {
    const updateContainerHeight = () => {
      const height = window.innerHeight;
      if (height <= 600) {
        setContainerHeight('90vh');
      } else if (height <= 700) {
        setContainerHeight('80vh');
      } else if (height <= 800) {
        setContainerHeight('65vh');
      } else if (height <= 900) {
        setContainerHeight('65vh');
      } else if (height <= 1000) {
        setContainerHeight('60vh');
      } else if (height <= 1100) {
        setContainerHeight('55vh');
      } else if (height <= 1200) {
        setContainerHeight('55vh');
      } else if (height <= 1300) {
        setContainerHeight('40vh');
      }else {
        setContainerHeight('40vh');
      }
    };

    updateContainerHeight(); // Call immediately to set initial height
    window.addEventListener('resize', updateContainerHeight); // Update on window resize

    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);
    const firstProduct = products[0];
    const secondProduct = products[1] || products[0];

    const router = useRouter();

  // Define click handler to navigate to the product handle
  const handleClick = (handle: string) => {
    // Assuming the handle is stored in the alt attribute of the image
    // Navigate to the corresponding handle when clicked
    router.push(`/products/${handle}`);
  };
  
    return (
      <Container  style={{ paddingTop: "4%", height: containerHeight }}>
            <EndAlignedColumn >
          {isSecondImageVisible && (
            <ProductImage
  src={secondProduct.thumbnail}
  alt={secondProduct.title}
  isFirstProduct={false} // Pass the isFirstProduct prop with the appropriate value
  onClick={() => handleClick(secondProduct.handle)} // Adding click handler
  />
          )}
          {isSecondTitleVisible && <TitleEndAligned style={{ animationDelay: '' }} >{secondProduct.title}</TitleEndAligned>}
          {isSecondSubtitleVisible && secondProduct.collection_name && (
            <SubtitleEndAligned>{secondProduct.collection_name}</SubtitleEndAligned>
          )}  
        </EndAlignedColumn>
        <StartAlignedColumn ref={h1Ref} >
          {isFirstImageVisible && (
            <ProductImage
  src={firstProduct.thumbnail}
  alt={firstProduct.title}
  isFirstProduct={true} // Pass the isFirstProduct prop with the appropriate value
  style={{ animationDelay: '0s' }}
  onClick={() => handleClick(firstProduct.handle)} // Adding click handler

/>
          )}
          {isFirstTitleVisible && <Title style={{ animationDelay: '' }} >{firstProduct.title}</Title>}
          {isFirstSubtitleVisible && firstProduct.collection_name && firstProduct.collection_name!='' && (
            <Subtitle>{firstProduct.collection_name}</Subtitle>
          )}
        </StartAlignedColumn>
      </Container>
    );
  };
  
  export default FirstProductRail;