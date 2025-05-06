import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const FabricRating = ({ rating = 0}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">{renderStars()}</div>
      {/* <span className="text-sm text-gray-600">({rating} out of 5, {reviewsCount} reviews)</span> */}
    </div>
  );
};

export default FabricRating;
