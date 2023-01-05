import React, { useEffect, useContext, useState } from 'react'

import { checkoutSteps } from '../../../constants/checkoutSteps'
import styles from '../../../../src/styles/cart/cartView.module.scss'
import { getCurrentStep } from '../utils'
import { APP_COLORS } from '../../../constants/colors'
import {
  createCart,
  getVerificationCartData,
  createOrder,
  getOrderDetails,
} from '../../../data/firbaseCalls'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
import Checkmark from '../../../assets/icons/Checkmark'
import Button from '../../../sharedComponents/button/Button'
import Loading from '../../../sharedComponents/loading/Loading'
import { verfyCartUsingSdk, confirmOrderUsingSdk } from '../../../data/apiCall'

import uuid from 'react-uuid'
import TransactionStatusModal from './TransactionStatusModal'
import { transactionStatusValues } from '../../../constants/transactionStatus'
import { delay } from '../../../commonUtils'
import ErrorMessage from '../../../sharedComponents/errorMessage/ErrorMessage'

import { useHistory } from 'react-router-dom'

const CartStatus = (props) => {
  const [loading, setLoading] = useState(false)
  const [cartVerificationStatus, setCartVerificationStatus] = useState('')
  const [cartVerificationError, setCartVerificationError] = useState('')
  const [chargesBreakup, setChargesBreakup] = useState([])
  const [itemCostBreakup, setItemCostBreakup] = useState([])
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const { cartData, setCartData } = useContext(CartContext)
  const { selectedBillingAddress, selectedDeliveryAddress } = useContext(AddressContext)
  const isStepCompleted = props.currentActiveStep.current_active_step_number > 2
  const isCurrentStep = props.currentActiveStep.current_active_step_number === 2
  const [totalOrderPrice, setTotalOrderPrice] = useState(0)
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [orderStatus, setOrderStatus] = useState('')
  const [transactionId,setTransactionId]=useState("")
  
  
  const history = useHistory()
  console.log(showTransactionModal)
  const initializrOrder = async () => {
    setInitializeOrderLoading(true)
    const id = uuid()
    console.log('orderId', id)
    setOrderId(id)
    try {
      await createOrder(id,cartData?.business_id)

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
      await delay(3000)
      setCartData({items:[]})
      setInitializeOrderLoading(false)
      history.push({pathname:"/orders",state:{orderId:id}})

      

   
    } catch (e) {
      console.log(e)
    }
  }
  const reloadOrders=async()=>{
    try{
      const response = await getOrderDetails(orderId)
      const orderDetails = response.data()
      setOrderItems(orderDetails?.items)
      setOrderStatus(orderDetails?.statusOrder)
      
    }
    catch(e){
      console.log(e)
    }
    
  }

  useEffect(async () => {
    if (isCurrentStep) {
      setLoading(true)
      console.log(selectedDeliveryAddress)
      const payload = {
        ...cartData,
        items: cartData.items.map((item) => {
          const ids=item.id.split('_')
          return { quantity: item?.quantity?.count, id: Array.isArray(ids)&&ids.length>1?ids[0]:"", location_id: item?.location_id }
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
          location: selectedDeliveryAddress?.location,
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
         
        }
        setLoading(false)
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
                borderBottom: `1px solid ${APP_COLORS.BACKGROUNDCOLOR}`,
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
              <Loading backgroundColor={APP_COLORS.ACCENTCOLOR} />
            ) : cartVerificationStatus ? (
              cartVerificationStatus !== 'FAILED' ? (
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
                          <p>{val?.price / 100}</p>
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

                          <p>{val?.price / 100}</p>
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
                      btnBackColor={APP_COLORS.WHITE}
                      hoverBackColor={APP_COLORS.ACCENTCOLOR}
                      buttonTextColor={APP_COLORS.ACCENTCOLOR}
                      hoverTextColor={APP_COLORS.WHITE}
                      button_text="Place Order"
                      onClick={() => setShowTransactionModal(true)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ErrorMessage>
                      <p>{cartVerificationError?.message}</p>
                    </ErrorMessage>
                  </div>
                  <div
                    className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
                  >
                    <Button
                 btnBackColor={APP_COLORS.WHITE}
                 hoverBackColor={APP_COLORS.ACCENTCOLOR}
                 buttonTextColor={APP_COLORS.ACCENTCOLOR}
                 hoverTextColor={APP_COLORS.WHITE}
                      button_text="Go to Products"
                      onClick={() => {
                        setCartData({ items: [] })
                        history.push('/products')
                      }}
                    />
                  </div>
                </>
              )
            ) : (
              <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ErrorMessage>
                  <p>Oops something went wrong with the seller partner</p>
                </ErrorMessage>
              </div>
              <div
                className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
              >
                <Button
                btnBackColor={APP_COLORS.WHITE}
                hoverBackColor={APP_COLORS.ACCENTCOLOR}
                buttonTextColor={APP_COLORS.ACCENTCOLOR}
                hoverTextColor={APP_COLORS.WHITE}
                  button_text="Go to Products"
                  onClick={() => {
                    setCartData({ items: [] })
                    history.push('/products')
                  }}
                />
              </div>
            </>
             
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
