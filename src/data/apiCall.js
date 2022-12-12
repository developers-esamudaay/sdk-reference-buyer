// import ApiClient from './ApiClient.ts'
// import { RequestType } from '../Constant.ts'
// import { async } from '@firebase/util'
import axios from 'axios'

const axoisInstanceSdk = axios.create({
  baseURL: 'https://api.test.esamudaay.com',
  timeout: 2000,
  headers: { apid: process.env.API_ID ?? 'd1e7f644-552c-4a4e-a4e3-3233b876c060' },
})
const axoisInstanceMap = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org/search',
  timeout: 10000,
  headers: {
    'Access-Control-Allow-Origin': 'https://o2cj2q.csb.app',
  },
})
export const verfyCartUsingSdk = async (payload) => {
  return await axoisInstanceSdk.post('/api/v1/ondc/sdk/buyer/carts', payload)
}

export const confirmOrderUsingSdk = async (payload) => {
  return await axoisInstanceSdk.post('/api/v1/ondc/sdk/buyer/orders', payload)
}
export const getLatLngFromAddress = async (address) => {
  let url = `https://nominatim.openstreetmap.org/search?
    street=${address.street}
    &city=${address.city}
    &state=${address.state}
    &country=India
    &postalcode=${address.areaCode}&format=json`
  console.log()
  return await axoisInstanceMap.post(url)
}
export const trackOrderFromSdk=async(orderId)=>{
  return axoisInstanceSdk.post(`api/v1/ondc/sdk/buyer/orders/${orderId}/track`,{
    "city_code": "std_080"
})

}
export const cancelOrderFromSdk=async(orderId)=>{
  console.log(orderId)
  return axoisInstanceSdk.post(`api/v1/ondc/sdk/buyer/orders/${orderId}/cancel`,{
    "city_code": "std:080",
    "type": "CANCEL",
    "meta": {
        "cancel_reason_code": "001",
        
    }
})
}
export const supportOrderFromSdk=async(orderId,payload)=>{
  return axoisInstanceSdk.post("/api/v1/ondc/sdk/buyer/support",payload)
}
