import React, { useEffect, useContext, useState } from 'react'
import styles from '../../styles/orders/orderList.module.scss'
import OrderCard from './OrderCard'
import Loading from '../../sharedComponents/loading/Loading'
import { getOrderList } from '../../data/firbaseCalls'
import { useLocation,useHistory } from 'react-router-dom'
import Navbar from "../../sharedComponents/navBar/Navbar"
import no_order_image from "../../assets/images/no_order_image.png"
import Button from '../../sharedComponents/button/Button'
import { APP_COLORS } from '../../constants/colors'

const OrderList = () => {
  
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(false)
  const location =useLocation()
  const history=useHistory()
  const [currentExpendedOrder, setCurrentExpendedOrder] = useState('')
  
  useEffect(async () => {
    const sessioId = sessionStorage.getItem('sessionId')
    setLoading(true)

    const orderList = await getOrderList(sessioId)
    
    setOrderList(orderList)
    setLoading(false)
  }, [])

  useEffect(async ()=>{

    setCurrentExpendedOrder(location?.state?.orderId)
  },[location])

  const reloadOrders=async()=>{
    setLoading(true)
    const sessioId = sessionStorage.getItem('sessionId')
  
    setOrderList(orderList)
    setLoading(false)
  }

  return (
    <>
    

    <Navbar/>
     
      {loading ? (
        <Loading />
      ) : (
     <>
       
        
      
          {
            orderList.length===0&&(
              <>
              <div style={{display:"flex",justifyContent:"center"}} >
            <img
              src={no_order_image}
    
             
              width="400"
              height="400"
              // className={styles.product_img}
              // onError={(event) => {
              //   event.target.onerror = null
              //   event.target.src = no_image_found
              // }}
            />
            
            </div>
            <div style={{display:"flex",justifyContent:"center"}}>
              <p>No Orders Available</p>
            </div>
            <div style={{display:"flex",justifyContent:"center"}}>
            <Button
                  btnBackColor={APP_COLORS.WHITE}
                  hoverBackColor={APP_COLORS.ACCENTCOLOR}
                  buttonTextColor={APP_COLORS.ACCENTCOLOR}
                  hoverTextColor={APP_COLORS.WHITE}
                  button_text="Go to Products"
                  onClick={() => {
                    
                    history.push('/products')
                  }}
                />
            </div>
            </>

            )
          }
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
   
</>

      )}
 
    </>
  )
}
export default OrderList
