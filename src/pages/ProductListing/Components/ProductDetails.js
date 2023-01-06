import React, { Fragment, useState, useEffect } from 'react'
import styles from '../../../../src/styles/products/productDetails.module.scss'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import no_image_found from '../../../../src/assets/images/no_image_found.png'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
// import OrderSummary from '../../cart/order-summary/orderSummary'
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
    time_to_ship,
  } = product

  const [quantityCount, setQuantityCount] = useState(0)
  const [toggleAddToCart, setToggleAddToCart] = useState()
  const { cartData, onReduceQuantity, onAddQuantity, onAddProduct } = useContext(CartContext)

  const cartItems = cartData?.items
  const [sameProviderProducts, setSameProviderProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const isProductPresent = cartItems.find(({ product }) => product.id === id)
    if (isProductPresent) {
      setToggleAddToCart(true)
      setQuantityCount(isProductPresent.quantity.count)
    } else {
      setToggleAddToCart(false)
      setQuantityCount(0)
    }
  }, [cartItems, id])
  const fetchProviderProducts = async () => {
    setLoading(true)
    setSameProviderProducts([])
    const products = await getProducts({
      collectionName: firestoreCollections.ONDC_PRODUCTS,
      query_type: queryTypes.PROVIDER_FILTER_QUERY,
      queryParam: { filterValue: provider_name },
      offset: 4,
    })

    setSameProviderProducts(products)
    setLoading(false)
  }
  useEffect(async () => {
    await fetchProviderProducts()
  }, [provider_name])

  return (
    <Fragment>
      <Navbar/>

        <div
          className={`py-20 ${
          
              styles.product_list_without_summary_wrapper
          }`}
        >
          <div className="container">
            <div className="row py-3 px-2">
            
            </div>
            <div
              className="row"
              style={{ backgroundColor: 'white', width: '90%', marginLeft: '5%' }}
            >
              <div className="col-md-12 col-lg-4 p-3 ">
                {/* PRODUCT IMAGE  */}
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
              <div className="col-md-12 col-lg-8 p-3">
                {/* NAME AND ORDERING FROM  */}
                <div>
                <div className="d-inline-flex">
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
                  <p className={`${styles.product_name} ${styles.width}`}>{product_name}</p>
                  <p className={styles.ordered_from}>
                    Ordering from <span className={styles.bold}>{provider_name}</span>
                  </p>

                  <div className="pb-2">
                    <p className={styles.product_price}>₹ {Number(price / 100).toFixed(2)}</p>
                  </div>
                  <div className="py-3">
                    {toggleAddToCart && quantityCount > 0 ? (
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
                        Add
                      </button>
                    )}
                  </div>
                  {/* ADD TO CART BUTTON  */}
                  <hr style={{ border: '1px solid #aaa' }} />
                  {/* DIVIDER  */}
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
                      <div style={{}}>
                        {typeof product?.return_window !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Return Window:</p>
                            <p className={styles.prodcut_details_value}>
                              {extractTimeInfo(return_window)}
                            </p>
                          </div>
                        ) : null}
                        {typeof product?.return_window !== 'undefined' ? (
                          <div className="d-flex align-items-center py-1">
                            <p className={styles.prodcut_details_key}>Time to Ship:</p>
                            <p className={styles.prodcut_details_value}>
                              {extractTimeInfo(time_to_ship)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </ExpendedView>
                  <hr style={{ border: '1px solid #aaa' }} />
                  <ExpendedView header={'Know Your Product'} shouldExpendedInitially={true}>
                    {typeof product?.short_desc !== 'undefined' ? (
                      <div className="d-flex align-items-center justify-content-center py-1">
                        <p className={styles.prodcut_details_key}>Product Description:</p>
                        <p className={styles.prodcut_details_value}>{product?.short_desc}</p>
                      </div>
                    ) : null}
                  </ExpendedView>
                  <hr style={{ border: '1px solid #aaa' }} />
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
        {/* {cartItems.length > 0 && <OrderSummary />} */}
    
    </Fragment>
  )
}
