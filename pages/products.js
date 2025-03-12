import React from 'react'
import axios from 'axios'
import AllProducts from '../components/AllProducts'
import { BACKEND_URL } from '../config'

const Products = ({ products, trending_products }) => {
  return (
    <>
                <h2 className='Allproducts-container'>{`Ongoing Trending Style: ${trending_products?.trending_style}`}</h2>
    <div className='Allproducts-container'>

      {trending_products?.trending_items?.map(product => (
        <AllProducts key={product.id} product={product} />
      ))}
                </div>
                <h2 className='Allproducts-container'>All Products</h2>
                <div className='Allproducts-container'>

      {products?.map(product => (
        <AllProducts key={product.id} product={product} />
      ))}
    </div>
      </>
  )
}

export const getServerSideProps = async () => {
  const { data: products } = await axios.get(`${BACKEND_URL}api/clothes-all`)
  const { data: trending_products } = await axios.get(`${BACKEND_URL}api/trending-items`)



  return {
    props: { products, trending_products }
  }
}

export default Products