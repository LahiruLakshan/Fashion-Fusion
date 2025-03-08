import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, Typography, Paper, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const AR = () => {
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
      
      <Box elevation={3} className={classes.cameraContainer}>
        {imgSrc ? (
          <img src={imgSrc} alt="Captured" className={classes.capturedImage} />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="auto"
            className={classes.webcam}
          />
        )}
      </Box>
      <Box className={classes.captureButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => startCountdown(3)}
        >
          Take Photo in 3 Seconds
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => startCountdown(5)}
        >
          Take Photo in 5 Seconds
        </Button>
      </Box>
      {countdown > 0 && (
        <Typography className={classes.countdownText}>
          Capturing in {countdown} seconds...
        </Typography>
      )}
      {uploading && <CircularProgress />}
      {cloudinaryUrl && (
        <Typography className={classes.uploadStatus}>
          Image uploaded successfully!{" "}
          <a href={cloudinaryUrl} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </Typography>
      )}
    </div>
  );
};

export default AR;