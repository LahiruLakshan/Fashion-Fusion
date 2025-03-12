import React, { useState, useEffect } from "react";
import { client, urlFor } from "../../lib/client";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CgShoppingCart } from "react-icons/cg";
import { useStateContext } from "../../context/StateContext";
import axios from 'axios'
import {
  Modal,
  Button,
  TextField,
  Backdrop,
  Fade,
  makeStyles,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Link from 'next/link';
import { BACKEND_URL } from "../../config";

// Add these styles
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: 8,
    width: "90%",
    maxWidth: 500,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  form: {
    marginTop: theme.spacing(2),
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(2),
    },
  },
}));

const ProductDetails = ({ product }) => {
  const { 
    title, 
    sale_price_amount, 
    description, 
    average_rating, 
    reviews_count 
  } = product
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd } = useStateContext();
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fabricName: "",
    review: "",
  });
  const [fetchData, setFetchData] = useState({
    fabric_name: "",
    combined_review: "",
  });
  let care = 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    let data = JSON.stringify({
      "fabric_name": product?.fabric_name,
      "review_text": formData.review
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}api/add-fabric-review/`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios.request(config)
    .then((response) => {
      alert("User review send successfully!")
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

    setShowModal(false);
    setFormData({ fabricName: "", review: "" });
  };

  useEffect(() =>{
    if(product?.fabric_name){

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BACKEND_URL}api/fabric-summary/${product?.fabric_name}`,
        headers: { }
      };

      axios.request(config)
      .then((response) => {
        setFetchData(response.data)
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    }

  },[product?.fabric_name])

  const handleRecommendSize = () =>{
    let data = JSON.stringify({
      "user_id": 1,
      "cloth_id": product?.id
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}api/recommend-size/`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const careList = [];

  {
    for (let i = 0; i < care.length; i++) {
      careList.push(care[i].children[0].text);
    }
  }

  return (
    <div className="products">
      <div className="product-detail-container">
        <div className="product-images">
        <div className="big-image-container">
        <img src={product.url || 'https://i.pinimg.com/564x/18/7e/e2/187ee2941b72646cd6672aac11c1b97f.jpg'} alt={title} />
      </div>
          
        </div>
        <div className="product-details">
          <div className="name-and-category">
            <h3>{title}</h3>
            <span>{title}</span>
          </div>
          <div className="btn-box">
            <Link href="/tryOn">
              <button
                className="btn"
                type="button"
                onClick={() => console.log("Recommend Size...")}
              >
                Try On
              </button>
            </Link>
          </div>
          <div className="size">
            <p>SELECT SIZE</p>
            <ul>
              <li>XS</li>
              <li>S</li>
              <li>M</li>
              <li>L</li>
              <li>XL</li>
            </ul>
            <div className="btn-box">
              <button
                className="btn"
                type="button"
                onClick={() => handleRecommendSize()}
              >
                Recommend Size
              </button>
            </div>
          </div>
          <div className="quantity-desc">
            <h4>Quantity: </h4>
            <div>
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num" onClick="">
                {qty}
              </span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </div>
          </div>
          <div className="add-to-cart">
            <button
              className="btn"
              type="button"
              onClick={() => onAdd(product, qty)}
            >
              <CgShoppingCart size={20} />
              Add to Cart
            </button>
            <p className="price">${sale_price_amount}.00</p>
          </div>
        </div>
      </div>

      <div className="product-desc-container">
        <div className="desc-title">
          <div className="desc-background">Overview</div>
          <h2>Fabric Information</h2>
        </div>
        <div className="desc-details">
          <h4>FABRIC NAME</h4>
          <p>{product?.fabric_name}</p>
        </div>
        <div className="desc-care">
          <h4>FABRIC DESCRIPTION</h4>
          <p>{product?.fabric_description}</p>
        </div>
        <div className="desc-care">
          <h4>FABRIC REVIEW SUMMARY</h4>
          <p>{fetchData?.combined_review}</p>
        </div>
        <div className="btn-box">
          <button
            className="btn"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Add Fabric Review
          </button>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className={classes.modal}
      >
        <Fade in={showModal}>
          <Paper className={classes.paper}>
            <IconButton
              className={classes.closeButton}
              onClick={() => setShowModal(false)}
            >
              <Close />
            </IconButton>

            <Typography variant="h5" gutterBottom>
              Add Fabric Review
            </Typography>

            <form className={classes.form} onSubmit={handleSubmit}>
              {/* <TextField
                fullWidth
                variant="outlined"
                label="Fabric Name"
                name="fabricName"
                value={formData.fabricName}
                onChange={handleChange}
                required
              /> */}

              <TextField
                fullWidth
                variant="outlined"
                label="Write your review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Submit Review
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

export async function getStaticPaths() {
  const { data: products } = await axios.get(`${BACKEND_URL}api/clothes-all`)
  
  const paths = products.map(product => ({
    params: { id: product.id.toString() }
  }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { data: products } = await axios.get(`${BACKEND_URL}api/clothes-all`)
  const product = products.find(p => p.id.toString() === params.id)

  if (!product) return { notFound: true }

  return {
    props: { product },
    revalidate: 60 // Optional: ISR for 60 seconds
  }
}

export default ProductDetails