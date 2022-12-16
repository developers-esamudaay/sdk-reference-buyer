import React, { Fragment, useContext, useEffect, useState } from 'react'
import styles from '../../styles/products/productList.module.scss'
import { Link } from 'react-router-dom'
import Loading from '../../shared/loading/loading'
import ProductCard from './Components/ProductCard'
import { CartContext } from '../../contextProviders/cartContextProvider'
import Dropdown from '../../shared/dropdown/dropdown'
import DropdownSvg from '../../shared/svg/dropdonw'
import { ONDC_COLORS } from '../../shared/colors'
import SearchBanner from './Components/SearchBanner'
import { supportedCities } from '../../constants/ondcSupportedCities'
import { getProducts, addProducts, getAllBusiness } from '../../data/firbaseCalls'
import { search_types, searchTypeMap } from '../../constants/searchTypes'
import { queryTypes } from '../../constants/queryTypes'
import Button from '../../shared/button/button'
import { buttonTypes } from '../../shared/button/utils'
import Pagination from '../../shared/pagination/pagination'
import CartSummary from '../cart/Componentes/CartSummaryBottomStrip'
import { useLocation } from 'react-router-dom'
import uuid from 'react-uuid'
import OrderCompletionCard from '../Checkout/Components/OrderCompletionCard'
import Navbar from "../../shared/navBar/Navbar"
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
  const { cartData } = useContext(CartContext)
  console.log(toggleCollapse)

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
  console.log(cartItems)
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

  // useEffect(async () => {
  //   const allBusiness = await getAllBusiness()
  //   const mySet1 = new Set()
  //   for (let business of allBusiness) {
  //     for (let item of business?.business_data?.items ?? []) {
  //       const keys = item?.item_name.split(' ')
  //       let indexes = []
  //       for (let key of keys) {
  //         for (let key of keys) {
  //           let str = ''
  //           let ls = key.toLowerCase()
  //           for (let i = 0; i < ls.length; i++) {
  //             str = str + ls[i]
  //             indexes.push(str)
  //           }
  //         }
  //       }
  //       const product = {
  //         ...item,
  //         id: item.id + '_' + business?.business_id,
  //         bpp_id: business?.bpp_id,
  //         bpp_uri: business?.bpp_uri,
  //         locations: business?.business_data?.locations,
  //         business_id: business?.business_id,
  //         business_name: business?.business_data?.name,
  //         business_symbol: business?.business_data?.symbol,
  //         city_code: business?.descriptor?.city_code,
  //         selectedIndexes: indexes,
  //       }
  //       if (!mySet1.has(product?.id)) {
  //         mySet1.add(product?.id)
  //         console.log(product)
  //         await addProducts(product)
  //       }
  //     }
  //   }
  // }, [])
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
  // fetch product with location fliter
  // useEffect(async () => {
  //   let queryParam = {
  //     type: 'city_code',
  //     value: selectedLocation.city_code,
  //   }

  //   await fetchProducts(queryTypes.FILTER_QUERY, queryParam)
  // }, [selectedLocation])
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      sessionStorage.setItem('latitude', position?.coords?.latitude ?? '')
      sessionStorage.setItem('longitude', position?.coords?.longitude ?? '')
    })
  }, [])

  const EmptyProductView = (
    <div classNamer={styles.empty_product_view}>
      <img
        src={'../../assets/images/empty_box.png'}
        width="150"
        height="150"
        className={styles.product_img}
        // onError={(event) => {
        //   event.target.onerror = null
        //   event.target.src = no_image_found
        // }}
      />
    </div>
  )

  return (
    <Fragment>
      {/* <Navbar /> */}
   <Navbar search={search}
   setSearch={setSearch}
   checkSearch={checkSearch}
   inlineError={inlineError} fromProductPage setToggleCollapse={setToggleCollapse}/>

      {/* header */}
      {loading ? (
        <Loading />
      ) : (
        <div
        style={{
          backgroundColor: 'white',
          padding: '5px 5px 5px 5px',
          width: '90%',
          marginTop: '100px',
          marginLeft: '5%',
          display: 'flex',
          flexDirection: 'column',
        }}
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
      {cartItems && cartItems.length > 0 && <CartSummary toggleCollapse={toggleCollapse} setToggleCollapse={setToggleCollapse}/>}
      {/* <OrderCompletionCard /> */}
      {/* show Cart Summary if cart have some items */}
    </Fragment>
  )
}
