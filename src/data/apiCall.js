// import ApiClient from './ApiClient.ts'
// import { RequestType } from '../Constant.ts'
// import { async } from '@firebase/util'
import axios from 'axios'
const axoisInstance = axios.create({
  baseURL: 'https://api.test.esamudaay.com',
  timeout: 1000,
  headers: { apid: `d1e7f644-552c-4a4e-a4e3-3233b876c060` },
})
export const verfyCartUsingSdk = async (payload) => {
  return await axoisInstance.post('/api/v1/ondc/sdk/buyer/carts', payload)
}

export const confirmOrderUsingSdk = async (payload) => {
  return await axoisInstance.post('/api/v1/ondc/sdk/buyer/orders', payload)
}
