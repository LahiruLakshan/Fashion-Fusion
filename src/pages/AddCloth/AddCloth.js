import React, { useState } from "react";
import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { BACKEND_URL } from "../../constants/config";

// Cloudinary setup
const cld = new Cloudinary({
  cloud: {
    cloudName: "dl3mpo0w3", // Replace with your Cloudinary cloud name
  },
});

const AddClothPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [clothId, setClothId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Clothing Details Form State
  const [clothData, setClothData] = useState({
    sku: "",
    title: "",
    color: "",
    sale_price_amount: "",
    retail_price_amount: "",
    discount_percentage: "",
    category_name: "",
    description: "",
    reviews_count: "",
    average_rating: "",
    lens_id_s: "",
    lens_id_m: "",
    lens_id_l: "",
    fabric_name: "",
    fabric_description: "",
    style: "",
    url: null, // For product image
    fabric_url: null, // For fabric image
  });

  // Size Measurements Form State
  // const [sizeData, setSizeData] = useState({
  //   size: "",
  //   chest_min: "",
  //   chest_max: "",
  //   neck_min: "",
  //   neck_max: "",
  //   shoulder_width_min: "",
  //   shoulder_width_max: "",
  //   arm_length_min: "",
  //   arm_length_max: "",
  // });

  const [sizeDataLargeUp, setSizeDataLargeUp] = useState({
    size: "L",
    chest_min: "",
    chest_max: "",
    neck_min: "",
    neck_max: "",
    shoulder_width_min: "",
    shoulder_width_max: "",
    arm_length_min: "",
    arm_length_max: "",
  });

  const [sizeDataMediumUp, setSizeDataMediumUp] = useState({
    size: "M",
    chest_min: "",
    chest_max: "",
    neck_min: "",
    neck_max: "",
    shoulder_width_min: "",
    shoulder_width_max: "",
    arm_length_min: "",
    arm_length_max: "",
  });

  const [sizeDataSmallUp, setSizeDataSmallUp] = useState({
    size: "S",
    chest_min: "",
    chest_max: "",
    neck_min: "",
    neck_max: "",
    shoulder_width_min: "",
    shoulder_width_max: "",
    arm_length_min: "",
    arm_length_max: "",
  });

  const [sizeDataLargeDown, setSizeDataLargeDown] = useState({
    size: "L",
    waist_min: "",
    waist_max: "",
    hip_min: "",
    hip_max: "",
    thigh_min: "",
    thigh_max: "",
    inseam_min: "",
    inseam_max: "",
  });

  const [sizeDataMediumDown, setSizeDataMediumDown] = useState({
    size: "M",
    waist_min: "",
    waist_max: "",
    hip_min: "",
    hip_max: "",
    thigh_min: "",
    thigh_max: "",
    inseam_min: "",
    inseam_max: "",
  });

  const [sizeDataSmallDown, setSizeDataSmallDown] = useState({
    size: "S",
    waist_min: "",
    waist_max: "",
    hip_min: "",
    hip_max: "",
    thigh_min: "",
    thigh_max: "",
    inseam_min: "",
    inseam_max: "",
  });

  const handleSizeLargeUpChange = (e) => {
    setSizeDataLargeUp({ ...sizeDataLargeUp, [e.target.name]: e.target.value });
  };

  const handleSizeMediumUPChange = (e) => {
    setSizeDataMediumUp({ ...sizeDataMediumUp, [e.target.name]: e.target.value });
  };

  const handleSizeSmallUpChange = (e) => {
    setSizeDataSmallUp({ ...sizeDataSmallUp, [e.target.name]: e.target.value });
  };

  const handleSizeLargeDownChange = (e) => {
    setSizeDataLargeDown({ ...sizeDataLargeDown, [e.target.name]: e.target.value });
  };

  const handleSizeMediumDownChange = (e) => {
    setSizeDataMediumDown({ ...sizeDataMediumDown, [e.target.name]: e.target.value });
  };

  const handleSizeSmallDownChange = (e) => {
    setSizeDataSmallDown({ ...sizeDataSmallDown, [e.target.name]: e.target.value });
  };

  const handleSubmitCloth = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}api/clothes-add/`, {
        ...clothData,
        sale_price_with_symbol: `$${clothData.sale_price_amount}`,
        retail_price_with_symbol: `$${clothData.retail_price_amount}`,
      });

      setClothId(response.data.id);
      setActiveStep(1); // Move to the first size form
      setSnackbar({
        open: true,
        message: "Clothing details saved successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving clothing details",
        severity: "error",
      });
      console.error("Error submitting cloth data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSizeLargeUp = async () => {
    try {
      console.log("clothId : ", clothId);
      // console.log("cloth...sizeDataLargeUpId : ", ...sizeDataLargeUp);
      
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_shirt_size/`, {
        ...sizeDataLargeUp,
        cloth: clothId,
      });
      setSnackbar({
        open: true,
        message: "Large size measurements added successfully!",
        severity: "success",
      });
      setActiveStep(2); // Move to the next size form
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving large size measurements",
        severity: "error",
      });
      console.error("Error submitting large size data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSizeMediumUp = async () => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_shirt_size/`, {
        ...sizeDataMediumUp,
        cloth: clothId,
      });
      setSnackbar({
        open: true,
        message: "Medium size measurements added successfully!",
        severity: "success",
      });
      setActiveStep(3); // Move to the next size form
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving medium size measurements",
        severity: "error",
      });
      console.error("Error submitting medium size data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSizeSmallUp = async () => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_shirt_size/`, {
        ...sizeDataSmallUp,
        cloth: clothId,
      });
      setSnackbar({
        open: true,
        message: "Small size measurements added successfully!",
        severity: "success",
      });
      setActiveStep(0); // Reset to the first form
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving small size measurements",
        severity: "error",
      });
      console.error("Error submitting small size data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSizeLargeDown = async () => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_trouser_size/`, {
        ...sizeDataLargeDown,
        cloth: clothId,
      });
      setSnackbar({
        open: true,
        message: "Large size measurements added successfully!",
        severity: "success",
      });
      setActiveStep(2); // Move to the next size form
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving large size measurements",
        severity: "error",
      });
      console.error("Error submitting large size data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSizeMediumDown = async () => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_trouser_size/`, {
        ...sizeDataMediumDown,
        cloth: clothId,
      });
      setSnackbar({
        open: true,
        message: "Medium size measurements added successfully!",
        severity: "success",
      });
      setActiveStep(3); // Move to the next size form
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving medium size measurements",
        severity: "error",
      });
      console.error("Error submitting medium size data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSizeSmallDown = async () => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_trouser_size/`, {
        ...sizeDataSmallDown,
        cloth: clothId,
      });
      setSnackbar({
        open: true,
        message: "Small size measurements added successfully!",
        severity: "success",
      });
      setActiveStep(0); // Reset to the first form
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving small size measurements",
        severity: "error",
      });
      console.error("Error submitting small size data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClothChange = (e) => {
    setClothData({ ...clothData, [e.target.name]: e.target.value });
  };

  // const handleSizeChange = (e) => {
  //   setSizeData({ ...sizeData, [e.target.name]: e.target.value });
  // };

  const handleImageUpload = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "fusion"); // Replace with your Cloudinary upload preset

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dl3mpo0w3/image/upload`,
        formData
      );
      console.log("response : ", response);

      if (type === "url") {
        setClothData({ ...clothData, url: response.data.secure_url });
      } else if (type === "fabric_url") {
        setClothData({ ...clothData, fabric_url: response.data.secure_url });
      }

      setSnackbar({
        open: true,
        message: "Image uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error uploading image",
        severity: "error",
      });
      console.error("Error uploading image:", error);
    }
  };

  // const handleSubmitCloth = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`${BACKEND_URL}api/clothes-add/`, {
  //       ...clothData,
  //       sale_price_with_symbol: `$${clothData.sale_price_amount}`,
  //       retail_price_with_symbol: `$${clothData.retail_price_amount}`,
  //     });

  //     setClothId(response.data.id);
  //     setActiveStep(1);
  //     setSnackbar({ open: true, message: 'Clothing details saved successfully!', severity: 'success' });
  //   } catch (error) {
  //     setSnackbar({ open: true, message: 'Error saving clothing details', severity: 'error' });
  //     console.error('Error submitting cloth data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmitSize = async () => {
  //   try {
  //     setLoading(true);
  //     await axios.post(`${BACKEND_URL}api/add_shirt_size/`, {
  //       ...sizeData,
  //       cloth: clothId,
  //     });

  //     setSnackbar({
  //       open: true,
  //       message: "Size measurements added successfully!",
  //       severity: "success",
  //     });
  //     // Reset forms
  //     setActiveStep(0);
  //     setClothData({
  //       sku: "",
  //       title: "",
  //       color: "",
  //       sale_price_amount: "",
  //       retail_price_amount: "",
  //       discount_percentage: "",
  //       category_name: "",
  //       description: "",
  //       reviews_count: "",
  //       average_rating: "",
  //       lens_id_s: "",
  //       lens_id_m: "",
  //       lens_id_l: "",
  //       fabric_name: "",
  //       fabric_description: "",
  //       style: "",
  //       url: null,
  //       fabric_url: null,
  //     });
  //     setSizeData({
  //       size: "",
  //       chest_min: "",
  //       chest_max: "",
  //       neck_min: "",
  //       neck_max: "",
  //       shoulder_width_min: "",
  //       shoulder_width_max: "",
  //       arm_length_min: "",
  //       arm_length_max: "",
  //     });
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Error saving size measurements",
  //       severity: "error",
  //     });
  //     console.error("Error submitting size data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleCloseSnackbar = () => {
  //   setSnackbar({ ...snackbar, open: false });
  // };

  // const validateClothForm = () => {
  //   return (
  //     clothData.sku &&
  //     clothData.title &&
  //     clothData.color &&
  //     clothData.sale_price_amount &&
  //     clothData.retail_price_amount &&
  //     clothData.discount_percentage &&
  //     clothData.category_name &&
  //     clothData.description &&
  //     clothData.url &&
  //     clothData.fabric_url
  //   );
  // };

  // const validateSizeForm = () => {
  //   return (
  //     sizeData.size &&
  //     sizeData.chest_min &&
  //     sizeData.chest_max &&
  //     sizeData.neck_min &&
  //     sizeData.neck_max &&
  //     sizeData.shoulder_width_min &&
  //     sizeData.shoulder_width_max &&
  //     sizeData.arm_length_min &&
  //     sizeData.arm_length_max
  //   );
  // };

  const steps = [
    "Add Clothing Details",
    "Add Size Measurements Large",
    "Add Size Measurements Medium",
    "Add Size Measurements Small",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`px-4 py-2 rounded-full ${
                  activeStep === index
                    ? "bg-gray-800 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!loading && activeStep === 0 && (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Clothing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Clothing Details Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={clothData.sku}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={clothData.title}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={clothData.color}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Style
                </label>
                <input
                  type="text"
                  name="style"
                  value={clothData.style}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sale Price ($)
                </label>
                <input
                  type="number"
                  name="sale_price_amount"
                  value={clothData.sale_price_amount}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Retail Price ($)
                </label>
                <input
                  type="number"
                  name="retail_price_amount"
                  value={clothData.retail_price_amount}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount_percentage"
                  value={clothData.discount_percentage}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={clothData.category_name}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reviews Count
                </label>
                <input
                  type="number"
                  name="reviews_count"
                  value={clothData?.reviews_count}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Average Rating
                </label>
                <input
                  type="number"
                  name="average_rating"
                  value={clothData?.average_rating}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lens ID: SMALL
                </label>
                <input
                  type="text"
                  name="lens_id_s"
                  value={clothData?.lens_id_s}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lens ID: MEDIUM
                </label>
                <input
                  type="text"
                  name="lens_id_m"
                  value={clothData?.lens_id_m}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lens ID: LARGE
                </label>
                <input
                  type="text"
                  name="lens_id_l"
                  value={clothData?.lens_id_l}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fabric Name
                </label>
                <input
                  type="text"
                  name="fabric_name"
                  value={clothData.fabric_name}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fabric Description
                </label>
                <textarea
                  name="fabric_description"
                  value={clothData.fabric_description}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={clothData.description}
                  onChange={handleClothChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  rows="4"
                  required
                />
              </div>
              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files[0], "url")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  accept="image/*"
                  required
                />
                {clothData.url && (
                  <AdvancedImage
                    cldImg={cld
                      .image(clothData.url)
                      .resize(fill().width(150).height(150))}
                    className="mt-2 rounded-md"
                  />
                )}
              </div>
              {/* Fabric Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fabric Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleImageUpload(e.target.files[0], "fabric_url")
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  accept="image/*"
                  required
                />
                {clothData.fabric_url && (
                  <AdvancedImage
                    cldImg={cld
                      .image(clothData.fabric_url)
                      .resize(fill().width(150).height(150))}
                    className="mt-2 rounded-md"
                  />
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                // onClick={handleSubmitCloth}
                onClick={handleSubmitCloth}
                // disabled={!validateClothForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Next: Add Size Measurements
              </button>
            </div>
          </form>
        )}

        {!loading && activeStep === 1 && (clothData.category_name === "shirt" || clothData.category_name === "t-shirt" || clothData.category_name === "jacket" || clothData.category_name === "hoodie") &&  (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Size Measurements (in cm)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Measurements Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={setSizeDataLargeUp.size}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Min
                </label>
                <input
                  type="number"
                  name="chest_min"
                  value={setSizeDataLargeUp.chest_min}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Max
                </label>
                <input
                  type="number"
                  name="chest_max"
                  value={setSizeDataLargeUp.chest_max}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neck Min
                </label>
                <input
                  type="number"
                  name="neck_min"
                  value={setSizeDataLargeUp.neck_min}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neck Max
                </label>
                <input
                  type="number"
                  name="neck_max"
                  value={setSizeDataLargeUp.neck_max}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shoulder Width Min
                </label>
                <input
                  type="number"
                  name="shoulder_width_min"
                  value={setSizeDataLargeUp.shoulder_width_min}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shoulder Width Max
                </label>
                <input
                  type="number"
                  name="shoulder_width_max"
                  value={setSizeDataLargeUp.shoulder_width_max}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Min
                </label>
                <input
                  type="number"
                  name="arm_length_min"
                  value={setSizeDataLargeUp.arm_length_min}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Max
                </label>
                <input
                  type="number"
                  name="arm_length_max"
                  value={setSizeDataLargeUp.arm_length_max}
                  onChange={handleSizeLargeUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-4"
              >
                Back
              </button>
              <button
                type="button"
                // onClick={handleSubmitSize}
                onClick={handleSubmitSizeLargeUp}
                // disabled={!validateSizeForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Submit All Data
              </button>
            </div>
          </form>
        )}

        {!loading && activeStep === 2 && (clothData.category_name === "shirt" || clothData.category_name === "t-shirt" || clothData.category_name === "jacket" || clothData.category_name === "hoodie") && (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Size Measurements (in cm)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Measurements Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={sizeDataMediumUp.size}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Min
                </label>
                <input
                  type="number"
                  name="chest_min"
                  value={sizeDataMediumUp.chest_min}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Max
                </label>
                <input
                  type="number"
                  name="chest_max"
                  value={sizeDataMediumUp.chest_max}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neck Min
                </label>
                <input
                  type="number"
                  name="neck_min"
                  value={sizeDataMediumUp.neck_min}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neck Max
                </label>
                <input
                  type="number"
                  name="neck_max"
                  value={sizeDataMediumUp.neck_max}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shoulder Width Min
                </label>
                <input
                  type="number"
                  name="shoulder_width_min"
                  value={sizeDataMediumUp.shoulder_width_min}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shoulder Width Max
                </label>
                <input
                  type="number"
                  name="shoulder_width_max"
                  value={sizeDataMediumUp.shoulder_width_max}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Min
                </label>
                <input
                  type="number"
                  name="arm_length_min"
                  value={sizeDataMediumUp.arm_length_min}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Max
                </label>
                <input
                  type="number"
                  name="arm_length_max"
                  value={sizeDataMediumUp.arm_length_max}
                  onChange={handleSizeMediumUPChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-4"
              >
                Back
              </button>
              <button
                type="button"
                // onClick={handleSubmitSize}
                onClick={handleSubmitSizeMediumUp}
                // disabled={!validateSizeForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Submit All Data
              </button>
            </div>
          </form>
        )}

        {!loading && activeStep === 3 && (clothData.category_name === "shirt" || clothData.category_name === "t-shirt" || clothData.category_name === "jacket" || clothData.category_name === "hoodie") && (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Size Measurements (in cm)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Measurements Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={sizeDataSmallDown.size}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Min
                </label>
                <input
                  type="number"
                  name="chest_min"
                  value={sizeDataSmallDown.chest_min}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Max
                </label>
                <input
                  type="number"
                  name="chest_max"
                  value={sizeDataSmallDown.chest_max}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neck Min
                </label>
                <input
                  type="number"
                  name="neck_min"
                  value={sizeDataSmallDown.neck_min}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Neck Max
                </label>
                <input
                  type="number"
                  name="neck_max"
                  value={sizeDataSmallDown.neck_max}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shoulder Width Min
                </label>
                <input
                  type="number"
                  name="shoulder_width_min"
                  value={sizeDataSmallDown.shoulder_width_min}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shoulder Width Max
                </label>
                <input
                  type="number"
                  name="shoulder_width_max"
                  value={sizeDataSmallDown.shoulder_width_max}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Min
                </label>
                <input
                  type="number"
                  name="arm_length_min"
                  value={sizeDataSmallDown.arm_length_min}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Max
                </label>
                <input
                  type="number"
                  name="arm_length_max"
                  value={sizeDataSmallDown.arm_length_max}
                  onChange={handleSizeSmallUpChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-4"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitSizeSmallUp}
                // disabled={!validateSizeForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Submit All Data
              </button>
            </div>
          </form>
        )}


{!loading && activeStep === 1 && (clothData.category_name === "trouser" || clothData.category_name === "short") &&  (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Size Measurements (in cm)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Measurements Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={sizeDataLargeDown.size}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Waist Min
                </label>
                <input
                  type="number"
                  name="waist_min"
                  value={sizeDataLargeDown.waist_min}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Waist Max
                </label>
                <input
                  type="number"
                  name="waist_max"
                  value={sizeDataLargeDown.waist_max}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Hip Min
                </label>
                <input
                  type="number"
                  name="hip_min"
                  value={sizeDataLargeDown.hip_min}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Hip Max
                </label>
                <input
                  type="number"
                  name="hip_max"
                  value={sizeDataLargeDown.hip_max}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Thigh Min
                </label>
                <input
                  type="number"
                  name="thigh_min"
                  value={sizeDataLargeDown.thigh_min}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                thigh_max
                </label>
                <input
                  type="number"
                  name="thigh_max"
                  value={sizeDataLargeDown.thigh_max}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                inseam_min
                </label>
                <input
                  type="number"
                  name="inseam_min"
                  value={sizeDataLargeDown.inseam_min}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                inseam_max
                </label>
                <input
                  type="number"
                  name="inseam_max"
                  value={sizeDataLargeDown.inseam_max}
                  onChange={handleSizeLargeDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-4"
              >
                Back
              </button>
              <button
                type="button"
                // onClick={handleSubmitSize}
                onClick={handleSubmitSizeLargeDown}
                // disabled={!validateSizeForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Submit All Data
              </button>
            </div>
          </form>
        )}

        {!loading && activeStep === 2 && (clothData.category_name === "trouser" || clothData.category_name === "short") && (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Size Measurements (in cm)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Measurements Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={sizeDataMediumDown.size}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Min
                </label>
                <input
                  type="number"
                  name="waist_min"
                  value={sizeDataMediumDown.waist_min}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chest Max
                </label>
                <input
                  type="number"
                  name="chest_max"
                  value={sizeDataMediumDown.chest_max}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Hip Min
                </label>
                <input
                  type="number"
                  name="hip_min"
                  value={sizeDataMediumDown.hip_min}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Hip Max
                </label>
                <input
                  type="number"
                  name="hip_max"
                  value={sizeDataMediumDown.hip_max}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Thigh Min
                </label>
                <input
                  type="number"
                  name="thigh_min"
                  value={sizeDataMediumDown.thigh_min}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                thigh_max
                </label>
                <input
                  type="number"
                  name="thigh_max"
                  value={sizeDataMediumDown.thigh_max}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                inseam_min
                </label>
                <input
                  type="number"
                  name="inseam_min"
                  value={sizeDataMediumDown.inseam_min}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                inseam_max
                </label>
                <input
                  type="number"
                  name="inseam_max"
                  value={sizeDataMediumDown.inseam_max}
                  onChange={handleSizeMediumDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-4"
              >
                Back
              </button>
              <button
                type="button"
                // onClick={handleSubmitSize}
                onClick={handleSubmitSizeMediumDown}
                // disabled={!validateSizeForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Submit All Data
              </button>
            </div>
          </form>
        )}

        {!loading && activeStep === 3 && (clothData.category_name === "trouser" || clothData.category_name === "short") && (
          <form>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Size Measurements (in cm)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Measurements Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={sizeDataSmallDown.size}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Waist Min
                </label>
                <input
                  type="number"
                  name="waist_min"
                  value={sizeDataSmallDown.waist_min}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                waist_max
                </label>
                <input
                  type="number"
                  name="waist_max"
                  value={sizeDataSmallDown.waist_max}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Hip Min
                </label>
                <input
                  type="number"
                  name="hip_min"
                  value={sizeDataSmallDown.hip_min}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Hip Max
                </label>
                <input
                  type="number"
                  name="hip_max"
                  value={sizeDataSmallDown.hip_max}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Thigh Min
                </label>
                <input
                  type="number"
                  name="thigh_min"
                  value={sizeDataSmallDown.thigh_min}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                thigh_max
                </label>
                <input
                  type="number"
                  name="thigh_max"
                  value={sizeDataSmallDown.thigh_max}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Arm Length Min
                </label>
                <input
                  type="number"
                  name="inseam_min"
                  value={sizeDataSmallDown.inseam_min}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                inseam_max
                </label>
                <input
                  type="number"
                  name="inseam_max"
                  value={sizeDataSmallDown.inseam_max}
                  onChange={handleSizeSmallDownChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-4"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitSizeSmallDown}
                // disabled={!validateSizeForm()}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Submit All Data
              </button>
            </div>
          </form>
        )}
      </div>

      {snackbar.open && (
        <div className="fixed bottom-4 right-4">
          <div
            className={`px-6 py-4 rounded-md shadow-lg ${
              snackbar.severity === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {snackbar.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClothPage;
