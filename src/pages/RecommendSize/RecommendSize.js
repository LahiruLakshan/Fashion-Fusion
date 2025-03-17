import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { BACKEND_URL } from "../../constants/config";

const RecommendSize = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [height, setHeight] = useState("");
  const [measurements, setMeasurements] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          capture();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUpload = async () => {
    if (!imgSrc) {
      alert("Please capture an image!");
      return;
    }

    setUploading(true);

    try {
      // Convert data URL to Blob
      const blob = await fetch(imgSrc).then((res) => res.blob());
      const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
      const authToken = JSON.parse(localStorage.getItem("authToken"));
      const formData = new FormData();
      formData.append("image", file);
      formData.append("height", 72);
      formData.append("user_id", authToken.user_id ?? 1); // Replace with actual user ID

      const response = await axios.post(`${BACKEND_URL}api/get-measurements/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.measurements) {
        setMeasurements(response.data.measurements);
        setSubmitted(true);
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Upload Failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
      <h1 className="text-4xl font-bold mb-8">Body Measurements Scanner</h1>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Camera Container */}
        <div className="w-full max-w-3xl mb-8">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="Captured"
              className="w-full max-w-[640px] rounded-lg shadow-lg mx-auto"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="100%"
              className="w-full  rounded-lg shadow-lg mx-auto"
            />
          )}
        </div>

        {/* Capture Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap justify-center bg-white shadow-lg p-6 rounded-lg">
          <button
            onClick={() => startCountdown(3)}
            disabled={!!imgSrc}
            className="px-6 py-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Take Photo in 3 Seconds
          </button>
          <button
            onClick={() => startCountdown(5)}
            disabled={!!imgSrc}
            className="px-6 py-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Take Photo in 5 Seconds
          </button>
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <p className="text-xl font-bold text-[#0F3054] mb-8">
            Capturing in {countdown} seconds...
          </p>
        )}

        {/* Height Input and Upload Button */}
        <div className="w-full max-w-[600px]  p-6 mb-8">
          <div className="flex flex-col gap-4">
           
            <button
              onClick={handleUpload}
              disabled={!imgSrc || uploading || submitted}
              className="w-full px-6 py-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                "Get Measurements"
              )}
            </button>
          </div>
        </div>

        {/* Measurements Table */}
        {measurements && (
          <div className="w-full max-w-[800px] bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Body Measurements</h2>
            <table className="w-full">
              <tbody>
                {Object.entries(measurements).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-200">
                    <td className="py-2 font-bold">
                      {key.replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td className="py-2 text-right">{value.toFixed(2)} inches</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendSize;