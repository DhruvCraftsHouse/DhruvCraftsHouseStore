import React, { useState, useRef, useEffect } from "react";
import { Container } from "@medusajs/ui";
import Image from "next/image";
import ImagePreview from '../image-preview'; // Assuming ImagePreview is in the parent folder
import '../image-gallery/ImageGallery.css'; // Assuming the CSS file is shared
import { Image as MedusaImage } from "@medusajs/medusa"; // Import MedusaImage type

type ImageVariantProps = {
  images: MedusaImage[];
  video?: string; // Optional video URL
};

const ImageVariant: React.FC<ImageVariantProps> = ({ images, video }) => {
  const [selectedImage, setSelectedImage] = useState<MedusaImage | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element

  useEffect(() => {
    // Start playing the video when the component mounts
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []); // Empty dependency array ensures this effect runs only once, when the component mounts

  // Define the number of displayed images based on the presence of the video prop
  const displayedImages = video ? images.slice(0, 3) : images.slice(0, 4);
  const remainingImagesCount = images.length - displayedImages.length;

  const handlePreviewClick = (image: MedusaImage) => {
    setSelectedImage(image);
  };

  // Helper function to convert local URL to production URL
  const convertImageUrl = (localUrl: string): string => {
    const baseUrl = 'https://dhruvcraftshouse.com/backend/uploads/';
    const filename = localUrl.split('/').pop() || ''; // Extracts the filename from the URL, ensure it's not undefined
    return `${baseUrl}${filename}`;
  };

  return (
    <div className="flex items-start relative" style={{ }}>
      <div className="flex flex-col flex-1 small:mx-5 gap-y-4 w-full" style={{ maxWidth: "90%" }}>
        <div className="flex gap-x-4">
          {displayedImages.slice(0, 2).map((image, index) => (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              <Image
                src={convertImageUrl(image.url)}
                priority={index === 0}
                className="absolute inset-0"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                style={{ objectFit: "cover", borderRadius: "0%" }}
                onClick={() => handlePreviewClick(image)}
              />
            </Container>
          ))}
        </div>

        {/* Render images 3 and 4 in the same row if displayedImages length is 4 */}
        {displayedImages.length === 4 && (
          <div className="flex gap-x-4">
            {displayedImages.slice(2).map((image, index) => (
              <Container
                key={image.id}
                className="relative aspect-[29/34] w-1/2 overflow-hidden bg-ui-bg-subtle"
                id={image.id}
              >
                <Image
                  src={convertImageUrl(image.url)}
                  priority={index === 0}
                  className="absolute inset-0"
                  alt={`Product image ${index + 3}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{ objectFit: "cover", borderRadius: "0%" }}
                  onClick={() => handlePreviewClick(image)}
                />
              </Container>
            ))}
          </div>
        )}

        {video && displayedImages.map((image, index) => {
          if (index >= 2) {
            // Place the third image and video in the second row if displayedImages length is 3 and video is provided
            if (displayedImages.length === 3 && video) {
              return (
                <div key={image.id} className="flex gap-x-4">
                  <Container
                    className="relative aspect-[29/34] w-1/2 overflow-hidden bg-ui-bg-subtle"
                    id={image.id}
                  >
                    <Image
                      src={convertImageUrl(image.url)}
                      priority={index <= 2}
                      className="absolute inset-0"
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                      style={{ objectFit: "cover", borderRadius: "0%" }}
                      onClick={() => handlePreviewClick(image)}
                    />
                  </Container>
                  <Container
                    className="relative aspect-[29/34] w-1/2 overflow-hidden bg-ui-bg-subtle"
                    style={{ minWidth: "50%", minHeight: "50%" }}
                  >
                    <video
                      ref={videoRef}
                      src={video || "default-video-url.mp4"} // Use the video prop if available
                      controls
                      className="absolute inset-0 w-full h-full object-cover" // Ensure the video covers the container
                      loop
                      autoPlay
                      style={{ objectFit: "cover" }} // This ensures the video covers the area of the container
                    />
                  </Container>
                </div>
              );
            }
            // Place the third and fourth images in the same row if displayedImages length is 4
            else {
              return (
                <Container
                  key={image.id}
                  className="relative aspect-[29/34] w-1/2 overflow-hidden bg-ui-bg-subtle"
                  id={image.id}
                >
                  <Image
                    src={convertImageUrl(image.url)}
                    priority={index <= 2}
                    className="absolute inset-0"
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                    style={{ objectFit: "cover", borderRadius: "0%" }}
                    onClick={() => handlePreviewClick(image)}
                  />
                </Container>
              );
            }
          }
          return null;
        })}

        {remainingImagesCount > 0 && (
          <div className="text-right">
            {`+ ${remainingImagesCount} more ${remainingImagesCount === 1 ? 'image' : 'images'}`}
          </div>
        )}
      </div>

      {selectedImage && (
        <ImagePreview
          images={images}
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ImageVariant;
