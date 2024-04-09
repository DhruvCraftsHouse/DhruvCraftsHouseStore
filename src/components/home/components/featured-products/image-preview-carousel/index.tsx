import React, { useState } from 'react';
import '../third-product-rail/ThirdProductRail.css'; // Ensure your CSS is properly set up for styling

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

  return (
    <div className="carousel-container">
      <div className="dot-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active-dot' : ''}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
      {images.map((image, index) => (
        <img
          key={image.id}
          src={image.url}
          alt={`Image ${index}`}
          className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
          style={{ display: index === currentIndex ? 'block' : 'none' }}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
