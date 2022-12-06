import React, { useContext, useEffect, useState } from 'react'
import styles from '../../../../src/styles/products/productCard.module.scss'
import no_image_found from '../../../../src/assets/images/no_image_found.png'
import IndianRupee from '../../../shared/svg/indian-rupee'
import Subtract from '../../../shared/svg/subtract'
import Add from '../../../shared/svg/add'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import { Link } from 'react-router-dom'
import Alert from 'react-alert'

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
  } = product
  console.log(product)
  const [quantityCount, setQuantityCount] = useState(0)
  //count of item of this product avaailable in cart
  const [toggleAddToCart, setToggleAddToCart] = useState()
  const onErrorAddToCart = (error) => {
    alert(error)
  }
  //true if paroduct is available in cart
  useEffect(() => {
    console.log('cartitems', cartItems)
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
      <div className={styles.product_img_container}>
        <img
          src={images?.length > 0 ? images[0] : no_image_found}
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

          {/* provider name */}
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
                      onErrorAddToCart,
                    })
                  }}
                >
                  Add
                </button>
              )}
            </div>
            // add or remove cart button
          )}
        </div>
      </div>
    </div>
  )
}
