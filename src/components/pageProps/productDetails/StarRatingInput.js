import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRatingInput = ({ rating, onChange, max = 5 }) => {
  const [hoverRating, setHoverRating] = useState(null);

  const handleClick = (index) => {
    onChange(index + 1);
    console.log("handleClick star : ", index + 1);
    
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  return (
    <div className="flex gap-1 cursor-pointer">
      {[...Array(max)].map((_, index) => {
        const isFilled = (hoverRating || rating) > index;
        return (
          <span
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {isFilled ? (
              <FaStar className="text-yellow-400 text-3xl" />
            ) : (
              <FaRegStar className="text-yellow-400 text-3xl" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
