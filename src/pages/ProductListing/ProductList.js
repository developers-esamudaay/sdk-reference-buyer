import React, { Fragment, useContext, useEffect, useState } from 'react'
import styles from '../../styles/products/productList.module.scss'
import { Link } from 'react-router-dom'
import Loading from '../../sharedComponents/loading/Loading'
import ProductCard from './Components/ProductCard'
import { CartContext } from '../../contextProviders/cartContextProvider'

import DropdownSvg from '../../assets/icons/Dropdown'

import CartInfo from '../cart/Components/CartInfo'
import { supportedCities } from '../../constants/ondcSupportedCities'
import { getProducts, addProducts, getAllBusiness } from '../../data/firbaseCalls'
import { getAddressFromLatLng } from '../../data/apiCall'
import { search_types, searchTypeMap } from '../../constants/searchTypes'
import { queryTypes } from '../../constants/queryTypes'


import Pagination from '../../sharedComponents/pagination/Pagination'

import { useLocation } from 'react-router-dom'
import uuid from 'react-uuid'

import Navbar from "../../sharedComponents/navBar/Navbar"
import { AddressContext } from '../../contextProviders/addressContextProvider'
import LocationSearchModal from '../../sharedComponents/locationSearch/LocationSearchModal'
export default function ProductList() {
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState()
  const [search, setSearch] = useState({
    type: search_types.PRODUCT,
    value: '',
  })
  const [inlineError, setInlineError] = useState({
    search_error: '',
  })
  const [lastProductId, setLastProductId] = useState('')
  const [firstProductId, setFirstProductId] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(supportedCities[0])
  const [isAlreadySearched, setIsAlreadySearched] = useState(false)
  const [toggleCollapse, setToggleCollapse] = useState(false)

  const { cartData,showCartInfo,setShowCartInfo } = useContext(CartContext)
  
  const [firstProduct,setFirstProduct]=useState("")
const {currentAddress,setCurrentAddress,currentLocation,setCurrentLocation,showSearchLocationModal,setShowSearchLocationModal,addressLoading}=useContext(AddressContext)


  const cartItems = cartData?.items
  const location = useLocation()
  const filterData = location?.state

  function checkSearch() {
    if (!search?.value) {
      setInlineError((error) => ({
        search_error: `${search?.type} cannot be empty`,
      }))
      return false
    }
    return true
  }

  // use this function to fetch products
  async function fetchProducts(query_type, queryParam) {

    setLoading(true)

    setProducts([])
    const allProducts = await getProducts({
      collectionName: 'ondcProducts',
      query_type: query_type,
      queryParam: queryParam,
    })
    setFirstProductId(
      Array.isArray(allProducts) && allProducts.length > 0 ? allProducts[0]?.id : '',
    )
    setLastProductId(
      Array.isArray(allProducts) && allProducts.length > 0
        ? allProducts[allProducts.length - 1]?.id
        : '',
    )
    setFirstProduct(
      Array.isArray(allProducts) && allProducts.length > 0
        ? allProducts[0]?.item_name
        : '',
    )
    setProducts(allProducts)
    setLoading(false)
  }

  


  //fetch products on first call
  useEffect(async () => {
    if (filterData) {
      await fetchProducts(queryTypes.PROVIDER_FILTER_QUERY, filterData)
    } else {
      await fetchProducts(queryTypes.NO_QUERY, {})
    }
  }, [])

 
  //fetch products with search query
  useEffect(async () => {
    if (!search.value) {
      return
    }
    if (search.value && search.value.length < 3) {
      if (isAlreadySearched) {
        await fetchProducts(queryTypes.NO_QUERY, {})
        setIsAlreadySearched(false)
      }
      if (!isAlreadySearched)
        setInlineError((error) => ({
          search_error: `please enter atleast 3 letter to activate search`,
        }))
    } else {
      let queryParam = {
        type: searchTypeMap[search.type],
        value: search.value,
      }
      setInlineError('')
      //debouncing fetch function is remaining forthis search call
      await fetchProducts(queryTypes.SEARCH_QUERY, queryParam)
      setIsAlreadySearched(true)
    }
  }, [search.value])


  const EmptyProductView = (
    <div classNamer={styles.empty_product_view}>
      <img
        src={'../../assets/images/empty_box.png'}
        width="150"
        height="150"
        className={styles.product_img}
     
      />
    </div>
  )

  return (
    <Fragment>
      {/* <Navbar /> */}
   <Navbar search={search}
   setSearch={setSearch}
   checkSearch={checkSearch}
  currentAddress={currentAddress}
  addressLoading={addressLoading}
  setShowSearchLocationModal={setShowSearchLocationModal}
   inlineError={inlineError} fromProductPage setToggleCollapse={setToggleCollapse}/>

      {/* header */}
      {loading ? (
        <Loading />
      ) : (
        <div
        className={styles.product_list_container}
      >
        <div className="container" style={{ marginBottom: '10px' }}>
          <div className={`row pe-2`}>
            {products.map((product) => {
              return (
                <div key={product?.id} className="col-xl-3 col-lg-6 col-md-6 col-sm-6 p-2">
                  <ProductCard product={product} />
                </div>
              )
            })}
          </div>
          {/* products cards */}



          {products.length === 24 && (
            <div className={styles.pagination}>
              <Pagination
                onNext={() =>
                  fetchProducts(queryTypes.NEXT_PAGE_QUERY, { lastProductId: lastProductId })
                }
                onPrevious={() =>
                  fetchProducts(queryTypes.PREV_PAGE_QUERY, { firstProductId: firstProductId })
                }
              />
            </div>
          )}

          {/* pagination for prev and next page */}
        </div>
        </div>
      )}
    {showCartInfo&&<CartInfo onClose={()=>setShowCartInfo(false)}/>}

          {/* show cart modal  */}
 
      {showSearchLocationModal&&<LocationSearchModal/>}

          {/* show cart modal  */}
      
    </Fragment>
  )
}
