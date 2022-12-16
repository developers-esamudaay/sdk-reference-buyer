import React, { useContext, useEffect, useState } from 'react'
import styles from '../../../../src/styles/products/productCard.module.scss'
import no_image_found from '../../../../src/assets/images/no_image_found.png'
import IndianRupee from '../../../shared/svg/indian-rupee'
import Subtract from '../../../shared/svg/subtract'
import Add from '../../../shared/svg/add'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import { Link } from 'react-router-dom'
import no_delivery from "../../../../src/assets/images/no_delivery.png"
import Alert from 'react-alert'
import haversine from 'haversine-distance'

export default function ProductCard(props) {
  const { product, show_quantity_button = true } = props


  const { cartData, onAddProduct, onAddQuantity, onReduceQuantity } = useContext(CartContext)

  const cartItems = cartData?.items
  const {
    item_name: product_name,
    price,
    business_name: provider_name,
    images,
    id,
    business_id: provider_id,
    locations
  } = product

  
  const [quantityCount, setQuantityCount] = useState(0)
  //count of item of this product avaailable in cart
  const [toggleAddToCart, setToggleAddToCart] = useState()
  
  const defaultLatLng=0.00
const defaultRadius=6666*1000;

  const userLocation={
    latitude:sessionStorage.getItem("latitude"),
    longitude:sessionStorage.getItem("longitude")
  }
  const providerLocation={
    latitude:Array.isArray(locations)&&locations.length>0?locations[0]?.lat:defaultLatLng,
    longitude:Array.isArray(locations)&&locations.length>0?locations[0]?.lon:defaultLatLng
  }
  const userProviderDistance=haversine(userLocation,providerLocation)
  const deliveryRadius= Array.isArray(locations)&&locations.length>0?locations[0]?.delivery_radius?.radius:defaultRadius;;
 //
const inDeliveryDistance=userProviderDistance<(parseInt(deliveryRadius)*1000)

  const onErrorAddToCart = (error) => {
    alert(error)
  }
  //true if paroduct is available in cart
  useEffect(() => {
    
    const isProductPresent = cartItems?.find(({ product }) => product.id === id)
    if (isProductPresent) {
      setToggleAddToCart(true)
      setQuantityCount(isProductPresent.quantity.count)
    } else {
      setToggleAddToCart(false)
      setQuantityCount(0)
    }
  }, [cartItems, id])

  // check product is available is cart or not and set quantity value if product is in cart
  return (
    <div className={`${styles.product_card_background}`}>
      {
        // !inDeliveryDistance&&(   <div className={styles.card__overlay} style={{opacity:inDeliveryDistance?0:0.9}}>
        //   <div style={{marginTop:"50%",opacity:1}}>
        //   <img
        //         src={no_delivery}
      
        //         alt={product_name}
        //         width="80"
        //         height="80"
        //        style={{marginLeft:"40%"}}
        //         onError={(event) => {
        //           event.target.onerror = null
        //           event.target.src = no_image_found
        //         }}
        //       />
        //   <p className={styles.no_delivery_text}> Delivery for this product is not available at your location</p>
            
        //   </div>
        // </div>)
      }
    
      <div className={styles.product_img_container}>
        <img
          src={images?.length > 0 ? images[0] : no_image_found}
          style={{ filter:!inDeliveryDistance? "grayscale(100%)":"" }}
          alt={product_name}
          width="200"
          height="200"
          className={styles.product_img}
          onError={(event) => {
            event.target.onerror = null
            event.target.src = no_image_found
          }}
        />

        {/* products image */}
      </div>
      <div className="px-3">
        <div className={styles.product_name_and_description_wrapper}>
          <Link
            to={{
              pathname: `/products/${id}`,
              state: {
                product,
                price,
              },
            }}
            className={styles.product_name}
            title={product_name}
          >
            {product_name}
          </Link>
          {/* products name */}
          {props.fromScreen !== 'business' && (
            <Link
              className={styles.ordered_from}
              to={{
                pathname: `/business/${provider_id}`,
              }}
            >
              Ordering from <span className={styles.bold}>{provider_name}</span>
            </Link>
          )}

          {/* seller name */}
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: '3px',
            }}
          >
            <div className="pe-2">
              <IndianRupee width="10" height="14" />
            </div>
            <p className={styles.product_price}>{Number(price / 100).toFixed(2)}</p>
          </div>
          {/* products price */}
          {show_quantity_button && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '12px',
              }}
            >
              {
                inDeliveryDistance?( <> {toggleAddToCart && quantityCount > 0 ? (
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
                        onErrorAddToCart,
                      })
                    }}
                  >
                    Add
                  </button>
                )}</>):(
                  <div style={{display:"flex",justifyContent:"center"}}>
                  <p className={styles.no_delivery_text}>Delivery out of range</p>
                  </div>
                )
              }
              
             


            </div>
            // add or remove cart button
          )}
        </div>
      </div>
    </div>
  )
}
