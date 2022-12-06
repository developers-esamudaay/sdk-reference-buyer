import app from './firebase-init'
import { firestoreCollections } from '../constants/firestoreCollections'
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
        where('selectedIndexes', 'array-contains', queryParam.value.toLowerCase()),
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
//products
//function to get products with filter and limit
export async function getProducts({ queryParam, collectionName, query_type, offset }) {
  const q = genrateQuery({ queryParam, collectionName, query_type, offset })
  console.log('query', q)
  const querySnapshot = await getDocs(q)
  const products = querySnapshot.docs.map((doc) => doc.data())
  console.log(products, 'products')
  return products
}

//add products in firestore
export async function addProducts(product) {
  return await setDoc(doc(db, firestoreCollections.ONDC_PRODUCTS, product?.id), product)
}

//cart

//create new cart in firestor
export async function createCart(cartDetail) {
  console.log(cartDetail)
  return await setDoc(doc(db, firestoreCollections.ONDC_CART, cartDetail.cart_id), cartDetail)
}
//get verification cart data
export const getVerificationCartData = async (id) => {
  console.log(id)
  const docRef = doc(db, firestoreCollections.ONDC_CART, id)
  return await getDoc(docRef)
}

//order

//create new order in firestore
export async function createOrder(id) {
  return await setDoc(doc(db, firestoreCollections.ONDC_ORDER, id), {
    session_id: sessionStorage.getItem('sessionId'),
    id: id,
  })
}

//get orderDetails from firestore
export const getOrderDetails = async (id) => {
  console.log('orderId', id)
  const docRef = doc(db, firestoreCollections.ONDC_ORDER, id)
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

//get order list
export const getOrderList = async (sessionId) => {
  const q = query(
    collection(db, firestoreCollections.ONDC_ORDER),
    where('session_id', '==', sessionId),
  )
  const querySnapshot = await getDocs(q)
  const orderList = querySnapshot.docs.map((doc) => doc.data())
  return orderList
}

export const getBusinessDetailsById = async (id) => {
  const docRef = doc(db, firestoreCollections.ONDC_CATALOG, id)
  return await getDoc(docRef)
}
