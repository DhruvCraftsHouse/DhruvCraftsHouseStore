import { Image as MedusaImage } from "@medusajs/medusa";
import React,{ useState, useRef, useEffect } from "react";
import customCursor from '../../../../../public/xcursor.png'; // Update with the correct path to your image


type ImagePreviewProps = {
  images: MedusaImage[]; // Array of all images
  selectedImage: MedusaImage; // Currently selected image for full view
  onClose: () => void;
};

const ImagePreview = ({ images, selectedImage, onClose }: ImagePreviewProps) => {

  // console.log('images imagePreview', images)
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  // console.log('images preview', images)
  // console.log('selectedImage preview', selectedImage)

  useEffect(() => {
    if (images && images.length > 0) {
      setIsLoading(false); // Update the loading state when images are ready
    }
  }, [images]);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-black" role="status">
        <span className="visually-hidden">Loading images...</span>
      </div>
      <span className="ml-2">Loading images</span>
    </div>
  );
  // State for the currently selected image in the preview
  const [activeImage, setActiveImage] = useState<MedusaImage>(selectedImage);

   // Find the index of the currently selected image
   const activeIndex = images.findIndex(image => image.id === activeImage.id);

  //  console.log('activeImage', activeImage)
  //  console.log('activeIndex', activeIndex)

   const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => { // Correctly type the event as a WheelEvent
    if (e.deltaY < 0 && activeIndex > 0) {
      // Scrolling up, show previous image
      setActiveImage(images[activeIndex - 1]);
    } else if (e.deltaY > 0 && activeIndex < images.length - 1) {
      // Scrolling down, show next image
      setActiveImage(images[activeIndex + 1]);
    }
  };

// Use HTMLDivElement for ref instead of HTMLElement
const imageRefs = images.reduce<Record<number, React.RefObject<HTMLDivElement>>>((acc, _, i) => {
  acc[i] = React.createRef<HTMLDivElement>(); // Specify the element type for the ref here
  return acc;
}, {});

// console.log('imageRefs', imageRefs)
// Also ensure that the activeImageRef is of the correct type
const activeImageRef = useRef<HTMLDivElement>(null); // Use HTMLDivElement here

// Effect to scroll the selected image into view when the component mounts or when selectedImage changes
useEffect(() => {
  const index = images.findIndex(image => image.id === selectedImage.id);
  // Correctly accessing the ref for the selected image
  const selectedRef = imageRefs[index];
  if (selectedRef && selectedRef.current) {
    selectedRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}, [selectedImage, images]);

// This CSS class will use the base64 image as the cursor
const customCursorCSS = `
  .custom-cursor {
    cursor: url(${customCursor}), auto;
  }
`;

const convertImageUrl = (localUrl: string): string => {
  const baseUrl = 'https://dhruvcraftshouse.com/backend/uploads/';
  const filename = localUrl.split('/').pop() || ''; // Ensures the filename is not undefined
  return `${baseUrl}${filename}`;
};

  return (
    <div className="fixed inset-0 z-50 flex bg-white bg-opacity-100" onWheel={handleScroll} >
      {/* Thumbnail sidebar */}



      <div className="thumbnail-sidebar w-1/5 h-full overflow-auto bg-white flex flex-col items-end ">

      {images.map((image, index) => (
  <img
    key={image.id}
              src={convertImageUrl(image.url)} // Apply URL conversion here
    alt={`Thumbnail ${index + 1}`}
    className={`cursor-pointer ${
      activeImage.id === image.id ? 'border-2 border-black' : ''
    }`}
    style={{ width: "70%", height: 'auto', marginBottom: '10%' }}
    onClick={() => {
      setActiveImage(image);
      // Scroll the corresponding image in the main preview to the top
      const ref = imageRefs[index];
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'  // Align the top of the image with the top of the scroll container
        });
      }
    }}
    
  />
))}


      </div>
   
   {/* Full screen image preview */}
<div className="flex-1 h-full overflow-auto flex flex-col">
{images.map((image, index) => (
 <div 
  key={image.id} 
  ref={imageRefs[index]} 
  className="w-full flex items-center justify-center" 
  style={{ margin: '20px', width: "96%" }}
 >
  <img
              src={convertImageUrl(image.url)} // Apply URL conversion here
    alt={`Full screen preview ${index + 1}`}
    style={{ 
      width: '95%', 
      height: 'auto', 
      objectFit: 'contain',
      maxWidth: 'none', 
      maxHeight: 'none'
    }}
  />
 </div>
))}

</div>

      <button
        onClick={onClose}
        style={{padding:"0px 9px 4px 9px"}}
        className="absolute top-4 right-8 text-black text-2xl bg-white bg-opacity-100 rounded-full"
      >
        &times; {/* Unicode 'X' for close button */}
      </button>
      <style>
        {`
        .thumbnail-sidebar {
          width: 15%; /* Adjust width as needed */
          height: 100%;
          overflow-y: scroll; /* Enables scrolling */
          padding: 1rem;
          box-sizing: border-box;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .thumbnail-sidebar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .thumbnail-sidebar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        `}
      </style>
    </div>
   );
   
};

export default ImagePreview;