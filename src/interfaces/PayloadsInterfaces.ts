import { QueryTypes } from './../constants/queryTypes';
import { Address, Location } from './AddressInterfaces';


//payload for api calls
interface CartVerifyPayloadItem{
    id:String,
    location_id:String,
    quantity:number
}
export interface BillingInfo{
    name: String,
    email: String,
    phone: String,
    address?:Address ,
}
export interface DeliveryAddressInfo {
  id?:string
    name: string,
    email: string,
    phone: string,
    location?:Location ,
    address?:Address,
  }
  export interface CustomerInfo{
    name: string ,
    phone:string ,
    email: string ,
  }
export interface CartVerifyPayloadInterface{
    cart_id?: string ,
    bpp_uri?: string ,
    bpp_id?: string ,
    business_id?: string,
    city_code?: string ,
    business_location_ids?:string [],
    items:CartVerifyPayloadItem [],
    fulfillment_type:string ,
    billing_info:BillingInfo,
    delivery_info:DeliveryAddressInfo,
    customer_info:CustomerInfo

}
interface PaymrntInfo{
  uri:string,
  tl_method:string,
  params:{
    currency:string,
    transaction_id:number,
    transaction_status:string,
    amount:string
  }
}
export interface ConfirmOrderPayloadInterface{
  cart_id: string,
  order_id: string,
  city_code: string,
  payment_info:PaymrntInfo
}
export interface SupportOrderPayloadInterface{
  transaction_id: string,
  city_code: string,
}
interface ReturnItem{
  item_id: string,
  quantity: number,
  return_reason_code: string,
  images: string,
  ttl_approval: string,
  ttl_reverseqc: string,
}
export interface returnOrderPayloadInterface{
  
    city_code: string ,
    business_id: string ,
    return_items:ReturnItem[] ,
  
}

//payload for firebase Calls
export interface FetchProductPayload{
  queryParam:string,
  offset?:number,
  queryType:QueryTypes
}