import app from "./firebase-init";
import { firestoreCollections } from "../constants/firestoreCollections";
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
  limitToLast,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { QueryTypes } from "../constants/queryTypes";
import {
  FetchProductPayload,
  CartVerifyPayloadInterface,
} from "../interfaces/PayloadsInterfaces";

import {
  Product,
  ProductDetailsInterface,
  BusinessDetails,
  BusinessSearchRes,
} from "../interfaces/ResponseInterfaces";
const db = getFirestore(app);

const genrateQuery = ({
  queryParam,

  queryType,
  offset = 24,
}: FetchProductPayload) => {
  console.log(queryParam, queryType, offset);
  const productRef = collection(db, firestoreCollections.ONDC_PRODUCTS);
  switch (queryType) {
    case QueryTypes.NO_QUERY:
      return query(productRef, limit(offset), orderBy("item_id"));

    case QueryTypes.SEARCH_QUERY:
      return query(
        productRef,
        limit(offset),
        orderBy("item_id"),
        where("poduct_name_indexes", "array-contains", queryParam.toLowerCase())
      );
    case QueryTypes.NEXT_PAGE_QUERY:
      return query(
        productRef,
        limit(offset),
        orderBy("item_id"),
        startAfter(queryParam)
      );
    case QueryTypes.PREV_PAGE_QUERY:
      return query(
        productRef,
        limit(offset),
        orderBy("item_id"),
        endAt(queryParam),
        limitToLast(offset)
      );
    case QueryTypes.PROVIDER_FILTER_QUERY:
      return query(
        productRef,

        where("business_id", "==", queryParam),
        orderBy("item_id"),
        limit(24)
      );
  }
};
//products
//function to get products with filter and limit
export async function getProducts({
  queryParam,

  queryType,
  offset,
}: FetchProductPayload): Promise<Product[]> {
  console.log(queryParam, queryType, offset);

  try {
    const q: any = genrateQuery({ queryParam, queryType, offset });
    console.log(q);
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const products = querySnapshot.docs.map((doc) => doc.data()) as Product[];
    console.log(products);
    return products;
  } catch (err) {
    console.log(err);
  }
  return [];
}
export const getProductKeySuggetion = async (key: string) => {
  const q: any = query(
    collection(db, firestoreCollections.PRODUCT_NAME_INDEXES),
    limit(5),
    orderBy("key"),
    where("searchIndexes", "array-contains", key.toLowerCase())
  );
  const querySnapshot = await getDocs(q);
  const productKeySuggetions = querySnapshot.docs.map((doc) =>
    doc.data()
  ) as string[];
  return productKeySuggetions;
};
export const getBusinessSuggetion = async (key: string) => {
  console.log(key, "key");
  const q: any = query(
    collection(db, firestoreCollections.BUSINESS_NAME_INDEXES),
    limit(5),
    orderBy("id"),
    where("searchIndexes", "array-contains", key)
  );
  const querySnapshot = await getDocs(q);
  const productKeySuggetions = querySnapshot.docs.map((doc) =>
    doc.data()
  ) as unknown as BusinessSearchRes;
  console.log(productKeySuggetions, "key");
  return productKeySuggetions;
};

export const getProductDetailsById = async (id: string) => {
  const productRef = collection(
    db,
    firestoreCollections.ONDC_PRODUCTS,
    id,
    "more_details"
  );
  const q = query(productRef);
  const querySnapshot = await getDocs(q);
  const productDetails: ProductDetailsInterface[] = querySnapshot.docs.map(
    (doc) => doc.data()
  ) as ProductDetailsInterface[];
  return productDetails.length > 0 ? productDetails[0] : null;
};
export const getAllBusiness = async () => {
  const productRef = collection(db, firestoreCollections.ONDC_CATALOG);
  const q = query(productRef);
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  const businesses = querySnapshot.docs.map((doc) => doc.data());
  return businesses;
};

// //add products in firestore
export async function addProducts(product: any, item: any, unique_id: string) {
  await setDoc(doc(db, firestoreCollections.ONDC_PRODUCTS, unique_id), product);
  await setDoc(
    doc(
      db,
      firestoreCollections.ONDC_PRODUCTS,
      unique_id,
      "more_details",
      item.id
    ),
    item
  );
}
export const addUpdatedBusiness = async (business: any) => {
  await setDoc(
    doc(db, firestoreCollections.ONDC_BUSINESSES, business?.business_id),
    business
  );
};
export async function addKeys(key: string) {
  const mySet1 = new Set();
  if (!mySet1.has(key)) {
    let indexes = [];
    if (!key) {
      return;
    }
    let str = "";
    let ls = key.toLowerCase();

    for (let i = 0; i < ls.length; i++) {
      if (ls[i] !== "/") {
        str = str + ls[i];
        indexes.push(str);
      }
    }
    console.log(str);
    await setDoc(doc(db, "productNameIndexes", str), {
      key: str,
      searchIndexes: indexes,
    });
  }
}
export const addBusinessKeys = async (
  id: string,
  name: string,
  indexes: string[]
) => {
  await setDoc(doc(db, "BusinessNameIndexes", id), {
    id: id,
    name: name,
    searchIndexes: indexes,
  });
};

//cart

//create new cart in firestor
export async function createCart(cartDetail: any) {
  await setDoc(
    doc(db, firestoreCollections.ONDC_CART, cartDetail.cart_id),
    cartDetail
  );
}
//get verification cart data
export const getVerificationCartData = async (id: string) => {
  const docRef = doc(db, firestoreCollections.ONDC_CART, id);
  return await getDoc(docRef);
};

//order

//create new order in firestore
export async function createOrder(id: string, businessId: string) {
  return await setDoc(doc(db, firestoreCollections.ONDC_ORDER, id), {
    session_id: sessionStorage.getItem("sessionId"),
    id: id,
    business_id: businessId,
    createdDate: new Date(),
  });
}

//get orderDetails from firestore
export const getOrderDetails = async (id: string) => {
  const docRef = doc(db, firestoreCollections.ONDC_ORDER, id);
  return await getDoc(docRef);
};

//get order list
export const getOrderList = async (sessionId: String) => {
  const q = query(
    collection(db, firestoreCollections.ONDC_ORDER),
    orderBy("statusUpdatedOn", "desc"),
    where("session_id", "==", sessionId)
  );
  const querySnapshot = await getDocs(q);
  const orderList = querySnapshot.docs.map((doc) => doc.data());
  return orderList;
};

export const getBusinessDetailsById = async (
  id: String
): Promise<BusinessDetails | null> => {
  const businessRef = collection(db, firestoreCollections.ONDC_BUSINESSES);
  const q = query(
    businessRef,

    where("business_id", "==", id)
  );
  const querySnapshot = await getDocs(q);
  const businesses = querySnapshot.docs.map((doc) =>
    doc.data()
  ) as BusinessDetails[];
  console.log(businesses);
  return businesses.length > 0 ? businesses[0] : null;
};
export const getSupportData = async (id: string) => {
  const docRef = doc(db, firestoreCollections.ONDC_SUPPORT, id);
  return await getDoc(docRef);
};
