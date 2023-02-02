// import ApiClient from './ApiClient.ts'
// import { RequestType } from '../Constant.ts'
// import { async } from '@firebase/util'
import axios from 'axios'
import {Urls} from "./urls"
import { showErrorMsg,msgPosition } from '../contextProviders/toastMessegeProvider'
const axoisInstanceSdk = axios.create({
  baseURL: Urls.sdkBaseUrl,
  timeout: 2000,
  headers: { apid: process.env.REACT_APP_API_ID??"d1e7f644-552c-4a4e-a4e3-3233b876c060"  },
})
axoisInstanceSdk.interceptors.response.use((response)=>{
  if(response?.data?.message?.ack?.status === 'NACK'){
    showErrorMsg({position:msgPosition.BOTTOM_RIGHT,msg:"Oops something went wrong with the seller partner"})
  }
  else{
    return response
  }
},
function (error) {
  console.log("res error")
  // Do something with request error
  return Promise.reject(error);
}
)
const axoisInstanceLocationIq = axios.create({
  baseURL: Urls.locationIqBaseUrl,
  timeout: 10000,

})
const axoisInstanceMapOsm = axios.create({
  baseURL: Urls.osmBaseUrl,
  timeout: 10000,

})
export const verfyCartUsingSdk = async (payload) => {
  return await axoisInstanceSdk.post(Urls.verifyCartUrl, payload)
}

export const confirmOrderUsingSdk = async (payload) => {
  return await axoisInstanceSdk.post(Urls.OrderUrl, payload)
}
export const getLatLngFromAddress = async (address) => {
  console.log(address)
  let url = `https://us1.locationiq.com/v1/search?key=pk.5f5daaeffc2eb3d8822a194dd499df69&
    q=${address?.door},${address.areaCode}&format=json`
    return await axios.get(url)

}
export const trackOrderFromSdk=async(orderId)=>{
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/track`,{
    "city_code": "std_080"
})

}
export const cancelOrderFromSdk=async({id,reason_code})=>{
 
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${id}/cancel`,{
    "city_code": "std:080",
    "type": "CANCEL",
    "meta": {
        "cancel_reason_code": reason_code,
        
    }
})
}
export const supportOrderFromSdk=async(orderId,payload)=>{
  return axoisInstanceSdk.post(Urls.orderSupportUrl,payload)
}
export const returnOrderUsingSdk=(payload,orderId)=>{
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/return`,payload)
}
export const getAddressFromLatLng=async({lat,lon})=>{
  return await axios.get(`${Urls.locationIqBaseUrl}/reverse?key=pk.5f5daaeffc2eb3d8822a194dd499df69&lat=${lat}&lon=${lon}&format=json`)
}
export const getLocationSuggetion=async(query)=>{
  return await axios.get(`${Urls.locationIqBaseUrl}/autocomplete?key=pk.5f5daaeffc2eb3d8822a194dd499df69&q=${query}&format=json&countrycodes=in&limit=5`)
}

