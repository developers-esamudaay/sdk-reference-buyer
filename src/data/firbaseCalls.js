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
  limitToLast
} from 'firebase/firestore'
import { async } from '@firebase/util'
import { queryTypes } from '../constants/queryTypes'

const db = getFirestore(app)
const genrateQuery = ({ queryParam, collectionName, query_type, offset = 24 }) => {
  
  const productRef = collection(db, collectionName)
  switch (query_type) {
    case queryTypes.NO_QUERY:
   
      return query(productRef,limit(offset), orderBy('id'))

    case queryTypes.SEARCH_QUERY:
   
      return query(
        productRef,
        limit(offset),
        orderBy('item_name'),
        where('selectedIndexes', 'array-contains', queryParam.value.toLowerCase()),
      )
    case queryTypes.NEXT_PAGE_QUERY:
    
      return query(productRef, limit(offset), orderBy('id'), startAfter(queryParam?.lastProductId))
    case queryTypes.PREV_PAGE_QUERY:
      
      return query(productRef, limit(offset), orderBy('id'), endAt(queryParam?.firstProductId),limitToLast(offset))
    case queryTypes.PROVIDER_FILTER_QUERY:
     
      return query(
        productRef,
       
        where('business_id', '==', queryParam.filterValue),
      )
  }
}
//products
//function to get products with filter and limit
export async function getProducts({ queryParam, collectionName, query_type, offset }) {
  const q = genrateQuery({ queryParam, collectionName, query_type, offset })
  // const geoQuery=geo.query()
  // // geoQuery.within( geo.point(sessionStorage.getItem(latitude),sessionStorage.getItem(longitude)) , 100, )
  // //       .subscribe((hits) => console.log((hits)))
  const querySnapshot = await getDocs(q)
  const products = querySnapshot.docs.map((doc) => doc.data())

  return products
}

//add products in firestore
export async function addProducts(product) {
  return await setDoc(doc(db, firestoreCollections.ONDC_PRODUCTS, product?.id), product)
}

//cart

//create new cart in firestor
export async function createCart(cartDetail) {
  
  return await setDoc(doc(db, firestoreCollections.ONDC_CART, cartDetail.cart_id), cartDetail)
}
//get verification cart data
export const getVerificationCartData = async (id) => {
  
  const docRef = doc(db, firestoreCollections.ONDC_CART, id)
  return await getDoc(docRef)
}

//order

//create new order in firestore
export async function createOrder(id,businessId) {
  
  return await setDoc(doc(db, firestoreCollections.ONDC_ORDER, id), {
    session_id: sessionStorage.getItem('sessionId'),
    id: id,
    business_id:businessId
  })
}

//get orderDetails from firestore
export const getOrderDetails = async (id) => {
  
  const docRef = doc(db, firestoreCollections.ONDC_ORDER, id)
  return await getDoc(docRef)
}
export async function getAllBusiness() {
  const q = query(collection(db, 'ondcCatalog'))
  
  const querySnapshot = await getDocs(q)
  const allBusiness = querySnapshot.docs.map((doc) => doc.data())
  return allBusiness
}

//get order list
export const getOrderList = async (sessionId) => {
  const q = query(
    collection(db, firestoreCollections.ONDC_ORDER),
    orderBy("statusUpdatedOn","desc"),
    where('session_id', '==',sessionId),
  )
  const querySnapshot = await getDocs(q)
  const orderList = querySnapshot.docs.map((doc) => doc.data())
  return orderList
}

export const getBusinessDetailsById = async (id) => {
  const businessRef = collection(db, firestoreCollections.ONDC_CATALOG)
  const q= query(
    businessRef,
   
    where('business_id', '==', id),
  )
  const querySnapshot = await getDocs(q)
  const businesses = querySnapshot.docs.map((doc) => doc.data())
  return businesses
  
}
export const getSupportData=async(id)=>{
  const docRef = doc(db, firestoreCollections.ONDC_SUPPORT, id)
  return await getDoc(docRef)

}
