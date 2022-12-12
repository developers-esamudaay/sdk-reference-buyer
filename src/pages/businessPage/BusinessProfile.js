import React, { useState, useEffect } from 'react'
import styles from '../../styles/businessProfile/BusinessPage.module.scss'
import no_image_found from '../../assets/images/no_image_found.png'
import { getBusinessDetailsById } from '../../data/firbaseCalls'
import ProductCard from '../ProductListing/Components/ProductCard'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
const BusinessProfile = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [businessImages, setBusinessImages] = useState([])
  const [businessName, setBusinessName] = useState('')
  const { id } = useParams()
  const tab1 = <p>first tab</p>
  const tab2 = <p>second tab</p>

  const ProductScreen = (
    <div
      style={{
        backgroundColor: 'white',
        padding: '5px 5px 5px 5px',
        width: '90%',
        marginTop: '20px',
        marginLeft: '5%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className={styles.product_screen_header_text}>
        <p>
          {`${products.length} products from `}
          <span style={{ color: 'blue' }}>{businessName}</span>
        </p>
      </div>
      <div className="container">
        <div className={`row pe-2`}>
          {products.map((product) => {
            return (
              <div key={product?.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 p-2">
                <ProductCard product={product} fromScreen={'business'} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
  const tabScreens = [ProductScreen, tab2]
console.log(products)
  useEffect(async () => {
   console.log(id)
    setLoading(true)
    
    const businessDetails = await getBusinessDetailsById(id);
    console.log(businessDetails[0].business_data)
    setProducts((Array.isArray (businessDetails)&&businessDetails.length>0)?(businessDetails[0].business_data?.items ?? []):[])
    setBusinessImages(businessDetails?.business_data?.images ?? [])
    setBusinessName(businessDetails?.business_data?.name ?? '')
    setLoading(false)
    console.log(businessDetails)
  }, [])
  const screenNames = [' Products', 'About']
  const TabBar = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '10%' }}>
      {screenNames.map((screen, index) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: index === selectedTabIndex ? 'black' : '',
              height: '100%',
            }}
          >
            <p className={styles.tabbar_text} style={{}} onClick={() => setSelectedTabIndex(index)}>
              {screen}
            </p>
          </div>
        )
      })}
    </div>
  )
  return (
    <>
      <div className={styles.seller_page_header_wrapper}>
        <div className={styles.image_container}>
          <img
            src={businessImages?.length > 0 ? businessImages[0] : no_image_found}
            alt={''}
            width="150"
            height="150"
            className={styles.business_image}
            onError={(event) => {
              event.target.onerror = null
              event.target.src = no_image_found
            }}
          />
        </div>
      </div>
      <div className={styles.seller_page_subheader_wrapper}>{TabBar}</div>
      <div>
        {tabScreens.map((Screen, index) => {
          return selectedTabIndex === index ? <>{Screen}</> : null
        })}
      </div>
    </>
  )
}
export default BusinessProfile
