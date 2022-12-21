import React, { Fragment, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import styles from '../../../../src/styles/cart/orderSummary.module.scss'
import { buttonTypes } from '../../../shared/button/utils'

import Button from '../../../shared/button/button'
import { ONDC_COLORS } from '../../../shared/colors'
import DropdownSvg from '../../../shared/svg/dropdonw'
import IndianRupee from '../../../shared/svg/indian-rupee'
import CartItems from './CartInfo'

export default function CartSummary({toggleCollapse,setToggleCollapse}) {
  const { cartData, setCartData, cartTotalPrice } = useContext(CartContext)
  const cartItems = cartData?.items
  const history = useHistory()

  return (
    <Fragment>
      {toggleCollapse ? (
        <CartItems onClose={() => setToggleCollapse(!toggleCollapse)} />
      ) : (
        <div className={`${styles.order_summary_background}`}>
          <div className="container h-100">
            <div className="row align-items-center h-100">
              <div className="col-xl-8 col-md-6 d-flex align-items-center">
                <div className="px-1">
                  <div
                    className={styles.collapse_button_wrapper}
                    onClick={() => setToggleCollapse(!toggleCollapse)}
                  >
                    {toggleCollapse ? (
                      <div
                        style={{
                          transform: 'rotate(180deg)',
                          transition: 'transform 0.7s',
                        }}
                      >
                        <DropdownSvg width="15" height="15" color={ONDC_COLORS.WHITE} />
                      </div>
                    ) : (
                      <div
                        style={{
                          transform: 'rotate(0)',
                          transition: 'transform 0.7s',
                        }}
                      >
                        <DropdownSvg width="15" height="15" color={ONDC_COLORS.WHITE} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-2">
                  <p className={styles.total_items_in_cart_text}>
                    Items in cart ({cartItems.length})
                  </p>
                </div>
                <div className="ms-auto">
                  <p className={styles.sub_total_text}>
                    SubTotal:
                    <span className="ps-2 pe-1">
                      <IndianRupee height="13" width="8" color={ONDC_COLORS.PRIMARYCOLOR} />
                    </span>
                    <span>{cartTotalPrice}</span>
                  </p>
                </div>
              </div>
              <div
                className={`col-xl-4 col-md-6 d-flex align-items-center ${styles.checkout_button_placement}`}
              >
                <div className="pe-3">
                  <Button
                    button_type={buttonTypes.secondary}
                    button_hover_type={buttonTypes.secondary_hover}
                    button_text="Clear Cart"
                    onClick={() => setCartData({ items: [] })}
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
          </div>
        </div>
      )}
    </Fragment>
  )
}