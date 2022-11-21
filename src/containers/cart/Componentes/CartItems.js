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
  const { cartData, setCartData } = useContext(CartContext)
  const cartItems = cartData?.items
  const history = useHistory()
  console.log(cartItems)
  return (
    <div className={CartItemsStyles.cart_items_order_summary_wrapper}>
      <div className={CartItemsStyles.header}>
        <p className={CartItemsStyles.label}>Cart</p>
        <div className="ms-auto">
          <CrossIcon
            width="25"
            height="25"
            style={{ cursor: 'pointer' }}
            color={ONDC_COLORS.SECONDARYCOLOR}
            onClick={onClose}
          />
        </div>
      </div>
      <hr />
      <div className={CartItemsStyles.cart_items_wrapper}>
        {cartItems.map((item) => {
          return (
            <div className={CartItemsStyles.item_wrapper}>
              <ProductCard product={item.product} />
            </div>
          )
        })}
      </div>
      <hr />
      <div className={CartItemsStyles.itemCount}>
        <p className={CartItemsStyles.label1}>Total Items</p>
        <p className={CartItemsStyles.label1}>{cartItems.length}</p>
      </div>
      <div className={CartItemsStyles.itemCount}>
        <p className={CartItemsStyles.label1}>Total Amount </p>
        <p className={CartItemsStyles.label1}>{300}</p>
      </div>
      <hr />
      <div className={CartItemsStyles.bottomButtons}>
        <div className="pe-3">
          <Button
            button_type={buttonTypes.secondary}
            button_hover_type={buttonTypes.secondary_hover}
            button_text="Clear Cart"
            onClick={() => setCartData({})}
          />
        </div>
        <div className="pe-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Checkout"
            onClick={() => history.push('/checkout')}
          />
        </div>
      </div>
    </div>
  )
}
export default CartItems
