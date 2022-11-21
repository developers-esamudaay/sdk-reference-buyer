import React, { useEffect, useContext, useState } from 'react'

import { checkoutSteps } from '../../../../src/constants/checkoutSteps'
import styles from '../../../../src/styles/cart/cartView.module.scss'
import { getCurrentStep } from '../utils'
import { ONDC_COLORS } from '../../../shared/colors'
import {
  createCart,
  getVerificationCartData,
  createOrder,
  getOrderDetails,
} from '../../../data/firbaseCalls'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
import Checkmark from '../../../shared/svg/checkmark'
import Button from '../../../shared/button/button'
import Loading from '../../../shared/loading/loading'
import { verfyCartUsingSdk, confirmOrderUsingSdk } from '../../../data/apiCall'
import { buttonTypes } from '../../../shared/button/utils'
import uuid from 'react-uuid'
import TransactionStatusModal from './TransactionStatusModal'
import { transactionStatusValues } from '../../../constants/transactionStatus'
import { delay } from '../../../commonUtils'
import ErrorMessage from '../../../shared/error-message/errorMessage'
const CartStatus = (props) => {
  const [loading, setLoading] = useState(false)
  const [cartVerificationStatus, setCartVerificationStatus] = useState('')
  const [cartVerificationError, setCartVerificationError] = useState('')
  const [chargesBreakup, setChargesBreakup] = useState([])
  const [itemCostBreakup, setItemCostBreakup] = useState([])
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const { cartData } = useContext(CartContext)
  const { selectedBillingAddress, selectedDeliveryAddress } = useContext(AddressContext)
  const isStepCompleted = props.currentActiveStep.current_active_step_number > 2
  const isCurrentStep = props.currentActiveStep.current_active_step_number === 2
  const [totalOrderPrice, setTotalOrderPrice] = useState(0)
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('')
  console.log(showTransactionModal)
  const initializrOrder = async () => {
    setInitializeOrderLoading(true)
    const id = uuid()
    setOrderId(id)
    try {
      await createOrder(id)

      const orderPayload = {
        cart_id: cartData.cart_id,
        order_id: id,
        city_code: 'std:080',
        payment_info: {
          uri: 'https://ondc.transaction.com/payment',
          tl_method: 'http/get',
          params: {
            currency: 'INR',
            transaction_id: '0125836177',
            transaction_status: 'captured',
            amount: '' + totalOrderPrice,
          },
        },
      }
      await confirmOrderUsingSdk(orderPayload)
      await getOrderDetails(orderId)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(async () => {
    if (isCurrentStep) {
      setLoading(true)
      const payload = {
        ...cartData,
        items: cartData.items.map((item) => {
          return { quantity: item?.quantity?.count, id: item.id, location_id: item?.location_id }
        }),
        fulfillment_type: 'DA_DELIVERY',
        billing_info: {
          name: selectedBillingAddress?.name,
          email: selectedBillingAddress?.email,
          phone: selectedBillingAddress?.phone,
          address: {
            name: 'HOME',
            door: selectedBillingAddress?.door,

            city: selectedBillingAddress?.city,
            state: selectedBillingAddress?.state,
            country: 'India',
            area_code: selectedBillingAddress?.areaCode,
          },
        },
        delivery_info: {
          location: {
            lat: 12.956399,
            lon: 77.636803,
          },
          address: {
            name: 'WORK',
            door: selectedDeliveryAddress?.door,
            locality: selectedDeliveryAddress?.door,
            city: selectedDeliveryAddress?.city,
            state: selectedDeliveryAddress?.state,
            country: 'India',
            area_code: selectedDeliveryAddress?.areaCode,
          },
        },
        customer_info: {
          name: selectedDeliveryAddress?.name,
          phone: selectedDeliveryAddress?.phone,
          email: selectedDeliveryAddress?.email,
        },
      }
      console.log(selectedBillingAddress)
      console.log(selectedDeliveryAddress)
      try {
        await createCart(payload)
        const res = await verfyCartUsingSdk(payload)
        console.log(res)
        if (res.status === 200 && res?.data?.message?.ack?.status === 'ACK') {
          console.log('test')
          await delay(3000)
          const response = await getVerificationCartData(payload?.cart_id)
          const cartVerifiedData = response.data()
          console.log(cartVerifiedData)
          setCartVerificationStatus(cartVerifiedData?.status)
          setCartVerificationError(cartVerifiedData?.error)
          setChargesBreakup(cartVerifiedData?.cost?.breakup?.filter((val) => val.type !== 'item'))
          setItemCostBreakup(cartVerifiedData?.cost?.breakup?.filter((val) => val.type === 'item'))
          setTotalOrderPrice(
            cartVerifiedData?.cost?.breakup?.reduce((acc, val) => val.price / 100 + acc, 0),
          )
          setLoading(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }, [isCurrentStep])
  useEffect(async () => {
    if (transactionStatus === transactionStatusValues.SUCCESS) {
      await initializrOrder()
    }
  }, [transactionStatus])
  return (
    <div className={styles.price_summary_card}>
      <div
        className={`${isStepCompleted ? styles.step_completed_card_header : styles.card_header} `}
        style={
          isCurrentStep
            ? {
                borderBottom: `1px solid ${ONDC_COLORS.BACKGROUNDCOLOR}`,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }
            : {
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }
        }
      >
        <div>
          <p className={styles.card_header_title}>Order Summary</p>
        </div>
        {isStepCompleted && (
          <div className="px-3">
            <Checkmark width="25" height="16" style={{ marginBottom: '5px' }} />
          </div>
        )}
        {isCurrentStep && (
          <div style={{ width: '100% ' }}>
            {loading ? (
              <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
            ) : cartVerificationStatus !== 'FAILED' ? (
              <>
                <div
                  style={{
                    width: '100%',

                    paddingRight: '5px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'start',
                      marginBottom: '5px',
                      marginTop: '20px',
                    }}
                  >
                    <p className={styles.item_price_details}>Cart Item Prices</p>
                  </div>
                  <hr />
                  {itemCostBreakup?.map((val) => {
                    return (
                      <div className={styles.cost_charges_breakup}>
                        <div>
                          <p>{val?.title}</p>
                        </div>
                        <p>{val?.quantity}</p>
                        <p>{val?.price}</p>
                      </div>
                    )
                  })}
                </div>
                <div style={{ width: '100%', marginTop: '5px', paddingLeft: '5px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'start',
                      marginBottom: '5px',
                    }}
                  >
                    <p className={styles.item_price_details}>Chares</p>
                  </div>
                  <hr />
                  {chargesBreakup?.map((val) => {
                    return (
                      <div className={styles.cost_charges_breakup}>
                        <div>
                          <p>{val?.title}</p>
                        </div>

                        <p>{val?.price}</p>
                      </div>
                    )
                  })}
                </div>
                <hr />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: '5px',
                  }}
                >
                  <p> {` Total Price :${totalOrderPrice}`}</p>
                </div>
                <hr />
                <div
                  className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
                >
                  <Button
                    isloading={initializeOrderLoading ? 1 : 0}
                    button_type={buttonTypes.primary}
                    button_hover_type={buttonTypes.primary_hover}
                    button_text="Place Order"
                    onClick={() => setShowTransactionModal(true)}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
            {showTransactionModal && (
              <TransactionStatusModal
                updateTrasactionStatus={(status) => {
                  setTransactionStatus(status)
                  setShowTransactionModal(false)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default CartStatus
