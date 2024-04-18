import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Define animations using styled-components
const fadeInScale = keyframes`
0% { opacity: 0; }
100% { opacity: 1; }
`;

const slideUpFromBottom = keyframes`
  0% {
    transform: translateY(10%);
    opacity: 0;
 }
  100% {
    transform: translateY(0);
    opacity: 1;
 }
`;
const revealFromTop = keyframes`
  0% {
    clip-path: inset(0 0 100% 0);
 }
  100% {
    clip-path: inset(0 0 0 0);
 }
`;
// Define an interface for props
interface TitleProps {
    isVisible: boolean;
  }

// Styled components definitions (same as before)
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  height: auto; // Set height to auto to contain both columns
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const EndAlignedColumn = styled(Column)`
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;
  width: 60vw; // This will take 60% of the viewport width

//   background: red;
`;

const StartAlignedColumn = styled(Column)`
  justify-content: flex-start;
  position: relative;
//   background: green;
width: 40vw; // This will take the remaining 40% of the viewport width

`;

interface InfoContainerProps {
    animate: boolean;
  }
  
  // Styled component with conditional animation
  const InfoContainer = styled.div<InfoContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    animation: ${({ animate }) => animate ? css`${revealFromTop} 600ms ease-out forwards` : 'none'};
  `;
  

const ProductImage = styled.img`
  width: 210px;
  position: relative;
  z-index: 1;
  animation: ${fadeInScale} 500ms ease-out forwards, ${slideUpFromBottom} 500ms ease-out forwards;
  @media (max-width: 760px) {
    width: 150px;

  }
  `;

  const Title = styled.h2<TitleProps>`
  font-size: 32px;
  font-family: Avenir Next LT W02 Regular;
  line-height: 1em;
  text-align: left;
  font-style: italic;
  font-weight: 500;
  max-width: 150px;
  word-wrap: break-word;
  color: ${({ isVisible }) => (isVisible ? "black" : "transparent")};
  animation: ${({ isVisible }) => isVisible ? css`${fadeInScale} 100ms ease-out forwards` : "none"};
`;


const Subtitle = styled.h3`
  font-size: 36px;
  font-family: Avenir Next LT W02 Regular;
  max-width: 300px; // Adjust the width as needed for your design
  word-wrap: break-word; // Ensures text breaks into new lines if too long
  line-height: 1.1; // Adjust line-height for better readability
//   animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation
// animation: ${revealFromTop} 5s ease-out forwards;

`;

const Description = styled.h3`
  font-size: 16px;
  margin-top: 35px;
  font-family: Avenir Next LT W02 Regular;
  max-width: 300px; // Adjust the width as needed for your design
  font-weight: 500;
  color: rgba(0,0,0,0.9);
  word-wrap: break-word; // Ensures text breaks into new lines if too long
  line-height: 1.4; // Adjust line-height for better readability
//   animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation
// animation: ${revealFromTop} 1s ease-out forwards;

`;

const Collection = styled.h3`
 font-size: 16px;
 margin-top: 36px;
 font-family: Avenir Next LT W02 Regular;
 max-width: 300px; // Adjust the width as needed for your design
 word-wrap: break-word; // Ensures text breaks into new lines if too long
 line-height: 1.4; // Adjust line-height for better readability
 position: relative; // Required for absolute positioning of the underline
 margin-bottom: 10px; // Adjust this value to increase the space between the text and the underline
//  animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation
// animation: ${revealFromTop} 1s ease-out forwards;


 &::after {
    content: '';
    display: block;
    width: 150%; // Ensures the underline spans the full width of the text
    height: 1px; // Thickness of the underline
    background: #000; // Color of the underline
    position: absolute;
    right: -25%;
    bottom: -5px; // Adjust this value to fine-tune the vertical position of the underline
    transform: translateY(50%); // Centers the underline vertically relative to the text
    // animation: ${fadeInScale} 100ms ease-out forwards; // Apply the fadeInScale animation
    // animation: ${revealFromTop} 1s ease-out forwards;

 }
`;

// Responsive styles for Container
const ResponsiveContainer = styled(Container)`
  @media (max-width: 760px) {
    flex-direction: column;
    align-items: center;
    height: 90vh;
    padding-top: 12%;
    padding-bottom: 12%;

  }
`;

// Responsive styles for EndAlignedColumn and StartAlignedColumn
const ResponsiveColumn = styled(Column)`
  @media (max-width: 760px) {
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

// Responsive styles for Title and other elements that need to be centered
const CenteredTitle = styled(Title)`
  @media (max-width: 760px) {
    text-align: center;
  }
`;

const CenteredSubtitle = styled(Subtitle)`
  @media (max-width: 760px) {
    text-align: center;
    font-size: 28px;
  }
`;

const CenteredDescription = styled(Description)`
  @media (max-width: 760px) {
    text-align: center;
  }
`;

const CenteredCollection = styled(Collection)`
  @media (max-width: 760px) {
    text-align: center;
    &::after {
      width: 100%;
      right: 0;
    }
  }
`;

type Product = {
    id: string;
    title: string;
    subtitle: string;
    thumbnail: string;
    description: string;
    collection_name: string;
};

type FirstCollectionProps = {
  products: Product[];
};

const SecondProductRail: React.FC<FirstCollectionProps> = ({ products }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [isCollectionVisible, setIsCollectionVisible] = useState(false);
    const [containerHeight, setContainerHeight] = useState('95vh'); // Default height
    const [isNarrowScreen, setIsNarrowScreen] = useState(false); // Initialize to false

    const [isNarrowVisible, setIsNarrowVisible] = useState(false);
    const [isNarrowDescriptionVisible, setIsNarrowDescriptionVisible] = useState(false);
    const [isNarrowTitleVisible, setIsNarrowTitleVisible] = useState(false);
    const [isNarrowSubtitleVisible, setIsNarrowSubtitleVisible] = useState(false);
    const [isNarrowImageVisible, setIsNarrowImageVisible] = useState(false);
    const [isNarrowCollectionVisible, setIsNarrowCollectionVisible] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(false); // State to control InfoContainer animation

 // Assuming you have an element ref for observing
 const infoRef = useRef(null);

 useEffect(() => {
   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         setIsInfoVisible(true); // Trigger animation when element is in view
       }
     });
   }, {
     threshold: 0.5 // Adjust as needed
   });

   if (infoRef.current) {
     observer.observe(infoRef.current);
   }

   return () => {
     if (infoRef.current) {
       observer.unobserve(infoRef.current);
     }
   };
 }, [infoRef]);
 
    useEffect(() => {
      // Function to check screen width and set state
      const checkScreenWidth = () => {
        if (typeof window !== 'undefined') { // Ensure window is defined
          setIsNarrowScreen(window.innerWidth <= 760);
        }
      };
  
      // Add event listener on component mount
      window.addEventListener('resize', checkScreenWidth);
      checkScreenWidth(); // Also call on mount to set initial state

      // Remove event listener on cleanup
      return () => {
        window.removeEventListener('resize', checkScreenWidth);
      };
    }, []);
    
    const h1Ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setTimeout(() => setIsSubtitleVisible(true), 0); // Set immediately
          setTimeout(() => {
            setIsDescriptionVisible(true);
          }, 200); // Set after 1800ms
          setTimeout(() => setIsCollectionVisible(true), 500); // Set after 2800ms
          setTimeout(() => setIsImageVisible(true), 400); // Set after 3420ms
          setTimeout(() => setIsTitleVisible(true), 900); // Set after 4420ms
          console.log('isImageVisible', isImageVisible)

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

    const h2Ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        setIsNarrowVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setTimeout(() => setIsNarrowTitleVisible(true), 0); // Set immediately
          setTimeout(() => {
            setIsNarrowDescriptionVisible(true);
          }, 200); // Set after 1800ms
          setTimeout(() => setIsNarrowCollectionVisible(true), 500); // Set after 2800ms
          setTimeout(() => setIsNarrowImageVisible(true), 800); // Set after 3420ms
          setTimeout(() => setIsNarrowSubtitleVisible(true), 1200); // Set after 4420ms
          console.log('isNarrowImageVisible', isNarrowImageVisible)
        }
      }, { threshold: 0 });
  
      if (h2Ref.current) {
        observer.observe(h2Ref.current);
      }
  
      return () => {
        if (h2Ref.current) {
          observer.unobserve(h2Ref.current);
        }
      };
    }, [h2Ref]);
  
    useEffect(() => {
        // Function to update container height based on screen height   
      const updateContainerHeight = () => {
        const height = window.innerHeight;
        if (height <= 600) {
          setContainerHeight('98vh');
        } else if (height <= 700) {
          setContainerHeight('85vh');
        } else if (height <= 800) {
          setContainerHeight('75vh');
        } else if (height <= 900) {
          setContainerHeight('65vh');
        } else if (height <= 1000) {
          setContainerHeight('55vh');
        } else if (height <= 1100) {
          setContainerHeight('50vh');
        } else if (height <= 1200) {
          setContainerHeight('50vh');
        } else if (height <= 1300) {
          setContainerHeight('45vh');
        }else {
          setContainerHeight('40vh');
        }
      };
      // Update container height on component mount and window resize
        updateContainerHeight();
        window.addEventListener('resize', updateContainerHeight);
        return () => window.removeEventListener('resize', updateContainerHeight);
      }, []);
  
    const firstProduct = products[0];
  
console.log('isNarrowScreen', isNarrowScreen)
// console.log('isVisible', isVisible)

    if (isNarrowScreen) {
        return (
        <ResponsiveContainer >
        <ResponsiveColumn>
          <div ref={h1Ref} style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
              <CenteredTitle isVisible={isTitleVisible}>{firstProduct.title}</CenteredTitle>
             {/* {isImageVisible && (  */}
              <ProductImage src={firstProduct.thumbnail} alt={firstProduct.title} />
             {/* )}  */}
             {/* {isCollectionVisible && (  */}
              <CenteredCollection>{firstProduct.collection_name}</CenteredCollection>
             {/* )}  */}
          </div>
        </ResponsiveColumn>
        <ResponsiveColumn>
        <InfoContainer ref={infoRef} animate={isInfoVisible}>
          {/* {isInfoVisible && ( */}
            <>             {/* {isSubtitleVisible && (  */}
              <CenteredSubtitle>{firstProduct.subtitle}</CenteredSubtitle>
             {/* )}  */}
             {/* {isDescriptionVisible && (  */}
              <CenteredDescription>{firstProduct.description}</CenteredDescription>
              </>
             {/* )}  */}
          </InfoContainer>
        </ResponsiveColumn>
      </ResponsiveContainer>
    )
} else {
    return (
        <Container style={{ paddingTop: "5%", height: containerHeight, paddingBottom: "8%",  }}>
        <EndAlignedColumn>
<div ref={h1Ref} style={{display: "flex", height: "auto"}}>
          <div style={{display: "flex", justifyContent: "flex-end"}}>
            {/* Image container */}
            {isImageVisible && (
            <ProductImage src={firstProduct.thumbnail} alt={firstProduct.title} style={{ animationDelay: '' }} />
          )} 
                    </div>
          <div style={{display: "inline-flex", justifyContent: "flex-start"}}>
            {/* Title container */}
            <Title isVisible={isTitleVisible}>{firstProduct.title}</Title>
          </div>
        </div>
        </EndAlignedColumn>
        <StartAlignedColumn>
        <InfoContainer ref={infoRef} animate={isInfoVisible}>
          {isInfoVisible && (
            <>
              <Subtitle>{firstProduct.subtitle}</Subtitle>
              <Description>{firstProduct.description}</Description>
              <Collection className='ml-7'>{firstProduct.collection_name}</Collection>
            </>
          )}
        </InfoContainer>
</StartAlignedColumn>
      </Container>
    )
}
  };
  
  export default SecondProductRail;