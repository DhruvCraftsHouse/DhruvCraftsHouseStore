import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

type BaseColumnProps = {
    flexSize?: string;
  };
  
  type ColumnProps = BaseColumnProps & {
    isVisible: boolean;
  };

const revealFromTop = keyframes`
  0% {
    clip-path: inset(0 0 100% 0);
 }
  100% {
    clip-path: inset(0 0 0 0);
 }
`;

const Container = styled.div`
  display: flex;
  width: 100%; // Ensure the container uses the full width of its parent
  height: 70vh; // Height adjusted to match the image height
  align-items: center; // This will vertically center the columns if their content is smaller than the container height
  // Media queries for different screen heights
  @media (min-height: 1100px) {
    height: 40vh;
  }
  @media (min-height: 1000px) and (max-height: 1099px) {
    height: 50vh;
  }
  @media (min-height: 900px) and (max-height: 999px) {
    height: 50vh;
  }
  @media (max-height: 899px) {
    height: 60vh;
  }
  @media (max-width: 768px) {
    height: 100%;
    //   background: red; // For visualization
      align-items: flex-start;

  }
`;


const Column = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: ${props => props.flexSize || 1};
  clip-path: ${props => props.isVisible ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'}; // Applying animation effect directly via clip-path
  transition: clip-path 1s ease-out; // Transition for the animation
  height: 100%;
`;


const ImageWrapper = styled.div`
  width: 100%;
  height: 100%; // Use the full height of the column
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    to bottom,
    rgba(28, 28, 28, 0.5) 0%,
    rgba(48, 48, 48, 0.5) 15%,
    rgba(60, 60, 60, 0.5) 25%,
    rgba(78, 78, 78, 0.5) 45%,
    rgba(83, 83, 83, 0.5) 50%,
    rgba(78, 78, 78, 0.5) 65%,
    rgba(60, 60, 60, 0.5) 75%,
    rgba(48, 48, 48, 0.5) 85%,
    rgba(28, 28, 28, 0.5) 100%
  );
`;


const StyledImage = styled.img`
  width: auto;       // Auto width to maintain aspect ratio
  max-width: 100%;   // Prevent the image from overflowing the column width
  height: 100%; // Set to fill the parent height, adjusting as the container changes
//   object-fit: contain; // Ensures the image is scaled to be as large as possible without cropping or stretching
animation: ${revealFromTop} 1s ease-out forwards;

`;


const NavColumn = styled(Column)`
//   background: red; // For visualization
  justify-content: flex-start;
  height: 100%;      // Set the image height

`;

const NavDot = styled.div<{ isActive: boolean }>`
  width: 4px;
  height: 4px;
  margin: 10px 5px;
  background-color: #ccc;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  transition: background-color 0.3s ease, transform 0.3s ease;

  ${props => props.isActive && `
    margin: 3px 5px 25px 5px;
    background-color: transparent;

    &::before {
      content: '';
      position: absolute;
      top: 50%; // Center vertically
      left: 50%; // Center horizontally
      transform: translate(-50%, -50%) scale(1.5); // Scale up the dot
      width: 2px; // Original size
      height: 2px; // Original size
      background-color: #000;
      border-radius: 50%;
      opacity: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      width: 10px;
      height: 10px;
      border: 1.5px solid #ccc;
      border-radius: 50%;
      background: transparent;
    }
  `}
`;


type Image = {
  id: string;
  url: string;
};

type ImageCarouselProps = {
  images: Image[];
};


  
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };
  const [isVisible, setIsVisible] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(false);

  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setIsDotVisible(true), 600); // Set after 2800ms
          observer.disconnect(); // Optional: disconnect observer after animation plays
        }
      },
      { threshold: 0 } // Trigger when 50% of the target is visible
    );

    if (columnRef.current) {
      observer.observe(columnRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Container >
      <NavColumn flexSize="0.06" isVisible={isDotVisible}>
        {images.map((_, index) => (
          <NavDot
            key={index}
            isActive={index === currentIndex}
            onClick={() => goToIndex(index)}
          />
        ))}
      </NavColumn>
      <Column flexSize="0.94" isVisible={isVisible} ref={columnRef}>
        <ImageWrapper>
          {images.length > 0 && (
            <StyledImage src={images[currentIndex].url} alt={`image-${currentIndex}`} />
          )}
        </ImageWrapper>
      </Column>
    </Container>
  );
};

export default ImageCarousel;
