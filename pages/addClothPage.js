import React, { useState } from 'react';
import { 
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { BACKEND_URL } from '../config';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(4),
  },
}));

const steps = ['Add Clothing Details', 'Add Size Measurements'];

const AddClothPage = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [clothId, setClothId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Clothing Details Form State
  const [clothData, setClothData] = useState({
    sku: '',
    url: '',
    title: '',
    color: '',
    sale_price_amount: '',
    retail_price_amount: '',
    discount_percentage: '',
    category_name: '',
    description: '',
    reviews_count: '',
    average_rating: '',
    style: ''
  });

  // Size Measurements Form State
  const [sizeData, setSizeData] = useState({
    size: '',
    chest_min: '',
    chest_max: '',
    neck_min: '',
    neck_max: '',
    shoulder_width_min: '',
    shoulder_width_max: '',
    arm_length_min: '',
    arm_length_max: ''
  });

  const handleClothChange = (e) => {
    setClothData({ ...clothData, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (e) => {
    setSizeData({ ...sizeData, [e.target.name]: e.target.value });
  };

  const handleSubmitAll = (e) => {
    handleSubmitCloth();
    handleSubmitSize()
  };

  const handleSubmitCloth = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}api/clothes-add/`, {
        ...clothData,
        sale_price_with_symbol: `$${clothData.sale_price_amount}`,
        retail_price_with_symbol: `$${clothData.retail_price_amount}`
      });
      
      
      setClothId(response.data.id);
      setActiveStep(1);
      setSnackbar({ open: true, message: 'Clothing details saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving clothing details', severity: 'error' });
      console.error('Error submitting cloth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSize = async () => {
    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}api/add_shirt_size/`, {
        ...sizeData,
        cloth: clothId
      });
      
      setSnackbar({ open: true, message: 'Size measurements added successfully!', severity: 'success' });
      // Reset forms
      setActiveStep(0);
      setClothData({
        sku: '',
        url: '',
        title: '',
        color: '',
        sale_price_amount: '',
        retail_price_amount: '',
        discount_percentage: '',
        category_name: '',
        description: '',
        reviews_count: '',
        average_rating: '',
        style: ''
      });
      setSizeData({
        size: '',
        chest_min: '',
        chest_max: '',
        neck_min: '',
        neck_max: '',
        shoulder_width_min: '',
        shoulder_width_max: '',
        arm_length_min: '',
        arm_length_max: ''
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving size measurements', severity: 'error' });
      console.error('Error submitting size data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateClothForm = () => {
    return (
      clothData.sku &&
      clothData.url &&
      clothData.title &&
      clothData.color &&
      clothData.sale_price_amount &&
      clothData.retail_price_amount &&
      clothData.discount_percentage &&
      clothData.category_name &&
      clothData.description
    );
  };

  const validateSizeForm = () => {
    return (
      sizeData.size &&
      sizeData.chest_min &&
      sizeData.chest_max &&
      sizeData.neck_min &&
      sizeData.neck_max &&
      sizeData.shoulder_width_min &&
      sizeData.shoulder_width_max &&
      sizeData.arm_length_min &&
      sizeData.arm_length_max
    );
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        )}

        {!loading && activeStep === 0 && (
          <form>
            <Typography variant="h6" gutterBottom>
              Clothing Details
            </Typography>
            
            <Grid container spacing={3}>
              {/* Clothing Details Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={clothData.sku}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product URL"
                  name="url"
                  value={clothData.url}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={clothData.title}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  name="color"
                  value={clothData.color}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Style"
                  name="style"
                  value={clothData.style}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Sale Price ($)"
                  name="sale_price_amount"
                  type="number"
                  value={clothData.sale_price_amount}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Retail Price ($)"
                  name="retail_price_amount"
                  type="number"
                  value={clothData.retail_price_amount}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Discount (%)"
                  name="discount_percentage"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={clothData.discount_percentage}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category_name"
                  value={clothData.category_name}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reviews Count"
                  name="reviews_count"
                  type="number"
                  value={clothData.reviews_count}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Average Rating"
                  name="average_rating"
                  type="number"
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                  value={clothData.average_rating}
                  onChange={handleClothChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={clothData.description}
                  onChange={handleClothChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitCloth}
                  disabled={!validateClothForm()}
                >
                  Next: Add Size Measurements
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {!loading && activeStep === 1 && (
          <form>
            <Typography variant="h6" gutterBottom>
              Size Measurements (in cm)
            </Typography>
            
            <Grid container spacing={3}>
              {/* Size Measurements Fields */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Size"
                  name="size"
                  value={sizeData.size}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Chest Min"
                  name="chest_min"
                  type="number"
                  value={sizeData.chest_min}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Chest Max"
                  name="chest_max"
                  type="number"
                  value={sizeData.chest_max}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Neck Min"
                  name="neck_min"
                  type="number"
                  value={sizeData.neck_min}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Neck Max"
                  name="neck_max"
                  type="number"
                  value={sizeData.neck_max}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shoulder Width Min"
                  name="shoulder_width_min"
                  type="number"
                  value={sizeData.shoulder_width_min}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shoulder Width Max"
                  name="shoulder_width_max"
                  type="number"
                  value={sizeData.shoulder_width_max}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Arm Length Min"
                  name="arm_length_min"
                  type="number"
                  value={sizeData.arm_length_min}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Arm Length Max"
                  name="arm_length_max"
                  type="number"
                  value={sizeData.arm_length_max}
                  onChange={handleSizeChange}
                  required
                />
              </Grid>
              <Grid item xs={12} className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  style={{ marginRight: '1rem' }}
                  onClick={() => setActiveStep(0)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitSize}
                  disabled={!validateSizeForm()}
                >
                  Submit All Data
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddClothPage;