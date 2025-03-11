import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, Typography, Paper, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CameraKitComponent from "../components/CameraKitComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  cameraContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "940px",
    marginBottom: theme.spacing(4),
  },
  webcam: {
    width: "100%",
    borderRadius: "12px",
    boxShadow: theme.shadows[5],
  },
  captureButtonContainer: {
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  capturedImage: {
    width: "100%",
    maxWidth: "640px",
    borderRadius: "12px",
    boxShadow: theme.shadows[5],
  },
  countdownText: {
    marginTop: theme.spacing(2),
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  uploadStatus: {
    marginTop: theme.spacing(2),
    color: theme.palette.success.main,
  },
}));

const TryOn = () => {
  const classes = useStyles();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);

  const capture = () => {
    console.log("capturing");
    
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    uploadImageToCloudinary(imageSrc);
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

  const uploadImageToCloudinary = async (image) => {
    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      if (data.url) {
        setCloudinaryUrl(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={classes.root}>
      
      
          {/* <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="75%"
            height="50%"
            className={classes.webcam}
          /> */}

<div style={{ width: '100vw', height: '100vh' }}>
      <CameraKitComponent />
    </div>
     
    </div>
  );
};

export default TryOn;