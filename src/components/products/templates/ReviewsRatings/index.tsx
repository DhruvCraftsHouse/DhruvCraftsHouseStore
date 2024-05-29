import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import React, { useMemo, useState, useEffect, ChangeEvent, useRef } from "react"
import axios from 'axios';
import Link from "next/link"
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RatingsModal from "../RatingsModal"
import { getReviews } from "./getReviews"
import RatingBarGraph from "./RatingBarGraph"
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons/faThumbsDown';
import './ReviewsRatingsStyles.css'; // Importing the CSS file
import { MEDUSA_BACKEND_URL } from "@/lib/config"

// Define a type for a review
interface Review {
  id: number;
  commentText: string;
  ratings: number;
  updated_at: string; // Assuming this is a string representing a date
  commentTitle: string;
  customer_id: string; // Adding customer_id property
  recommendValue: string;
  likes: number;
  dislikes: number;
  // Include any other properties that might be present in the review
}

type ReviewsRatingsProps = {
  product: PricedProduct
}

type ConstantStarRatingProps = {
  rating: number;
};

const ConstantStarRating: React.FC<ConstantStarRatingProps> = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="starConstant filled-starConstant"
        >
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

type RatingCounts = {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
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

const ReviewsRatings = ({ product }: ReviewsRatingsProps) => {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productRating, setProductRating] = useState<number>(0);
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [averageRating, setAverageRating] = useState<number>(0);

  const [reviewTitle, setReviewTitle] = useState("");
  const [recommend, setRecommend] = useState<"yes" | "no" | null>(null);
  const [imageData, setImageData] = useState<string>("");
  const [commentTitle, setCommentTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingCounts, setRatingCounts] = useState<RatingCounts>({
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0
  });

  const toggleGuidelines = () => {
    setShowGuidelines(!showGuidelines);
  };

  const handleReviewSubmit = () => {
    setSuccessMessage("Review successfully submitted");
    handleCloseModal();
    setTimeout(() => {
      setSuccessMessage(""); // Hide the success message after 5 seconds
    }, 5000);
  };

  const calculateRatingCounts = (reviews: Review[]) => {
    const newCounts: RatingCounts = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0
    };

    if (reviews && reviews.length > 0) {
      reviews.forEach((review) => {
        const ratingKey = Math.min(Math.max(1, Math.round(review.ratings)), 5).toString();
        if (ratingKey in newCounts) {
          newCounts[ratingKey as keyof RatingCounts] += 1;
        }
      });
    }

    setRatingCounts(newCounts);
  };

  const fetchReviews = async () => {
    if (!product || !product.id) return;

    try {
      const response = await getReviews(product.id);
      const fetchedReviews = Array.isArray(response) ? response : [];
      setReviews(fetchedReviews);
      calculateRatingCounts(fetchedReviews);

      const totalRating = fetchedReviews.reduce((acc, review) => acc + review.ratings, 0);
      const averageRating = fetchedReviews.length > 0 ? (totalRating / fetchedReviews.length).toFixed(2) : "0.00";
      setAverageRating(parseFloat(averageRating));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product]);

  const isArrayOfReviews = (value: any): value is Review[] => {
    return Array.isArray(value) && value.every(item => 'id' in item && 'commentText' in item);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const renderStars = (rating: number): string => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setCommentTitle('');
    setCommentText('');
  };

  const toggleCommentBox = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === "string") {
          setImageData(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    setProductRating(newRating);
    const commentData = {
      customer_id: "anonymous",
      product_id: product.id,
      ratings: productRating,
      commentTitle: "anonymous",
      commentText: "anonymous",
      recommendValue: "anonymous",
      email: "anonymous",
      image: "anonymous"
    };

    try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/comments`, commentData);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const transformThumbnailUrl = (url: string | null): string => {
    if (!url) return '/default-thumbnail.jpg';
    return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
  };

  const ReviewModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}>
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          width: '64%',
          height: '90%',
          maxHeight: '90vh',
          maxWidth: '64vw',
          overflowY: 'auto',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div>
            <div style={{ width: "90%", }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '20px',
              }}>
                <div style={{ flex: '3' }}>
                  <div style={{ textAlign: 'left', fontFamily: "Klein, sans-serif" }}>
                    <h1 style={{ margin: 0, fontSize: '27px', fontWeight: 400 }}>Please share your experience</h1>
                    <div className="mt-3" style={{ fontWeight: 400, color: 'RGBA(0, 0, 0, 0.58)', fontSize: '18px' }}>{product.title}</div>
                    <div className="mt-3" style={{ fontWeight: 400, color: '#000' }}>Your feedback will help other shoppers make good choices, and we&apos;ll use it to improve our products.</div>
                    <Link href="#"
                      className="mt-3 cursor-pointer"
                      style={{ paddingTop: "5%", fontWeight: 400, color: '#000', fontSize: '13.5px', textDecoration: 'underline' }}
                      onClick={toggleGuidelines}
                    >
                      {showGuidelines ? 'Hide guidelines' : 'Review guidelines'}
                    </Link>

                    {showGuidelines && (
                      <div style={{ marginTop: "5%", paddingLeft: "5%", fontWeight: 400, color: '#000', fontSize: '13.5px' }}>
                        We value your input and invite you to rate and review your purchases. Be sure to explain why you like or dislike the product and focus on the product&apos;s features and your own experience using it.
                        <br /><br />
                        If you wish to comment about product selection, pricing, ordering, delivery or other issues, please contact our customer support.
                        <br /><br />
                        Please refrain from including any of the following in your review:
                        <ul style={{ listStyleType: 'disc', paddingLeft: "5%" }}>
                          <li>Obscene or discriminatory language</li>
                          <li>Critical or inappropriate comments about other reviews and shoppers</li>
                          <li>Advertising, spam, references to other websites or retailers</li>
                          <li>Personal information such as email addresses, phone numbers, or physical addresses</li>
                        </ul>

                        All reviews are subject to our store&apos;s Terms of Use.
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: '1' }}>
                  <img
                    src={transformThumbnailUrl(product.thumbnail || '')}
                    alt={product.title}
                    style={{ width: '90%', height: 'auto' }}
                  />
                </div>
              </div>

              {isModalOpen && (
                <RatingsModal
                  product={product}
                  onCloseModal={onClose}
                  onReviewSubmit={handleReviewSubmit}
                />
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: "5px",
              right: 0,
              border: 'none',
              color: "#ccc",
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0px 15px 5px 15px',
            }}
          >
            x
          </button>
        </div>
      </div>,
      document.body
    );
  };

  const [sortKey, setSortKey] = useState<string>('mostRecent');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showStarDropdown, setShowStarDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowStarDropdown(false);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>, star: number) => {
    e.stopPropagation();
    handleRatingFilterChange(star);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderStarDropdown = () => {
    return (
      <div className="select-dropdown" onClick={() => setShowStarDropdown(!showStarDropdown)} style={{ marginLeft: "20px", height: '60px', width: '230px' }}>
        <label className="dropdown-label" style={{ fontSize: "10px", fontWeight: 500, color: "#696969", marginBottom: "-20px" }}>Filter</label>
        <input
          type="text"
          className="star-rating-input"
          placeholder="Star Ratings"
          onClick={(e) => {
            e.stopPropagation();
            setShowStarDropdown(true);
          }}
          style={{ paddingTop: "-20px", paddingBottom: "-20px" }}
          readOnly
        />
        <div className="dropdown-icon"></div>
        <div className={`dropdown-content ${showStarDropdown ? 'show' : ''}`} ref={dropdownRef}>
          {[5, 4, 3, 2, 1].map(star => (
            <label key={star} onClick={(e) => handleCheckboxClick(e, star)} className="star-rating-option">
              <input
                type="checkbox"
                checked={selectedRatings.includes(star)}
                onChange={() => { }}
              />
              {"★".repeat(star) + "☆".repeat(5 - star)}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortKey(e.target.value);
  };

  const handleRatingFilterChange = (rating: number) => {
    setSelectedRatings(prevSelectedRatings => {
      if (prevSelectedRatings.includes(rating)) {
        return prevSelectedRatings.filter(r => r !== rating);
      } else {
        return [...prevSelectedRatings, rating];
      }
    });
  };

  const clearFilters = () => {
    setSelectedRatings([]);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const sortReviews = (reviews: Review[]): Review[] => {
    switch (sortKey) {
      case 'mostRecent':
        return [...reviews].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      case 'mostHelpful':
        return [...reviews].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
      case 'oldest':
        return [...reviews].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
      case 'highestRated':
        return [...reviews].sort((a, b) => b.ratings - a.ratings);
      case 'lowestRated':
        return [...reviews].sort((a, b) => a.ratings - b.ratings);
      default:
        return [...reviews];
    }
  };

  const filterByRating = (reviews: Review[]): Review[] => {
    if (selectedRatings.length === 0) {
      return reviews;
    }
    return reviews.filter(review => selectedRatings.includes(review.ratings));
  };

  const searchReviews = (reviews: Review[]): Review[] => {
    return reviews.filter(review => review.commentTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const handleLike = async (reviewId: number) => {
    try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/increaselikes`, { id: reviewId });
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
        )
      );
    } catch (error) {
      console.error('Error liking the review:', error);
    }
  };

  const handleDislike = async (reviewId: number) => {
    try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/decreaselikes`, { id: reviewId });
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId ? { ...review, dislikes: review.dislikes + 1 } : review
        )
      );
    } catch (error) {
      console.error('Error disliking the review:', error);
    }
  };

  const displayReviews = useMemo(() => {
    let sortedReviews = sortReviews(reviews);
    let filteredReviews = filterByRating(sortedReviews);
    return searchReviews(filteredReviews);
  }, [reviews, sortKey, selectedRatings, searchQuery]);

  console.log('displayReviews', displayReviews)
  return (
    <div id="reviews-ratings" className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        {averageRating < 1 ? (
          <>
            <StarRating rating={productRating} onRatingChange={handleRatingChange} />
            <button onClick={toggleCommentBox} className="write-review-button">
              Write a Review
            </button>
          </>
        ) : (
          <div style={{ fontFamily: "Arial, sans-serif", textAlign: "left", width: "100%" }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '50%', borderBottom: "1px solid #ccc", paddingBottom: "3.5%" }}>
              <div style={{ flex: '1', padding: '0', margin: '0' }}>
                <h1 style={{ fontSize: "14px", color: "#696969" }}>
                  <span style={{ fontSize: "46px", color: "#000", fontWeight: 500 }}>{averageRating}</span> out of 5 stars
                </h1>
                <ConstantStarRating rating={averageRating} />
                <button onClick={toggleCommentBox} className="write-review-button" style={{ padding: "10px 60px" }}>
                  Write a Review
                </button>
              </div>
              <div style={{ flex: '1', padding: '0', marginTop: '20px' }}>
                <RatingBarGraph ratingCounts={ratingCounts} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: '', alignItems: '', marginBottom: '20px', marginTop: '20px' }}>
              <div className="select-dropdown" style={{ marginLeft: "20px", height: '60px', width: '230px' }}>
                <label className="dropdown-label" style={{ fontSize: "10px", fontWeight: 500, color: "#696969", marginBottom: "-20px" }}>Sort</label>
                <select
                  value={sortKey}
                  onChange={handleSortChange}
                  style={{ height: "", width: "200px", fontSize: "14px" }}
                >
                  <option value="mostRecent">Most Recent</option>
                  <option value="mostHelpful">Most Helpful</option>
                  <option value="oldest">Oldest</option>
                  <option value="highestRated">Highest Rated</option>
                  <option value="lowestRated">Lowest Rated</option>
                </select>
              </div>
              <div onClick={() => setShowStarDropdown(!showStarDropdown)} style={{}}>
                {renderStarDropdown()}
              </div>
              {selectedRatings.length > 0 && (
                <button onClick={clearFilters}>Clear All</button>
              )}
              <input
                type="text"
                className="search-input"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                style={{ height: "60px", width: "300px", marginRight: "10px", fontFamily: "Klein, sans-serif", color: "#696969" }}
              />
            </div>
            <div>
              <ul style={{ listStyleType: 'none', padding: '0', marginRight: "10px" }}>
                {isArrayOfReviews(displayReviews) ? displayReviews.map((review) => (
                  <li key={review.id} style={{ borderBottom: '1px solid #e1e1e1', paddingBottom: '10px', marginBottom: '10px', marginRight: "10px" }}>
                    <div style={{ fontFamily: "Arial, sans-serif", display: 'flex', flexDirection: 'column', padding: "20px 10px" }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                        <div style={{ fontSize: "13px" }}>
                          {formatDate(review.updated_at)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ color: '#696969', fontSize: "13px" }}>
                            {review.customer_id}
                          </div>
                          <div style={{
                            marginLeft: '8px',
                            backgroundColor: '#696969',
                            color: 'white',
                            padding: '3px 7px',
                            borderRadius: '15px',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            Verified Buyer
                          </div>
                        </div>
                        {review.recommendValue ? (
                          <div style={{ fontSize: '13px' }}>
                            I would recommend this to a friend: Yes
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px', color: "transparent" }}>
                            I would recommend this to a friend: no
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '30px', marginTop: '4px' }}>
                        {renderStars(review.ratings)}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>
                        {review.commentTitle}
                      </div>
                      {review.commentText && (
 <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
 {review.commentText}
</div>
                      )}
                     
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <div style={{ fontSize: '14px', marginRight: '8px' }}>
                          Was this review helpful to you?
                        </div>
                        <button
                          onClick={() => handleLike(review.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 5px' }}
                        >
                          <FontAwesomeIcon icon={faThumbsUp} />
                          <span style={{ marginLeft: '4px' }}>{review.likes}</span>
                        </button>
                        <button
                          onClick={() => handleDislike(review.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 5px', marginLeft: '12px' }}
                        >
                          <FontAwesomeIcon icon={faThumbsDown} />
                          <span style={{ marginLeft: '4px' }}>{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                )) : <p>No reviews to display</p>}
              </ul>
            </div>
          </div>
        )}
        <ReviewModal isOpen={isModalOpen} onClose={handleCloseModal} />
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  )
}

export default ReviewsRatings
