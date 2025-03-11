import React from 'react'
import Link from 'next/link'

const AllProducts = ({ product }) => {
  return (
    <div className='product-card'>
      <Link href={`/product/${product.id}`}>
        <div className='Allproduct-card'>
          {/* Add actual image URL from API when available */}
          <img src={product.url} width={250} height={270} />

          {/* <img src={product.url} className='image-placeholder' style={{ width: 250, height: 270 }} /> */}
          <h3 className='product-title'>{product.title}</h3>
          <p className='product-price'>${product.sale_price_amount}</p>
          <div className='product-meta'>
            <span className='rating'>⭐ {product.average_rating}</span>
            <span className='reviews'>({product.reviews_count})</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default AllProducts