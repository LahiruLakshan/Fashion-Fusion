import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { 
  Button, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardContent
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BACKEND_URL } from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    textAlign: "center",
  },
  cameraContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "940px",
    marginBottom: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
  },
  webcam: {
    width: "100%",
    maxWidth: "640px",
    borderRadius: "12px",
    boxShadow: theme.shadows[5],
  },
  captureButtonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    flexWrap: "wrap",
  },
  capturedImage: {
    width: "100%",
    maxWidth: "640px",
    borderRadius: "12px",
    boxShadow: theme.shadows[5],
  },
  formContainer: {
    marginTop: theme.spacing(4),
    width: "100%",
    maxWidth: "600px",
  },
  measurementCard: {
    marginTop: theme.spacing(4),
    width: "100%",
    maxWidth: "800px",
  },
  measurementTable: {
    marginTop: theme.spacing(2),
  },
  tableCell: {
    fontWeight: 'bold',
  },
  countdownText: {
    marginTop: theme.spacing(2),
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    textAlign: "center",
  },
  centeredContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

const AR = () => {
  const classes = useStyles();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [height, setHeight] = useState('');
  const [measurements, setMeasurements] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min); // Ensure min is an integer
    max = Math.floor(max); // Ensure max is an integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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
    if (!imgSrc || !height) {
      alert("Please capture an image and enter height!");
      return;
    }

    setUploading(true);
    
    try {
      // Convert data URL to Blob
      const blob = await fetch(imgSrc).then(res => res.blob());
      const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("height", height);
      formData.append("user_id", 1); // Replace with actual user ID

      const response = await axios.post(
        `${BACKEND_URL}api/get-measurements/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Body Measurements Scanner
      </Typography>
      
      <div className={classes.centeredContent}>
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
            disabled={!!imgSrc}
          >
            Take Photo in 3 Seconds
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => startCountdown(5)}
            disabled={!!imgSrc}
          >
            Take Photo in 5 Seconds
          </Button>
        </Box>

        {countdown > 0 && (
          <Typography className={classes.countdownText}>
            Capturing in {countdown} seconds...
          </Typography>
        )}

        <Paper className={classes.formContainer} elevation={3}>
          <Box p={3}>
            <TextField
              fullWidth
              label="Your Height (in inches)"
              variant="outlined"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              disabled={submitted}
              InputProps={{
                endAdornment: <Typography variant="body2">in</Typography>
              }}
            />
            
            <Box mt={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUpload}
                disabled={!height || !imgSrc || uploading || submitted}
              >
                {uploading ? <CircularProgress size={24} /> : 'Get Measurements'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {measurements && (
          <Card className={classes.measurementCard}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Your Body Measurements
              </Typography>
              <TableContainer>
                <Table className={classes.measurementTable}>
                  <TableBody>
                    {Object.entries(measurements).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className={classes.tableCell}>
                          {key.replace(/\b\w/g, l => l.toUpperCase())}
                        </TableCell>
                        <TableCell align="right">
                          {value.toFixed(2)} inches
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AR;