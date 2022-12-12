import React, { useEffect, useContext, useState } from 'react'
import styles from '../../styles/orders/orderList.module.scss'
import OrderCard from './OrderCard'
import Loading from '../../shared/loading/loading'
import { getOrderList } from '../../data/firbaseCalls'
import { useLocation } from 'react-router-dom'
const OrderList = () => {
  console.log('in order')
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(false)
  const location =useLocation()
  const [currentExpendedOrder, setCurrentExpendedOrder] = useState('')
  console.log(currentExpendedOrder)
  useEffect(async () => {
    const sessioId = sessionStorage.getItem('sessionId')
    setLoading(true)

    const orderList = await getOrderList(sessioId)
    console.log(orderList)
    setOrderList(orderList)
    setLoading(false)
  }, [])

  useEffect(async ()=>{
    console.log(location)
    setCurrentExpendedOrder(location?.state?.orderId)
  },[location])

  const reloadOrders=async()=>{
    setLoading(true)
    const sessioId = sessionStorage.getItem('sessionId')
    const orderList = await getOrderList(sessioId)
    console.log(orderList)
    setOrderList(orderList)
    setLoading(false)
  }

  return (
    <div className={styles.order_list_wrapper}>
      <div className={styles.order_list_label_wrapper}>
        <p className={styles.list_label_text}>Orders</p>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.order_card_wrapper}>
          {orderList.map((order) => {
            return (
              <div key={order?.id}>
                <OrderCard
                  orderData={order}
                  isOrderExpended={order?.id === currentExpendedOrder}
                  expendOrder={(id) => setCurrentExpendedOrder(id)}
                  reloadOrders={reloadOrders}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default OrderList
