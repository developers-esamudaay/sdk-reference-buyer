import React, { Fragment, useContext, useEffect, useState } from 'react'
import styles from '../../../styles/products/productList.module.scss'

import Loading from '../../../shared/loading/loading'
import ProductCard from '../Components/ProductCard'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import Dropdown from '../../../shared/dropdown/dropdown'
import DropdownSvg from '../../../shared/svg/dropdonw'
import { ONDC_COLORS } from '../../../shared/colors'
import SearchBanner from '../Components/SearchBanner'
import { supportedCities } from '../../../constants/ondcSupportedCities'
import { getAllDocs, addProducts } from '../../../data/firbaseCalls'
import { search_types, searchTypeMap } from '../../../constants/searchTypes'
import { queryTypes } from '../../../constants/queryTypes'
import Button from '../../../shared/button/button'
import { buttonTypes } from '../../../shared/button/utils'
import Pagination from '../../../shared/pagination/pagination'
import OrderSummary from '../../cart/Componentes/OrderSummary'
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
  const { cartItems } = useContext(CartContext)

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
    const allProducts = await getAllDocs({
      collectionName: 'products',
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
    await fetchProducts(queryTypes.NO_QUERY, {})
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
  // fetch product with location fliter
  useEffect(async () => {
    let queryParam = {
      type: 'city_code',
      value: selectedLocation.city_code,
    }

    await fetchProducts(queryTypes.FILTER_QUERY, queryParam)
  }, [selectedLocation])

  return (
    <Fragment>
      {/* <Navbar /> */}

      <div className={styles.searchBar}>
        <Dropdown
          header={
            <div className={`${styles.category_drodpwon_wrapper} d-flex align-items-center`}>
              <div className="px-2">
                <p className={styles.search_type_text}>{'Banglore'}</p>
              </div>
              <div className="px-2">
                <DropdownSvg width="10" height="7" color={ONDC_COLORS.WHITE} />
              </div>
            </div>
          }
          body_classes="dropdown-menu-right"
          click={(search_type) => {
            setSearch((search) => ({
              ...search,
              type: search_type,
              value: '',
            }))
          }}
          options={supportedCities.map((city) => ({
            value: city.name,
          }))}
          show_icons={false}
        />

        {/* Location Dropdown menu  */}
        <SearchBanner
          search={search}
          setSearch={setSearch}
          checkSearch={checkSearch}
          inlineError={inlineError}
          setInlineError={function checkSearch() {
            if (!search?.value) {
              setInlineError((error) => ({
                ...error,
                search_error: `${search?.type} cannot be empty`,
              }))
              return false
            }
            return true
          }}
        />
        {/* Search bar to search product */}
      </div>
      {/* header */}
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className={`row pe-2`}>
            {products.map((product) => {
              return (
                <div key={product?.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 p-2">
                  <ProductCard product={product} />
                </div>
              )
            })}
          </div>
          {/* products cards */}

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
          {/* pagination for prev and next page */}
        </div>
      )}
      {cartItems && cartItems.length > 0 && <OrderSummary />}
      {/* show Cart Summary if cart have some items */}
    </Fragment>
  )
}
