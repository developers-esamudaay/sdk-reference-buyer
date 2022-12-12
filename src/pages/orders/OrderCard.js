import {useState} from "react"
import styles from '../../../src/styles/orders/orderCard.module.scss'
import DropdownSvg from '../../shared/svg/dropdonw'
import Pending from '../../shared/svg/pending'
import Button from '../../shared/button/button'
import { buttonTypes } from '../../shared/button/utils'
import { cancelOrderFromSdk, supportOrderFromSdk, trackOrderFromSdk } from '../../data/apiCall'
import ErrorMessage from "../../shared/error-message/errorMessage"
import { delay } from "../../commonUtils"
import { getSupportData } from "../../data/firbaseCalls"
import CrossIcon from '../../../src/shared/svg/cross-icon'
import { ONDC_COLORS } from "../../shared/colors"
const OrderCard = ({ orderData, isOrderExpended, expendOrder,reloadOrders, }) => {
  const [trackingError,setTrackingError]=useState("")
  const [trackLoading,setTrackLoading]=useState(false)
  const [cancelLoading,setCancelLoading]=useState(false)
  const [orderSupportLoading,setOrderSupportLoading]=useState(false)
  const [supportData,setSupportData]=useState()
  console.log(trackLoading)
  const SupportModal=()=>(
    <>
    <div className={styles.overlay}>
     <div className={styles.support_modal}>
     <div style={{display:"flex",justifyContent:"end"}}>
     <CrossIcon
              width="20"
              height="20"
              color={ONDC_COLORS.SECONDARYCOLOR}
              style={{ cursor: 'pointer' }}
              onClick={()=>setSupportData()}
            />
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
       <p>{supportData?.email}</p>
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
       <p>{supportData?.phone}</p>
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
       <Button button_type={buttonTypes.secondary_hover} button_text={"Support Page Url"} onClick={()=>window.location=supportData?.uri}/>
      </div>
     </div>
    </div>
    </>
  )
const trackOrder=async()=>{
  setTrackLoading(true)
  try{
   const trackRes= await trackOrderFromSdk(orderData?.id)
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
    const cancelRes= await cancelOrderFromSdk(orderData?.id)
    if(cancelRes.status === 200 && cancelRes?.data?.message?.ack?.status === 'ACK'){
            await delay(2000)
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
     
    transaction_id: orderData?.transactionId,
    city_code: "std_080"

    }
    const supportRes=await supportOrderFromSdk(orderData?.id,payload)
    if(supportRes.status === 200 && supportRes?.data?.message?.ack?.status === 'ACK'){
          await delay(3000)
          const supportData=await (await getSupportData(orderData?.transactionId)).data()
          setSupportData(supportData)
          setOrderSupportLoading(false)
          
     }
  }
  catch(err){
    console.log(err)
  }
}
  return (
    <div
      style={{
        marginTop: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        cursor: 'pointer',
      }}
    >
      <div
        className={styles.card_wrapper}
        onClick={() => expendOrder(isOrderExpended ? '' : orderData?.id)}
      >
        <div style={{ padding: '30px' }}>
          <p className={styles.card_header_title}>{orderData?.id ? orderData?.id : 'NA'}</p>
          <p className={styles.address_type_label} style={{ fontSize: '12px' }}>
            Ordered on
            <span style={{ fontWeight: '500', padding: '0 5px' }}>{'sdsadasd'}</span>
          </p>
        </div>
        <div className="px-3" style={{ width: '20%' }}>
          <p className={styles.status_label}>Status:</p>
          <div className="pt-1">
            <div className={styles.status_chip}>
              <p className={styles.status_text}>{orderData?.statusOrder}</p>
            </div>
          </div>
        </div>
        <div className="px-5" style={{ width: '7%' }}>
          <div
            style={
              isOrderExpended
                ? {
                    transform: 'rotate(180deg)',
                    transition: 'all 0.7s',
                  }
                : { transform: 'rotate(0)', transition: 'all 0.7s' }
            }
          >
            <DropdownSvg color={'#ddd'} />
          </div>
        </div>
      </div>
      {isOrderExpended && (
        <>
        <div className={styles.card_body}>
          {orderData?.items &&
            Array.isArray(orderData?.items) &&
            orderData?.items?.map((item) => {
              return (
                <div className={styles.order_items}>
                  <div className={styles.order_items_text}>
                    <p className={styles.item_name_text}>{item?.title}</p>
                    <p className={styles.item_quantity_text}>{`Qt: ${item?.quantity} item`}</p>

                    <p className={styles.item_quantity_text}>{`Price: ${item?.price / 100} rs`} </p>
                  </div>
                  <div className={styles.order_items_image}>
                    <Pending />
                    <p className={styles.item_name_text}>{item?.statusFulfillment} </p>
                  </div>
                </div>
              )
            })}
        </div>
        <div className={styles.card_footer}>
      <Button onClick={()=>trackOrder()}Pbutton_type={buttonTypes.secondary_hover} button_text={"Track"} isloading={trackLoading?1:0}/>
      {orderData?.statusOrder!=="CANCELLED"&&<Button onClick={()=>cancelOrder()}button_type={buttonTypes.secondary_hover} button_text={"Cancel"} isloading={cancelLoading}/>}
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
        
      )}
      {
        supportData&&<SupportModal/>
      }
    </div>
  )
}
export default OrderCard
