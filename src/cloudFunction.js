// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
// this function will when a new document is added in ondcCatalog collection and it will fetch all products from ondcCatalog document and push them in ondcProduct collection
exports.addProductsInondcProducts = functions.firestore.document('/ondcCatalog/{documentId}')
    .onCreate(async(snap, context) => {
      // Grab the current value of what was written to Firestore.
   
      const allBusiness = snap.data()
      const mySet1 = new Set()
      for (let business of allBusiness) {
        for (let item of business?.business_data?.items ?? []) {
          const keys = item?.item_name.split(' ')
          let indexes = []
          for (let key of keys) {
            for (let key of keys) {
              let str = ''
              let ls = key.toLowerCase()
              for (let i = 0; i < ls.length; i++) {
                str = str + ls[i]
                indexes.push(str)
              }
            }
          }
          const product = {
            ...item,
            id: item.id + '_' + business?.business_id,
            bpp_id: business?.bpp_id,
            bpp_uri: business?.bpp_uri,
            locations: business?.business_data?.locations,
            business_id: business?.business_id,
            business_name: business?.business_data?.name,
            business_symbol: business?.business_data?.symbol,
            city_code: business?.descriptor?.city_code,
            selectedIndexes: indexes,
          }
          if (!mySet1.has(product?.id)) {
            mySet1.add(product?.id)
           
            return await setDoc(doc(db, firestoreCollections.ONDC_PRODUCTS, product?.id), product)
          }
        }
      }
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.

    });