import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import CartItemsStyles from '../../../styles/cart/cartItemsOrderSummary.module.scss'
import CrossIcon from '../../../shared/svg/cross-icon'
import { ONDC_COLORS } from '../../../shared/colors'
import { buttonTypes } from '../../../shared/button/utils'

import Button from '../../../shared/button/button'
import ProductCard from '../../ProductListing/Components/ProductCard'
const CartItems = ({ onClose }) => {
  console.log('in cart Items')
  const { cartData, setCartData, cartTotalPrice } = useContext(CartContext)
  const cartItems = cartData?.items
  const history = useHistory()
  console.log(cartItems)
  return (
    <div className={CartItemsStyles.overlay}>
      <div className={CartItemsStyles.popup_card}>
        <div style={{ overflow: 'auto' }}>
          <div className={CartItemsStyles.header}>
            <p className={CartItemsStyles.label}>Your Shopping Bag</p>
            <div className="ms-auto">
              <CrossIcon
                width="45"
                height="45"
                style={{ cursor: 'pointer', padding: '5px' }}
                color={ONDC_COLORS.SECONDARYCOLOR}
                onClick={onClose}
              />
            </div>
          </div>

          <div className={CartItemsStyles.cart_items_wrapper}>
            <div className="container">
              <div className={`row pe-2`}>
                {cartItems.map((item) => {
                  return (
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 p-2">
                      <ProductCard product={item.product} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <hr />
        </div>
        <div>
          <div className={CartItemsStyles.itemCount}>
            <p className={CartItemsStyles.label1}>Total Amount </p>
            <p className={CartItemsStyles.label1}>{cartTotalPrice}</p>
          </div>
          <div className={CartItemsStyles.bottomButtons}>
            <Button
              button_type={buttonTypes.secondary}
              button_hover_type={buttonTypes.secondary_hover}
              button_text="Clear Cart"
              onClick={() => setCartData({})}
            />

            <Button
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Checkout"
              onClick={() => history.push('/checkout')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default CartItems
