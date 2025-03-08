import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import {CgShoppingCart} from 'react-icons/cg'
import { useStateContext } from '../../context/StateContext';
import { 
    Modal,
    Button,
    TextField,
    Backdrop,
    Fade,
    makeStyles,
    Paper,
    Typography,
    IconButton
  } from '@material-ui/core';
  import { Close } from '@material-ui/icons';

  // Add these styles
const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      borderRadius: 8,
      width: '90%',
      maxWidth: 500,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
    form: {
      marginTop: theme.spacing(2),
      '& .MuiTextField-root': {
        marginBottom: theme.spacing(2),
      },
    },
  }));

const ProductDetails = ({products, product}) => {
    const { image, name, details, price, tags, care } = product;
    const [index, setIndex] = useState(0);
    const {decQty, incQty, qty, onAdd} = useStateContext();
    const classes = useStyles();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fabricName: '',
        review: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setShowModal(false);
        setFormData({ fabricName: '', review: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const careList = [];

    {for (let i = 0; i < care.length; i++) {
        careList.push(care[i].children[0].text)
    }}

    return (
        <div className='products'>
            <div className='product-detail-container'>
                <div className='product-images'>
                    <div className='small-images-container'>
                        {image?.map((item, ind) => (
                            <img 
                            key={ind}
                            src={urlFor(item)} 
                            className='small-image' 
                            onMouseEnter={() => setIndex(ind)} />
                        ))}
                    </div>
                    <div className='big-image-container'>
                        <img src={urlFor(image && image[index])} />
                    </div>
                </div>
                <div className='product-details'>
                    <div className='name-and-category'>
                        <h3>{name}</h3>
                        <span>{tags}</span>   
                    </div>
                    <div className='size'>
                        <p>SELECT SIZE</p>
                        <ul>
                            <li>XS</li>
                            <li>S</li>
                            <li>M</li>
                            <li>L</li>
                            <li>XL</li>
                        </ul>
                        <div className='btn-box'>
                        <button className='btn' type='button' onClick={() => console.log("Recommend Size...")}>Recommend Size</button>
                        </div>
                    </div>
                    <div className='quantity-desc'>
                        <h4>Quantity: </h4>
                        <div>
                            <span className='minus' onClick={decQty}><AiOutlineMinus /></span>
                            <span className='num' onClick=''>{qty}</span>
                            <span className='plus' onClick={incQty}><AiOutlinePlus /></span>
                        </div>
                    </div>
                    <div className='add-to-cart'>
                        <button className='btn' type='button' onClick={() => onAdd(product, qty)}><CgShoppingCart size={20} />Add to Cart</button>
                        <p className='price'>${price}.00</p>  
                    </div>
                </div>
            </div>

            <div className='product-desc-container'>
                <div className='desc-title'>
                    <div className="desc-background">
                        Overview
                    </div>
                    <h2>Fabric Information</h2>  
                </div>
                <div className='desc-details'>
                    <h4>FABRIC NAME</h4>
                    <p>Cotton</p>  
                </div>
                <div className='desc-care'>
                    <h4>PRODUCT DETAILS</h4>
                    <p>{details[0].children[0].text}</p>  
                </div>
                <div className='btn-box'>
                        <button className='btn' type='button' onClick={() => setShowModal(true)}>Add Fabric Review</button>
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
                        
                        <form 
                            className={classes.form} 
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Fabric Name"
                                name="fabricName"
                                value={formData.fabricName}
                                onChange={handleChange}
                                required
                            />
                            
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
    )
}
export default ProductDetails

export const getStaticProps = async ({params: {slug}}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery)
  
    return {
      props: { products, product }
    }
}

// Generates `/product/1` and `/product/2`
export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {
      paths,
      fallback: 'blocking'
    }
}
