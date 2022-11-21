import app from './firebase-init'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  getFirestore,
  limit,
  startAt,
  orderBy,
  startAfter,
  endAt,
  setDoc,
  doc,
} from 'firebase/firestore'
import { async } from '@firebase/util'
import { queryTypes } from '../constants/queryTypes'
const db = getFirestore(app)
const genrateQuery = ({ queryParam, collectionName, query_type, offset = 24 }) => {
  console.log(query_type)
  const productRef = collection(db, collectionName)
  switch (query_type) {
    case queryTypes.NO_QUERY:
      console.log(offset)
      return query(productRef, limit(offset), orderBy('id'))

    case queryTypes.SEARCH_QUERY:
      console.log(queryParam.type, queryParam.value, 'VALUE')
      return query(
        productRef,
        limit(offset),
        orderBy('item_name'),
        where('item_name', '>=', queryParam.value),
        where('item_name', '<', queryParam.value + 'z'),
      )
    case queryTypes.NEXT_PAGE_QUERY:
      console.log(queryParam.lastProductId)
      return query(productRef, limit(offset), orderBy('id'), startAfter(queryParam?.lastProductId))
    case queryTypes.NEXT_PAGE_QUERY:
      console.log(queryParam.lastProductId)
      return query(productRef, limit(offset), orderBy('id'), endAt(queryParam?.firstProductId))
    case queryTypes.PROVIDER_FILTER_QUERY:
      console.log(offset)
      return query(
        productRef,
        limit(offset),
        orderBy('id'),
        where('business_name', '==', queryParam.filterValue),
      )
  }
}
export async function getAllDocs({ queryParam, collectionName, query_type, offset }) {
  const q = genrateQuery({ queryParam, collectionName, query_type, offset })
  console.log('query', q)
  const querySnapshot = await getDocs(q)
  const cityList = querySnapshot.docs.map((doc) => doc.data())
  console.log(cityList, 'cityList')
  return cityList
}
export async function addProducts(product) {
  return await setDoc(doc(db, 'ondcProducts', product?.id), product)
}
export async function createCart(cartDetail) {
  console.log(cartDetail)
  return await setDoc(doc(db, 'ondcCart', cartDetail.cart_id), cartDetail)
}
export async function createOrder(id) {
  return await setDoc(doc(db, 'ondcOrder', id), { session_id: sessionStorage.getItem('sessionId') })
}
export const getVerificationCartData = async (id) => {
  console.log(id)
  const docRef = doc(db, 'ondcCart', id)
  return await getDoc(docRef)
}
export const getOrderDetails = async (id) => {
  console.log('orderId', id)
  const docRef = doc(db, 'ondcOrder', id)
  return await getDoc(docRef)
}
export async function getAllBusiness() {
  const q = query(collection(db, 'ondcCatalog'))
  console.log('query', q)
  const querySnapshot = await getDocs(q)
  const allBusiness = querySnapshot.docs.map((doc) => doc.data())
  console.log(allBusiness, 'allBusiness')
  return allBusiness
}
