import {useState} from "react"
import styles from '../../../src/styles/orders/orderCard.module.scss'
import DropdownSvg from '../../assets/icons/Dropdown'

import Button from '../../sharedComponents/button/Button'

import { cancelOrderFromSdk, supportOrderFromSdk, trackOrderFromSdk,returnOrderUsingSdk } from '../../data/apiCall'
import ErrorMessage from "../../sharedComponents/errorMessage/ErrorMessage"
import { delay } from "../../commonUtils"
import { getSupportData } from "../../data/firbaseCalls"
import CrossIcon from '../../../src/assets/icons/CrossIcon'
import { APP_COLORS } from "../../constants/colors"


const OrderCard = ({ orderData, isOrderExpended, expendOrder,reloadOrders }) => {

  const [trackingError,setTrackingError]=useState("")
  const [trackLoading,setTrackLoading]=useState(false)
  const [cancelLoading,setCancelLoading]=useState(false)
  const [orderSupportLoading,setOrderSupportLoading]=useState(false)
  const [returnLoading,setReturnLoading]=useState(false)
  const [showReturnModal,setShowReturnModal]=useState(false)
  const [selectedItemForReturn,setSelectedItemForReturn]=useState(   new Array(orderData?.items?.length).fill({}))
  const [supportData,setSupportData]=useState()
  const returnItems=selectedItemForReturn.reduce((acc,item)=>Object.keys(item).length>0?[...acc,item]:acc,[])
  
  const handleOnChange=(position)=>{
   
    const updateItems=selectedItemForReturn.map((item,index)=>{
      return  index===position?(Object.keys(item).length===0?orderData?.items[index]:{}):item
    })

    setSelectedItemForReturn(updateItems)
  }
  const onQuantityChange=(position,value)=>{
    const updateItems=selectedItemForReturn.map((item,index)=>{
      return  index===position?({...item,quantity:value}):item
    })
    setSelectedItemForReturn(updateItems)
  }

  const ReturnModal=()=>(
    <>
    <div className={styles.overlay}>
     <div className={styles.support_modal}>
     <div style={{display:"flex",justifyContent:"end"}}>
     <CrossIcon
              width="20"
              height="20"
              color={APP_COLORS.SECONDARYCOLOR}
              style={{ cursor: 'pointer' }}
              onClick={()=>setShowReturnModal(false)}
            />
      </div>
      <div className={styles.return_modal_heading}>
        <p className={styles.return_item_title}>Item</p>
        <p className={styles.return_item_title}>Quantity</p>
        </div>
     {
      orderData?.items?.map((item,index)=>{
        return (
          <div className={styles.return_modal_items} key={index}>
          <div className={styles.left_section}>
          <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    style={{width:"20px"}}
                    checked={Object.keys(selectedItemForReturn[index]).length!==0}
                    onChange={() => handleOnChange(index)}
                  />
                  <label style={{marginLeft:"10px"}} htmlFor={`custom-checkbox-${index}`}>{item?.title}</label>
          </div>
          <div style={{marginBottom:"30px",marginRight:"20px"}}>
            <input type="text" style={{backgroundColor:"white",width:"30px"}} onChange={(e)=>onQuantityChange(index,e.target.value)}value={item?.quantity}/>
            </div> 
            </div> 
        )
      })
     }
     <div style={{display:"flex",justifyContent:"center",padding:"15px"}}>
      {
        returnItems?.length>0&&     <Button           btnBackColor={APP_COLORS.WHITE}
        hoverBackColor={APP_COLORS.SECONDARYCOLOR}
        buttonTextColor={APP_COLORS.SECONDARYCOLOR}
        hoverTextColor={APP_COLORS.WHITE} button_text={`Return ${returnItems?.length} Items`} onClick={()=>returnOrder()} isloading={returnLoading?1:0}/>
      }

     </div>
     </div>
    </div>
    </>
  )
  const SupportModal=()=>(
    <>
    <div className={styles.overlay}>
     <div className={styles.support_modal}>
     <div style={{display:"flex",justifyContent:"end"}}>
     <CrossIcon
              width="20"
              height="20"
              color={APP_COLORS.SECONDARYCOLOR}
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
       <Button           btnBackColor={APP_COLORS.WHITE}
                hoverBackColor={APP_COLORS.SECONDARYCOLOR}
                buttonTextColor={APP_COLORS.SECONDARYCOLOR}
                hoverTextColor={APP_COLORS.WHITE} button_text={"Support Page Url"} onClick={()=>window.location=supportData?.uri}/>
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
const returnOrder=async()=>{
 setReturnLoading(true)
 try{
  const payload={
    city_code: "std:080",
    business_id:orderData?.business_id,
    return_items:returnItems.map((item)=>{return {
      item_id:item?.id,
      quantity:item?.quantity,
      return_reason_code:"001",
      images:"",
      ttl_approval: "P1D",
      ttl_reverseqc: "P3D",
  
  
    }})
   }
   const returnRes=await returnOrderUsingSdk(payload,orderData?.id)
    if(returnRes.status === 200 && returnRes?.data?.message?.ack?.status === 'ACK'){
   
      await delay(2000)
      await reloadOrders()
    }
    
    setReturnLoading(false)
 }

 catch(e){
  console.log(e)
 }
 
}
  return (
    <div
   className={styles.card_wrapper}
    >
      <div
        className={styles.card_header}
        onClick={() => expendOrder(isOrderExpended ? '' : orderData?.id)}
      >
        <div style={{ padding: '30px' }}>
          <p className={styles.card_header_title}>{orderData?.id ? orderData?.id : 'NA'}</p>
          <p className={styles.date_label} style={{ fontSize: '12px' }}>
            Ordered on
            <span style={{ fontWeight: '500', padding: '0 5px' }}>{'sdsadasd'}</span>
          </p>
        </div>
       
        <div className="px-5" >
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
      {/* <div style={{display:"flex",justifyContent:"space-between",width:"480px",marginLeft:"20%",padding:"20px"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div className={styles.dot}>
        
        </div>
        <p>Created</p>
        </div>
        <span className={styles.line}></span>
       
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div className={styles.dot}>
        
        </div>
        <p>Created</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div className={styles.dot}>
        
        </div>
        <p>Created</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div className={styles.dot}>
        
        </div>
        <p>Created</p>
        </div>

      </div> */}
      {isOrderExpended && (
        <>
        
        <div className={styles.card_body}>
          <div style={{display:"flex",justifyContent:"center",marginTop:"10px"}}>
            <p className={styles.items_heading}>Order Items</p>
          </div>
          {orderData?.items &&
            Array.isArray(orderData?.items) &&
            orderData?.items?.map((item) => {
              return (
                <div className={styles.order_items}>
              
                    <p className={styles.item_name_text}>{item?.title}</p>
                       
                    <p className={styles.item_quantity_text}>{`Qt: ${item?.quantity} item`}</p>

                    <p className={styles.item_quantity_text}>{`Price: ${item?.price / 100} rs`} </p>

                  <div className={styles.order_items_image}>
                
                    <p className={styles.item_quantity_text}>{item?.statusFulfillment} </p>
                  </div>
                </div>
              )
            })}
       
    
          
      
            
        </div>
        <div >
         <p className={styles.action_text} onClick={()=>trackOrder()}>Track Order</p>
         {orderData?.statusOrder==="COMPLETED"&&<p className={styles.action_text}  onClick={()=>setShowReturnModal(true)}>Return Order</p>}
        </div>
        <div className={styles.card_footer}>
      {/* <Button onClick={()=>trackOrder()}Pbutton_type={buttonTypes.secondary_hover} button_text={"Track"} isloading={trackLoading?1:0}/> */}
      <Button onClick={()=>supportOrder()} btnBackColor={APP_COLORS.WHITE}
                hoverBackColor={APP_COLORS.ACCENTCOLOR}
                buttonTextColor={APP_COLORS.ACCENTCOLOR}
                hoverTextColor={APP_COLORS.WHITE} button_text={"Support"} isloading={orderSupportLoading?1:0} />
      {orderData?.statusOrder==="CREATED"&&<Button onClick={()=>cancelOrder()} btnBackColor={APP_COLORS.WHITE}
                hoverBackColor={APP_COLORS.ACCENTCOLOR}
                buttonTextColor={APP_COLORS.ACCENTCOLOR}
                hoverTextColor={APP_COLORS.WHITE} button_text={"Cancel"} isloading={cancelLoading}/>}
      {/* <Button button_type={buttonTypes.secondary_hover} button_text={"Support"} onClick={()=>supportOrder()} isloading={orderSupportLoading?1:0}/> */}
        </div>
        {trackingError&& <div style={{
          display:"flex",
          justifyContent:"center",
          padding:"10px"

        }}>
          
            <ErrorMessage><p>{trackingError}</p></ErrorMessage>
          
        
        </div> }
       
        </>
        
      )}
      {
        supportData&&<SupportModal/>
      }
     {
      showReturnModal&&<ReturnModal/>
     }
    
    </div>
  )
}
export default OrderCard
