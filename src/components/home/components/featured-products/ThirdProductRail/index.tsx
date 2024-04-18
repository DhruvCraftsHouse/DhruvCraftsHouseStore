import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
// import ImageCarousel from '../image-preview-carousel';
import ImageCarousel from '../ImageCarousel';

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

  @media (max-width: 768px) {
    flex-direction: column; // Stack columns vertically when the width is 768px or less
    align-items: center;
    padding-top: 6%;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const EndAlignedColumn = styled(Column)`
  justify-content: flex-end;
  position: relative;
  width: 100%; // Default width to full width
  @media (max-width: 768px) { // Assuming 'md' is 768px
    width: 65vw; // 65% width on smaller screens
  }
  @media (max-width: 768px) {
    padding-top: 6%;
  }
`;

const StartAlignedColumn = styled(Column)`
  justify-content: center;
  align-items: center;
  position: relative;
  height: 60vh; // Default height when screen height is below 900px
  width: 100%; // Default width to full width

  @media (max-width: 768px) { // Assuming 'md' is 768px
    width: 35vw; // 35% width on smaller screens
  }
  @media (min-height: 1100px) {
    height: 40vh;
  }
  @media (min-height: 1000px) and (max-height: 1099px) {
    height: 50vh;
  }
  @media (min-height: 900px) and (max-height: 999px) {
    height: 50vh; // You can adjust this if needed, currently set to the same as 1000px to 1099px
  }
  @media (max-width: 768px) {
    height: 100%;
    //   background: red; // For visualization
    //   align-items: flex-start;
    width: 90%;

  }
`;




const Title = styled.h2`
  font-size: 24px;
  font-family: Avenir Next LT W02 Regular;
  line-height: 1em;
  text-align: center;
  font-style: italic;
  max-width: 230px; // Set a maximum width to enable text wrapping
  word-wrap: break-word; // Allows the title to wrap and form new lines if too long
  animation: ${fadeInScale} 2s ease-out forwards; // Apply the fadeInScale animation
`;


// Styled components for Subtitle with conditional animations
const Subtitle = styled.h3<{ visible: boolean }>`
  font-size: 18px;
  font-family: Avenir Next LT W02 Regular;
  margin-top: 25px;
  max-width: 300px;
  word-wrap: break-word;
  line-height: 1.4;
  position: relative;
  margin-bottom: 10px;
  color: ${props => props.visible ? '#000' : 'transparent'};
  animation: ${props => props.visible ? css`${fadeInScale} 500ms ease-out forwards` : 'none'};

  &::after {
    content: '';
    display: block;
    width: 150%;
    height: 1px;
    background: ${props => props.visible ? '#000' : 'transparent'};
    position: absolute;
    right: -25%;
    bottom: -5px;
    transform: translateY(50%);
    animation: ${props => props.visible ? css`${fadeInScale} 500ms ease-out forwards` : 'none'};
  }
`;

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
  products: Product[];
};

const ThirdProductRail: React.FC<FirstCollectionProps> = ({ products }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [isCollectionVisible, setIsCollectionVisible] = useState(false);
    const [containerHeight, setContainerHeight] = useState('95vh'); // Default height

    
    const h1Ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setTimeout(() => setIsImageVisible(true), 0); // Set immediately
          setTimeout(() => {
            setIsTitleVisible(true);
          }, 1000); // Set after 1800ms
          setTimeout(() => setIsCollectionVisible(true), 1300); // Set after 2800ms
         }
      }, { threshold: 1.0 });
  
      if (h1Ref.current) {
        observer.observe(h1Ref.current);
      }
  
      return () => {
        if (h1Ref.current) {
          observer.unobserve(h1Ref.current);
        }
      };
    }, [h1Ref]);
  
      useEffect(() => {
   // Function to update container height based on screen height
     const updateContainerHeight = () => {
      const height = window.innerHeight;
      if (height <= 600) {
        setContainerHeight('100vh');
      } else if (height <= 700) {
        setContainerHeight('80vh');
      }  else if (height <= 800) {
        setContainerHeight('70vh');
      }  else if (height <= 900) {
        setContainerHeight('65vh');
      } else if (height <= 1000) {
        setContainerHeight('60vh');
      } else if (height <= 1200) {
        setContainerHeight('70vh');
      } else {
        setContainerHeight('55vh'); // Default height
      }
    };
  
    // Update container height on component mount and window resize
      updateContainerHeight();
      window.addEventListener('resize', updateContainerHeight);
      return () => window.removeEventListener('resize', updateContainerHeight);
    }, []);

    const firstProduct = products[0];
  
    return (
        <Container style={{ paddingTop: "",paddingBottom: "7%"}}>
            {/* <h1>THIRD PAGE</h1> */}

        <StartAlignedColumn ref={h1Ref}>
          {isTitleVisible && (
            <Title style={{ animationDelay: '' }}>{firstProduct.title}</Title>
          )}
          {/* {isCollectionVisible && ( */}
          <Subtitle visible={isCollectionVisible}>
                {firstProduct.collection_name}
            </Subtitle>
            {/* )} */}
        </StartAlignedColumn>
        <EndAlignedColumn >
          {isImageVisible && firstProduct.images && firstProduct.images.length > 0 && (
            <ImageCarousel images={firstProduct.images} />
            // <ImageCarousel />
                    )}
        </EndAlignedColumn>

      </Container>
    );
  };
  
  export default ThirdProductRail;