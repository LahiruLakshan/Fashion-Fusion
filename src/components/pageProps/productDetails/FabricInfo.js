import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // For star icons
import axios from "axios";
import { BACKEND_URL } from "../../../constants/config";

const FabricInfo = ({ productInfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fabricReview, setFabricReview] = useState();

  // Mock rating value (replace with actual rating from productInfo if available)
  const reviewsCount = 0; // Use productInfo.reviews_count if available

  const handleTryOn = () => {
    navigate(`/try-on`, {
      state: {
        cloth_id: productInfo?.item?.id,
      },
    });
  };

  const fetchAllItems = async () => {
    try {
      await axios
        .get(`${BACKEND_URL}api/fabric-summary/cotton/`)
        .then((response) => {
          console.log("response : ", response.data);
          setFabricReview(response.data.message);
        }).catch(err => setFabricReview(err.response.data.message));
    } catch (err) {
        console.log(err);
    }
  };

  useEffect(() => {
    if (productInfo?.item?.fabric_name) {
      fetchAllItems();
    }
  }, [productInfo?.item?.fabric_name]);

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Empty stars
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Product Name and Try On Button */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Name</p>
        <h2 className="text-3xl font-semibold">
          {productInfo?.item?.fabric_name}
        </h2>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Description</p>
        <p className="text-md ">{productInfo?.item?.fabric_description}</p>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Description</p>
        <p className="text-md ">{productInfo?.item?.fabric_description}</p>
      </div>

     <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Review</p>
        <p className="text-md ">{fabricReview}</p>
      </div>

      {/* Price */}
      <p className="text-xl font-semibold">LKR {productInfo?.price}</p>

      {/* Ratings and Reviews Count */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {renderStars(productInfo?.item?.average_rating)}
        </div>
        <p className="text-sm text-gray-600">
          ({productInfo?.item?.average_rating} out of 5,{" "}
          {productInfo?.item?.reviews_count} reviews)
        </p>
      </div>

      {/* Description */}
      <p className="text-base text-gray-600">
        {productInfo?.item?.description}
      </p>

      {/* Review Prompt */}
      {reviewsCount === 0 && (
        <p className="text-sm text-gray-600">Be the first to leave a review.</p>
      )}

      {/* Color */}
      <p className="font-medium text-lg">
        <p className="text-sm text-gray-600">Color: {productInfo?.color}</p>
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont rounded-md"
      >
        Add to Cart
      </button>

      
    </div>
  );
};

export default FabricInfo;
