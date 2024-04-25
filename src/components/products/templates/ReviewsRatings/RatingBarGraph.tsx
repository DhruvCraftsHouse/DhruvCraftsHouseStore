// Define the shape of the ratingCounts object
type RatingCounts = {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
};

// Define the props for the RatingBar component
type RatingBarProps = {
  count: number;
  totalRatings: number; // totalRatings will be used to calculate percentage
  label: string;
};

const RatingBar: React.FC<RatingBarProps> = ({ count, totalRatings, label }) => {
  // Calculate the width of the filled part based on the count
  const width = totalRatings > 0 ? `${(count / totalRatings) * 100}%` : '0%';
  return (
    <div className="rating-bar-container" style={{ display: 'flex', alignItems: 'center', marginBottom:"3%" }}>
      {/* Apply inline-flex display to ensure the elements are in line */}
      <div className="rating-bar-label" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px' }}>
        {label}
      </div>
      <div className="rating-bar" style={{ flexGrow: 1, height: '10px', backgroundColor: '#e0e0e0', borderRadius: '0px' }}>
        <div className="rating-bar-fill" style={{ width, backgroundColor: '#000', height: '100%', marginBottom:"10%" }}></div>
      </div>
      <div className="rating-bar-count" style={{ marginLeft: '8px', color: "#696969" }}>
        {`${Math.round((count / totalRatings) * 100)}%`}
      </div>
      <style>
        {`
        .rating-bar-container {
          display: flex;
          align-items: center;
        }
        
        .rating-bar-label {
          margin-right: 8px; /* Adjust as needed */
          font-size: 14px; /* Adjust as needed */
        }
        
        .rating-bar {
          width: 100%; /* Make the bar take full width of the container */
          background-color: #e0e0e0; /* Light gray background */
          height: 20px; /* Adjust bar thickness as needed */
          border-radius: 0px; /* Rounded corners */
          position: relative;
        }
        
        .rating-bar-fill {
          background-color: #000; /* Black fill */
          height: 100%;
          transition: width 0.2s ease-in-out;
        }
        
        .rating-bar-count {
          margin-left: 8px; /* Adjust as needed */
          font-size: 14px; /* Adjust as needed */
        }
        `}
      </style>
    </div>
  );
};

// Define the props for the RatingBarGraph component
type RatingBarGraphProps = {
  ratingCounts: RatingCounts;
};

const RatingBarGraph: React.FC<RatingBarGraphProps> = ({ ratingCounts }) => {
  // Calculate the total number of ratings
  const totalRatings = Object.values(ratingCounts).reduce((total, count) => total + count, 0);

  // Get entries of ratingCounts and reverse the order to display from 5 to 1 stars
  const sortedRatingCounts = Object.entries(ratingCounts).reverse();

  return (
    <div className="rating-bars">
      {sortedRatingCounts.map(([star, count]) => (
        <RatingBar 
          key={star} 
          count={count} 
          totalRatings={totalRatings} 
          // Display the black star symbol followed by the star count
          label={`★${star}`} 
        />
      ))}
    </div>
  );
};

export default RatingBarGraph;





