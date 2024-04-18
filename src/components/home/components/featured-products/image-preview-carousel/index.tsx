import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import '../ThirdProductRail/ThirdProductRail.css';

type Image = {
  id: string;
  url: string;
};

type ImageCarouselProps = {
  images: Image[];
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log('images', images)
  // useInView hook to monitor the visibility of the carousel
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger the animation only once
    threshold: 0.1, // Trigger when 10% of the carousel is in view
  });

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container" ref={ref} >
        <div className="dot-container ml-3 mr-3" style={{background:"white"}}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active-dot' : ''}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",}}>
      {images.map((image, index) => (
        <img
          key={image.id}
          src={image.url}
          alt={`Image ${index}`}
          className={`carousel-image ${index === currentIndex ? 'active' : ''} ${inView ? 'imageReveal' : 'image-hidden'}`}
          style={{ width:"580px",height:"400px"}}
        />
      ))}
        </div> 
      
   
    </div>
  );
};

export default ImageCarousel;
