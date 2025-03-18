import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import FabricInfo from "../../components/pageProps/productDetails/FabricInfo";
import axios from "axios";
import { BACKEND_URL } from "../../constants/config";

const ProductDetailsSKU = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState([]);

  useEffect(() => {
    const fetchAllItems = async () => {
        await axios.get(`${BACKEND_URL}api/cloth-by-sku/${location.state.item}/`).then((response) =>{
          setProductInfo({
            img: response?.data?.url,
            productName: response?.data?.title,
            price: response?.data?.sale_price_amount,
            color: response?.data?.color,
            badge: response?.data?.style,
            des: response?.data?.category_name,
            item: response.data
        });
        })
      }
      fetchAllItems()
      
    // console.log("productInfo : ", location.state.item);
    
    
    setPrevLocation(location.pathname);
  }, [location, productInfo]);

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          {/* <div className="h-full">
            <ProductsOnSale />
          </div> */}
          <div className="h-full xl:col-span-3">
            <img
              className="w-full h-full object-cover"
              src={productInfo.img}
              alt={productInfo.img}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
      <div className="max-w-container mx-auto px-4">
 
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
        <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <FabricInfo productInfo={productInfo} />
          </div>
          <div className="h-full xl:col-span-3">
            <img
              className="w-full h-full object-cover"
              src={productInfo?.item?.fabric_url}
              alt={productInfo?.item?.fabric_url}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSKU;
