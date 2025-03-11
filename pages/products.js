import React from 'react'
import axios from 'axios'
import AllProducts from '../components/AllProducts'
import { BACKEND_URL } from '../config'

const Products = ({ products }) => {
  return (
    <div className='Allproducts-container'>
      {products?.map(product => (
        <AllProducts key={product.id} product={product} />
      ))}
    </div>
  )
}

export const getServerSideProps = async () => {
  const { data: products } = await axios.get(
    `${BACKEND_URL}api/clothes-all`
  )

  return {
    props: { products }
  }
}

export default Products