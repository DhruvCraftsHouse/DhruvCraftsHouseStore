import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera';
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo';
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import axios from 'axios';
import { Label } from "@medusajs/ui"
import { MEDUSA_BACKEND_URL } from '@/lib/config';


type ReviewsRatingsProps = {
    product: PricedProduct;
    onCloseModal: () => void;
    onReviewSubmit: () => void; // Add this line
  };
  
  
type StarRatingProps = {
    rating: number;
    onRatingChange?: (newRating: number) => void;
  };
  
  const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState<number>(0);
  
    const handleClick = (newRating: number) => {
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    };
  
    const handleMouseOver = (newHoverRating: number) => {
      setHoverRating(newHoverRating);
    };
  
    const handleMouseLeave = () => {
      setHoverRating(0);
    };
  
    return (
      <div className="flex" onMouseLeave={handleMouseLeave}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`star ${i < (hoverRating || rating) ? 'filled-star' : 'empty-star'}`}
            onClick={() => handleClick(i + 1)}
            onMouseOver={() => handleMouseOver(i + 1)}
          >
            {i < (hoverRating || rating) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const RatingsForm = ({ product, onCloseModal, onReviewSubmit }: ReviewsRatingsProps) => {
    const [commentTitle, setCommentTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [reviewTitle, setReviewTitle] = useState("");
  const [recommend, setRecommend] = useState<"yes" | "no" | null>(null);
  const [imageData, setImageData] = useState<string>("");
  const [productRating, setProductRating] = useState<number>(0); // Initial rating
  const [comment, setComment] = useState("");
  const [videoData, setVideoData] = useState<string>("");
  const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [nickname, setNickname] = useState('');
const [showSecondForm, setShowSecondForm] = useState(false);




  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Using optional chaining
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Ensure that result is a string before setting state
        if (typeof e.target?.result === "string") {
          setImageData(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Using optional chaining
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Ensure that result is a string before setting state
        if (typeof e.target?.result === "string") {
          setVideoData(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
   };
   
  const handleRatingChange = async (newRating: number) => {
    setProductRating(newRating);
    // console.log("New Rating: ", newRating);

    // try {
    //   const response = await axios.post('http://localhost:9000/store/ratings', {
    //     id: product.id,
    //     ratings: newRating,
    //   });
    //   console.log('Rating update response:', response.data);
    // } catch (error) {
    //   console.error('Error updating rating:', error);
    // }
  };

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the default form submission behavior
   


    const recommendValue = recommend === 'yes'; // Convert to boolean

    const commentData = {
      customer_id: firstName,
      product_id: product.id,
      ratings: productRating,
      commentTitle: reviewTitle,
      commentText: comment,
      recommendValue: recommend,
      email: email,
      image: imageData
    };

    // console.log("comment data ", commentData)
    try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/comments`, commentData);
      // console.log('Comment submission response:', response.data);

      
      // Reset the form and state variables
    setShowSecondForm(false);
    setComment("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setNickname("");
    
    // Close the modal on successful submission
    onCloseModal(); // Invoking the callback to close the modal
    onReviewSubmit(); // This line is added to call the success message function

      // Close the comment box on successful submission
    //   setShowCommentBox(false);
    //   setComment("");
    //   setShowSuccessMessage(true);

    //   setTimeout(() => {
    //     setShowSuccessMessage(false);
    //   }, 3000); // Hide the success message after 3 seconds
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleShowSecondForm = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSecondForm(true);
  };
  


  return (
    <div style={{ background: 'white', padding: '20px', zIndex: 1000 }}>
    <form onSubmit={showSecondForm ? handleSubmitComment : handleShowSecondForm}>
    {!showSecondForm && (
        <>
      <div className="overall-rating" style={{ fontWeight: 400, color: '#000' }}>
        Overall Rating
      </div>
      <StarRating rating={productRating} onRatingChange={handleRatingChange} />
       <div className="comment-box-container mt-3">
                <Label style={{ fontSize: "16px" }}>Review</Label>
                <textarea
                  className="comment-box mt-2"
                  rows={4}
                  placeholder=""
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                <div className="info-icon" style={{ fontSize: "11.5px", letterSpacing: "0.05em", width: "99%" }}>
                  <span className="info-text" style={{ background: "", marginLeft: "1%" }}>Make your review great: Describe what you liked, what you didn’t like, and other key things shoppers should know (minimum 10 characters)</span>
                </div>
              </div>
              <div>
                <div className="overall-rating" style={{ fontWeight: 400, color: '#000' }}>
                  Review title
                </div>
                <input
                  type="text"
                  className="review-title-input"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)} placeholder=""
                  style={{
                    width: '100%', // Makes the input field take up the full width of its container
                    padding: '10px', // Adds some padding inside the input field for aesthetics
                    margin: '10px 0', // Adds some margin above and below the input field
                    border: '1px solid #000', // Adds a border to the input field
                    borderRadius: '4px' // Rounds the corners of the input field
                  }}
                />


                <div className="info-icon" style={{ fontSize: "11.5px", letterSpacing: "0.05em", width: "99%" }}>
                  <span className="info-text" style={{ background: "", marginLeft: "1%" }}>Your overall impression (150 characters or less)</span>
                </div>
              </div>

              <div>
                <h1 className="mt-9 overall-rating" style={{ fontWeight: 400, fontSize: "16.5px", color: "RGBA(0, 0, 0, 0.87)" }}>
                  I would recommend this to a friend
                </h1>
                <div className="radio-buttons-container">
                  <input
                    type="radio"
                    id="recommendYes"
                    name="recommend"
                    value="yes"
                    checked={recommend === 'yes'}
                    onChange={() => setRecommend('yes')}
                    className="styled-radio"
                  />
                  <label htmlFor="recommendYes" className="radio-label mt-3 mr-3" style={{ fontSize: "16px" }}>
                    Yes
                  </label>




                  <input
                    type="radio"
                    id="recommendNo"
                    name="recommend"
                    value="no"
                    checked={recommend === 'no'}
                    onChange={() => setRecommend('no')}
                    className="styled-radio"
                  />
                  <label htmlFor="recommendNo" className="radio-label mt-3 mr-3" style={{ fontSize: "16px" }}>
                    No
                  </label>
                </div>
              </div>
              {/* <div>
                <h1 className="mt-9" style={{ fontWeight: 400, fontSize: "16.5px", color: "RGBA(0, 0, 0, 0.87)" }}>
                  Photos or videos
                </h1>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                 
                  <div className="file-upload-container">
                  <button 
  type="button" 
  className="add-photo-button" 
  onClick={() => {
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.click();
    }
  }}
>
  <FontAwesomeIcon icon={faCamera} /> Add Photo
</button>

  <input
    type="file"
    id="file-upload"
    accept="image/*"
    onChange={handleImageUpload}
    style={{ display: 'none' }}
  />
</div>

<div className="file-upload-container">
  <button 
    type="button" 
    className="add-video-button" 
    onClick={() => {
      const fileInput = document.getElementById('video-upload');
      if (fileInput) {
        fileInput.click();
      }
    }}
  >
    <FontAwesomeIcon icon={faVideo} /> Add Video
  </button>
  <input
    type="file"
    id="video-upload"
    accept="video/*"
    onChange={handleVideoUpload} // You need to define this handler
    style={{ display: 'none' }}
  />
</div>


                </div>
                <div className="info-icon mt-2" style={{ fontSize: "11.5px", letterSpacing: "0.05em", width: "99%" }}>
                  <span className="info-text" style={{ background: "", marginLeft: "1%" }}>You may add up to five photos or videos</span>
                </div>
              </div> */}

              </>
      )}
              {showSecondForm && (
        <>
          <div>
          <div className="comment-box-container mt-3">
          <div className="overall-rating" style={{ fontWeight: 400, color: '#000' }}>

                <Label style={{ fontSize: "16px" }} aria-required>First Name</Label>
                </div>
            <input
              type="text"
              placeholder=""
              value={firstName}
              required
              style={{
                width: '100%', // Makes the input field take up the full width of its container
                padding: '10px', // Adds some padding inside the input field for aesthetics
                margin: '10px 0', // Adds some margin above and below the input field
                border: '1px solid #000', // Adds a border to the input field
                borderRadius: '4px' // Rounds the corners of the input field
              }}
              onChange={(e) => setFirstName(e.target.value)}
            />
            </div>
          </div>
          <div>
          <div className="comment-box-container ">
          <div className="overall-rating" style={{ fontWeight: 400, color: '#000' }}>

                <Label style={{ fontSize: "16px" }}>Last Name</Label>
                </div>
            
            <input
              type="text"
              placeholder=""
              required
              value={lastName}
              style={{
                width: '100%', // Makes the input field take up the full width of its container
                padding: '10px', // Adds some padding inside the input field for aesthetics
                margin: '10px 0', // Adds some margin above and below the input field
                border: '1px solid #000', // Adds a border to the input field
                borderRadius: '4px' // Rounds the corners of the input field
              }}
              onChange={(e) => setLastName(e.target.value)}
            />
            </div>
          </div>
          <div className="comment-box-container ">
          <div className="overall-rating" style={{ fontWeight: 400, color: '#000' }}>

                <Label style={{ fontSize: "16px" }}>Email</Label>
                </div>
            
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              style={{
                width: '100%', // Makes the input field take up the full width of its container
                padding: '10px', // Adds some padding inside the input field for aesthetics
                margin: '10px 0', // Adds some margin above and below the input field
                border: '1px solid #000', // Adds a border to the input field
                borderRadius: '4px' // Rounds the corners of the input field
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
          <div className="comment-box-container">
                <Label style={{ fontSize: "16px" }}>Nickname</Label>
            
            <input
              type="text"
              placeholder=""
              value={nickname}
              style={{
                width: '100%', // Makes the input field take up the full width of its container
                padding: '10px', // Adds some padding inside the input field for aesthetics
                margin: '10px 0', // Adds some margin above and below the input field
                border: '1px solid #000', // Adds a border to the input field
                borderRadius: '4px' // Rounds the corners of the input field
              }}
              onChange={(e) => setNickname(e.target.value)}
            />
            </div>
        </>
      )}

<div className="mt-4" style={{ width: "80%", justifyContent: "flex-start", display: "flex", alignItems: "flex-start" }}>
        <button className="write-review-button" type='submit'>
          {showSecondForm ? "Submit" : "Next"}
        </button>
      </div>

      </form>
      <style>
        {`
        .add-photo-button {
          background-color: white; /* White background */
          color: black; /* Text color */
          border: 1px solid #ccc; /* Border color */
          padding: 10px 20px; /* Padding inside the button */
          text-align: center; /* Center the text and icon */
          display: inline-block; /* Inline block element */
          cursor: pointer; /* Pointer cursor on hover */
          border-radius: 4px; /* Rounded corners */
          font-size: 16px; /* Font size */
          margin-right: 10px; /* Margin to the right */
        }
        
        .add-photo-button:hover {
          background-color: #f8f8f8; /* Slightly different background on hover */
        }
        `}
      </style>
    </div>
  );
};

export default RatingsForm;
