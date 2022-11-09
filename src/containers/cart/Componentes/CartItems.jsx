import React, { useContext } from 'react'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import CartItemsStyles from '../../../styles/cart/cartItemsOrderSummary.module.scss'
import CrossIcon from '../../../shared/svg/cross-icon'
import { ONDC_COLORS } from '../../../shared/colors'
import ProductCard from '../../ProductListing/Components/ProductCard'
const CartItems = ({ onClose }) => {
  console.log('in cart Items')
  const { cartItems } = useContext(CartContext)
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
    </div>
  )
}
export default CartItems
