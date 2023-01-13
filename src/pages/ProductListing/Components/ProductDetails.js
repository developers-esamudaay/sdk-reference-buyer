import React, { Fragment, useState, useEffect } from 'react'
import styles from '../../../../src/styles/products/productDetails.module.scss'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import no_image_found from '../../../../src/assets/images/no_image_found.png'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import { useContext } from 'react'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import Subtract from '../../../assets/icons/Subtract'
import Add from '../../../assets/icons/Add'
import ExpendedView from '../../../sharedComponents/expededView/ExpededView'
import { getProducts } from '../../../data/firbaseCalls'
import { queryTypes } from '../../../constants/queryTypes'
import ProductCard from './ProductCard'
import { firestoreCollections } from '../../../constants/firestoreCollections'
import Navbar from "../../../sharedComponents/navBar/Navbar"
import CartInfo from '../../cart/Components/CartInfo'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
import haversine from 'haversine-distance'
// extract time info from time String
const extractTimeInfo = (time) => {
  let numberValue = ''
  let stringValue
  for (let i = 0; i < time?.length??0; i++) {
    if (time[i] === 'P' || time[i] === 'T') {
      continue
    } else if (time[i] >= '0' && time[i] <= '9') {
      numberValue = numberValue + time[i]
    }
  }
  if (time[time.length - 1] == 'D') {
    stringValue = 'days'
  } else if (time[time.length - 1] == 'H') {
    stringValue = 'hours'
  }
  return numberValue + ' ' + stringValue
}
export default function ProductDetails() {
  const location = useLocation()

  const { product } = location.state


  const {
    id,
    descriptor,
    price,
    business_name: provider_name,
    images,
    item_name: product_name,
    short_desc: product_description,
    return_window,
    time_to_ship,locations
  } = product

  const [quantityCount, setQuantityCount] = useState(0)
  const [toggleAddToCart, setToggleAddToCart] = useState()
  const { cartData, onReduceQuantity, onAddQuantity, onAddProduct,showCartInfo,setShowCartInfo } = useContext(CartContext)
  const {currentLocation} =useContext(AddressContext)
  const cartItems = cartData?.items
  const [sameProviderProducts, setSameProviderProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const defaultLatLng=0.00
const defaultRadius=6666*1000000;

  const userLocation={
    latitude:currentLocation?.lat,
    longitude:currentLocation?.lon
  }
  const providerLocation={
    latitude:Array.isArray(locations)&&locations.length>0?locations[0]?.lat:defaultLatLng,
    longitude:Array.isArray(locations)&&locations.length>0?locations[0]?.lon:defaultLatLng
  }
  const userProviderDistance=haversine(userLocation,providerLocation)
  const deliveryRadius= Array.isArray(locations)&&locations.length>0?locations[0]?.delivery_radius?.radius:defaultRadius;
 
const inDeliveryDistance=userProviderDistance<(parseInt(deliveryRadius)*1000)


  useEffect(() => {
    //check if product is already in cart 
    const isProductPresent = cartItems.find(({ product }) => product.id === id)
    if (isProductPresent) {
      setToggleAddToCart(true)
      setQuantityCount(isProductPresent.quantity.count)
    } else {
      setToggleAddToCart(false)
      setQuantityCount(0)
    }
  }, [cartItems, id])
 

  return (
    <Fragment>
      <Navbar fromProductDetailsPage/>

        <div
          className={`py-20 ${
          
              styles.product_list_without_summary_wrapper
          }`}
        >
          <div className={`container ${styles.full_container}`} >
           
            <div
              className="row"

            >
               {/* navigation routes */}
                 <div className="d-inline-flex ">
                <Link to={{ pathname: '/products' }}>
                  <p className={styles.back_text}>Products</p>
                </Link>
                {">>"}
                <Link to={{ pathname: `/products/${id}`,state: {
                product,
                price,
              }, }}>
                  <p className={styles.back_text}>{product_name}</p>
                </Link>
              </div>

              
              <div className="col-md-12 col-lg-5 p-3 ">
                {/* PRODUCT IMAGE  */}
                <div className={styles.left_container}>
                <Carousel axis={'horizontal'}>
                  {images.map((image) => {
                    return (
                      <div className={styles.product_img_container}>
                        <img
                          src={image}
                          alt={product_name}
                          className={styles.product_img}
                          onError={(event) => {
                            event.target.onerror = null
                            event.target.src = no_image_found
                          }}
                        />
                      </div>
                    )
                  })}
                </Carousel>
                </div>
              </div>
              <div className="col-md-12 col-lg-6 p-3">
                {/* NAME AND ORDERING FROM  */}
                <div className={styles.right_container} >
             
                  <p className={`${styles.product_name} `}>{product_name}</p>
                  <p className={styles.ordered_from}>
                    Ordering from <span className={styles.bold}>{provider_name}</span>
                  </p>

                  <div className="pb-2">
                    <p className={styles.product_price}>₹ {Number(price / 100).toFixed(2)}</p>
                  </div>
                  {/* if item is in delivery range then show add to cart button */}
                  <div className="py-3">
                  {
                inDeliveryDistance?(  <> {toggleAddToCart && quantityCount > 0 ? (
                  <div className={styles.quantity_count_wrapper}>
                    <div
                      className={`${styles.subtract_svg_wrapper} d-flex align-items-center justify-content-center`}
                      onClick={() => {
                        setQuantityCount(quantityCount - 1)
                        onReduceQuantity(id)
                        if (quantityCount - 1 === 0) {
                          setToggleAddToCart(false)
                          return
                        }
                      }}
                    >
                      <Subtract width="13" classes={styles.subtract_svg_color} />
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                      <p className={styles.quantity_count}>{quantityCount}</p>
                    </div>
                    <div
                      className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                      onClick={() => {
                        setQuantityCount((quantityCount) => quantityCount + 1)
                        onAddQuantity(id)
                      }}
                    >
                      <Add width="13" height="13" classes={styles.add_svg_color} />
                    </div>
                  </div>
                ) : (
                  <button
                    className={styles.add_to_cart_button}
                    onClick={() => {
                      setToggleAddToCart(true)
                      setQuantityCount((quantityCount) => quantityCount + 1)
                      onAddProduct({
                        id,
                        quantity: { count: quantityCount + 1 },
                        location_id: product?.location_id,
                        product,
                   
                      })
                    }}
                  >
                    Add To Cart
                  </button>
                )}</>):(
                  <div className={styles.no_delivery}>
                  <p className={styles.no_delivery_text}>Delivery out of range</p>
                  </div>
                )
              }
                  </div>
                  {/* ADD TO CART BUTTON  */}
                {/* DIVIDER  */}
                  <hr style={productStyle.lineStyle} />
                 
                  <ExpendedView header={'Product Details'} shouldExpendedInitially={true}>
                    <div className={styles.width}>
                      <div style={{}}>
                        {typeof product?.returnable !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Returnable:</p>
                            <p className={styles.prodcut_details_value}>
                              {product?.returnable == true ? 'Yes' : 'No'}
                            </p>
                          </div>
                        ) : null}
                        {/* CANCELABLE  */}
                        {typeof product?.cancellable !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Cancelable:</p>
                            <p className={styles.prodcut_details_value}>
                              {product?.cancellable == true ? 'Yes' : 'No'}
                            </p>
                          </div>
                        ) : null}
                        {/* COD  */}
                        {typeof product?.cod_available !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1 ">
                            <p className={styles.prodcut_details_key}>Cash On Delivery:</p>
                            <p className={styles.prodcut_details_value}>
                              {product?.cod_available == true ? 'Yes' : 'No'}
                            </p>
                          </div>
                        ) : null}
                      </div>
                         {/* Return Window  */}
                      <div style={{}}>
                        {typeof product?.return_window !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Return Window:</p>
                            <p className={styles.prodcut_details_value}>
                              {extractTimeInfo(return_window)}
                            </p>
                          </div>
                        ) : null}
                          {/* Shipping Time */}
                        {typeof product?.return_window !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Time to Ship:</p>
                            <p className={styles.prodcut_details_value}>
                              {extractTimeInfo(time_to_ship)}
                            </p>
                          </div>
                        ) : null}
                           {/* Category */}
                               {typeof product?.category !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Category:</p>
                            <p className={styles.prodcut_details_value}>
                              {product?.category}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </ExpendedView>
                  <hr style={productStyle.lineStyle} />
                  <ExpendedView header={'Know Your Product'} shouldExpendedInitially={true}>
                    {typeof product?.short_desc !== 'undefined' ? (
                      <div className="d-flex align-items-center justify-content-center py-1">
                        <p className={styles.prodcut_details_key}>Product Description:</p>
                        <p className={styles.prodcut_details_value}>{product?.short_desc}</p>
                      </div>
                    ) : null}
                  </ExpendedView>
                  <hr style={productStyle.lineStyle} />
                  <ExpendedView header={'Seller Detalis'} shouldExpendedInitially={true}>
                    {typeof product?.business_name !== 'undefined' ? (
                      <div className="d-flex align-items-center justify-content-center py-1">
                        <p className={styles.prodcut_details_key}>Seller Name:</p>
                        <p className={styles.prodcut_details_value}>{product?.business_name}</p>
                      </div>
                    ) : null}
                    {typeof product?.bpp_id !== 'undefined' ? (
                      <div className="d-flex align-items-center justify-content-center py-1">
                        <p className={styles.prodcut_details_key}>BPP_ID:</p>
                        <p className={styles.prodcut_details_value}>{product?.bpp_id}</p>
                      </div>
                    ) : null}
                    <div className="d-flex align-items-center justify-content-center py-1">
                      <Link
                          to={{
                            pathname: `/business/${product?.business_id}`,
                          }}
                        title={product_name}
                      >
                        {`view more products from ${product?.business_name}`}
                      </Link>
                    </div>
                  </ExpendedView>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showCartInfo&&<CartInfo onClose={()=>setShowCartInfo(false)}/>}

    
    </Fragment>
  )
}
const productStyle={
  lineStyle:
    { border: '1px solid #aaa' }
  
}