import app from './firebase-init'
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  addDoc,
  limit,
  startAt,
  orderBy,
  startAfter,
  endAt,
} from 'firebase/firestore'
import { async } from '@firebase/util'
import { queryTypes } from '../constants/queryTypes'
const db = getFirestore(app)
const genrateQuery = ({ queryParam, collectionName, query_type }) => {
  console.log(query_type)
  const productRef = collection(db, collectionName)
  switch (query_type) {
    case queryTypes.NO_QUERY:
      return query(productRef, limit(24), orderBy('id'))

    case queryTypes.SEARCH_QUERY:
      console.log(queryParam.type, queryParam.value, 'VALUE')
      return query(
        productRef,
        limit(24),
        orderBy(queryParam.type),
        where('item_name', '>=', queryParam.value),
        where('item_name', '<', queryParam.value + 'z'),
      )
    case queryTypes.NEXT_PAGE_QUERY:
      console.log(queryParam.lastProductId)
      return query(productRef, limit(24), orderBy('id'), startAfter(queryParam?.lastProductId))
    case queryTypes.NEXT_PAGE_QUERY:
      console.log(queryParam.lastProductId)
      return query(productRef, limit(24), orderBy('id'), endAt(queryParam?.firstProductId))
    case queryTypes.FILTER_QUERY:
      return query(
        productRef,
        limit(24),
        orderBy('id'),
        where(queryParam.type, '==', queryParam.value),
      )
  }
}
export async function getAllDocs({ queryParam, collectionName, query_type }) {
  const q = genrateQuery({ queryParam, collectionName, query_type })
  console.log('query', q)
  const querySnapshot = await getDocs(q)
  const cityList = querySnapshot.docs.map((doc) => doc.data())
  console.log(cityList, 'cityList')
  return cityList
}

// export async function addProducts(products, name, bppId, bppUri) {
//   for (let product of products) {
//     console.log()
//     await addDoc(collection(db, 'products'), {
//       ...product,
//       business_name: name,
//       bpp_id: bppId,
//       bpp_uri: bppUri,
//     })
//   }
// }
