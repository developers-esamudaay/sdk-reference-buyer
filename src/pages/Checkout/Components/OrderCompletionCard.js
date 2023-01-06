import React,{useState} from 'react'
import styles from '../../../styles/checkout/order/OrderCompletionCard.module.scss'
import Pending from '../../../sharedComponents/svg/pending'
import IndianRupee from '../../../sharedComponents/svg/indian-rupee'
import Button from '../../../sharedComponents/button/button'
import { buttonTypes } from '../../../sharedComponents/button/utils'
import { cancelOrderFromSdk, supportOrderFromSdk, trackOrderFromSdk } from "../../../data/apiCall"
import ErrorMessage from "../../../sharedComponents/errorMessage/ErrorMessage"
import { getSupportData } from '../../../data/firbaseCalls'
import { delay } from '../../../commonUtils'
const OrderCompletionCard = ({ orderId, orderItems, orderStatus,reloadOrders ,transactionId               
}) => {
  const [trackingError,setTrackingError]=useState("")
  const [trackLoading,setTrackLoading]=useState(false)
  const [cancelLoading,setCancelLoading]=useState(false)
  const [orderSupportLoading,setOrderSupportLoading]=useState(false)
  const [supportData,setSupportData]=useState()

  const SupportModal=()=>(
    <>
    <div className={styles.overlay}>
     <div className={styles.support_modal}>
      <div style={{display:"flex",justifyContent:"content"}}>
       <p>{supportData?.email}</p>
      </div>
      <div style={{display:"flex",justifyContent:"content"}}>
       <p>{supportData?.phone}</p>
      </div>
      <div style={{display:"flex",justifyContent:"content"}}>
       <Button button_type={buttonTypes.secondary_hover} button_text={"Support Page Url"} onClick={()=>window.Location=supportData?.uri}/>
      </div>
     </div>
    </div>
    </>
  )
  const trackOrder=async()=>{
    setTrackLoading(true)
    try{
     const trackRes= await trackOrderFromSdk(orderId)
     if(trackRes.status === 200 && trackRes?.data?.message?.ack?.status === 'ACK'){
        
     }
     else if( trackRes?.data?.message?.ack?.status === 'NACK'){
         setTrackingError("tracking service is not enabled for this order")
     }
      
    }
  
    catch(err){
      console.log(err)
    }
    setTrackLoading(false)  
  }
  const cancelOrder=async()=>{
    setCancelLoading(true)
    try{
      const cancelRes= await cancelOrderFromSdk(orderId)
      if(cancelRes.status === 200 && cancelRes?.data?.message?.ack?.status === 'ACK'){
              await reloadOrders()
      }
      setCancelLoading(false)
     }
     catch(err){
       console.log(err)
     }
    
  }
  const supportOrder=async()=>{
    setOrderSupportLoading(true)
    
    try{
      const payload={
       
      transaction_id: transactionId,
      city_code: "std_080"
  
      }
      const supportRes=await supportOrderFromSdk(orderId,payload)
      if(supportRes.status === 200 && supportRes?.data?.message?.ack?.status === 'ACK'){
            await delay(3000)
            const supportData=await (await getSupportData(transactionId)).data()
            setSupportData(supportData)
            
       }
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className={styles.card_header}>
          <p className={styles.card_header_title}> Thanks for Ordering With Us</p>
          <div className={styles.card_header_subtitle}>
            <p className={styles.card_header_subtitle_text}>{`OrderId:${orderId}`}</p>
          </div>
        </div>
        <div className={styles.card_body}>
          {orderItems.map((item) => {
            return (
              <div className={styles.order_items}>
                <div className={styles.order_items_text}>
                  <p className={styles.item_name_text}>{item?.title}</p>
                  <p className={styles.item_quantity_text}>{`Qt: ${item?.quantity} item`}</p>

                  <p className={styles.item_name_text}>{`Price: ${item?.price / 100} rs`} </p>
                </div>
                <div className={styles.order_items_image}>
                  <Pending />
                  <p className={styles.item_name_text}>{item?.statusFulfillment} </p>
                </div>
              </div>
            )
          })}
          <hr />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <p className={styles.item_name_text}>{`OrderStatus: ${orderStatus}`}</p>
          </div>
        </div>
        <>
        <div className={styles.card_footer}>
      <Button onClick={()=>trackOrder()}Pbutton_type={buttonTypes.secondary_hover} button_text={"Track"} isloading={trackLoading?1:0}/>
      {orderStatus!=="CANCELLED"&&<Button onClick={()=>cancelOrder()}button_type={buttonTypes.secondary_hover} button_text={"Cancel"} isloading={cancelLoading}/>}
      <Button button_type={buttonTypes.secondary_hover} button_text={"Support"} onClick={()=>supportOrder()} isloading={orderSupportLoading?1:0}/>
        </div>
        <div style={{
          display:"flex",
          justifyContent:"center",
          padding:"10px"

        }}>
          {
            trackingError&&<ErrorMessage><p>{trackingError}</p></ErrorMessage>
          }
        
        </div>
        </>
      </div>
    </div>
  )
}
export default OrderCompletionCard
