import React, { useState, useEffect, useRef } from "react";
import "./CollectionList.css";

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

const CollectionList: React.FC<SecondCollectionProps> = ({ products }) => {
  return (
    <div className="hide-scrollbar mb-5" style={{ fontFamily: 'Avenir Next LT W02 Regular', display: 'flex', overflowX: 'auto', paddingLeft: '160px' }}>
      {products.map((product, index) => {
        // Determine delay based on product index
        let delay = 0; // Default no delay
        if (index === 1) delay = 1000; // 6 seconds delay for product[1]
        else if (index === 2) delay = 2000; // 12 seconds delay for product[2]
        else if (index === 3) delay = 1000;

        // Pass delayVisibility prop to ProductItem
        return <ProductItem key={product.id} {...product} delayVisibility={delay} />;
      })}
    </div>
  );
};

type ProductItemProps = Product & {
  delayVisibility: number; // Define delayVisibility as a required prop
};

const ProductItem: React.FC<ProductItemProps> = ({ thumbnail, title, subtitle, delayVisibility }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showText, setShowText] = useState(false); // New state for text visibility
  const imgRef = useRef<HTMLDivElement>(null);

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
                setShowText(true);
              }, 200); // 2 seconds delay for text
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

  return (
    <div ref={imgRef} style={{ display: 'flex', flexBasis: 'calc(45% - 5px)', alignItems: 'center', marginRight: '2px', flexShrink: 0, opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
      <div className={imageClass} style={{ width: '200px', height: 'auto', marginRight: '5px', background: "#e3e4e6" }}>
        <img src={thumbnail} alt={title} style={{ width: '100%', height: 'auto' }} />
      </div>
      {showText && ( // Only render the text when showText is true
        <div style={{ marginTop:"-25%"}}>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "-8%", width: "40%", borderTop:"1px solid #B1BDC2" }}></div>
            <div>
              <h3 style={{ fontSize: "20px", whiteSpace: 'normal', width: "", marginTop:"-15%",textAlign:"left" }}>{title}</h3>
              {subtitle &&
                      subtitle!=="No subtitle" &&
                      <p style={{ whiteSpace: 'normal', width: "80%", textAlign: "left" }}>{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default CollectionList;
