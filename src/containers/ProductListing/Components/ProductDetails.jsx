import React, { Fragment, useState, useEffect } from 'react'
import styles from '../../../../src/styles/products/productDetails.module.scss'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import no_image_found from '../../../../src/assets/images/no_image_found.png'

// import OrderSummary from '../../cart/order-summary/orderSummary'
import { useContext } from 'react'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import Subtract from '../../../shared/svg/subtract'
import Add from '../../../shared/svg/add'

export default function ProductDetails() {
  console.log('test')
  const location = useLocation()
  console.log(location)
  const { product } = location.state
  console.log(product)
  const {
    id,
    descriptor,
    price,
    business_name: provider_name,
    images,
    item_name: product_name,
    short_desc: product_description,
  } = product

  const [quantityCount, setQuantityCount] = useState(0)
  const [toggleAddToCart, setToggleAddToCart] = useState()
  const { cartItems, onReduceQuantity, onAddQuantity, onAddProduct } = useContext(CartContext)

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

  return (
    <Fragment>
      <div className={styles.playground_height}>
        <div
          className={`py-2 ${
            cartItems.length > 0
              ? styles.product_list_with_summary_wrapper
              : styles.product_list_without_summary_wrapper
          }`}
        >
          <div className="container">
            <div className="row py-3 px-2">
              <div className="d-inline-flex">
                <Link to={{ pathname: '/application/products' }}>
                  <p className={styles.back_text}>back</p>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-lg-4 p-3">
                {/* PRODUCT IMAGE  */}
                <div className={styles.product_img_container}>
                  <img
                    src={''}
                    alt={product_name}
                    width="300"
                    height="300"
                    className={styles.product_img}
                    onError={(event) => {
                      event.target.onerror = null
                      event.target.src = no_image_found
                    }}
                  />
                </div>
              </div>
              <div className="col-md-12 col-lg-8 p-3">
                {/* NAME AND ORDERING FROM  */}
                <div className="pb-2">
                  <p className={`${styles.product_name} ${styles.width}`}>{product_name}</p>
                  <p className={styles.ordered_from}>
                    Ordering from <span className={styles.bold}>{provider_name}</span>
                  </p>
                </div>
                {/* DESCRIPTION  */}
                <div className="pb-3">
                  <p className={`${styles.product_description} ${styles.width}`}>
                    {product_description}
                  </p>
                </div>
                {/* PRICE  */}
                <div className="pb-2">
                  <p className={styles.product_price}>₹ {Number(price).toFixed(2)}</p>
                </div>
                {/* DIVIDER  */}
                <div className={styles.width}>
                  <hr style={{ border: '1px solid #aaa' }} />
                  {/* AVAILABLE QUANTITY  */}
                  {Number(product?.AvailableQuantity > 0) ? (
                    <div className="d-flex align-items-center py-1">
                      <p className={styles.prodcut_details_key}>Available Quantity:</p>
                      <p className={styles.prodcut_details_value}>{product?.AvailableQuantity}</p>
                    </div>
                  ) : null}
                  {/* RETURNABLE  */}
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
                    <div className="d-flex align-items-center py-1">
                      <p className={styles.prodcut_details_key}>Cash On Delivery:</p>
                      <p className={styles.prodcut_details_value}>
                        {product?.cod_available == true ? 'Yes' : 'No'}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* ADD TO CART BUTTON  */}
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

                          product,
                        })
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {cartItems.length > 0 && <OrderSummary />} */}
      </div>
    </Fragment>
  )
}
