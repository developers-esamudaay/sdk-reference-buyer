import React, { useState, useEffect,useContext,useRef } from 'react'
import styles from '../../styles/businessProfile/BusinessPage.module.scss'
import no_image_found from '../../assets/images/no_image_found.png'
import { getBusinessDetailsById, getProducts } from '../../data/firbaseCalls'
import ProductCard from '../ProductListing/Components/ProductCard'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { queryTypes } from '../../constants/queryTypes'
import { CartContext } from '../../contextProviders/cartContextProvider'
import { AddressContext } from '../../contextProviders/addressContextProvider'
import haversine from 'haversine-distance'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Navbar from '../../sharedComponents/navBar/Navbar'
import MapView from '../../sharedComponents/mapView/MapView'
const BusinessProfile = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [businessImages, setBusinessImages] = useState([])
  const [businessName, setBusinessName] = useState('')
  const [businessLocation,setBusinessLocation]=useState({})
  const [bppId,setBppId]=useState("")
  const [bppUri,setBppUri]=useState("")
  const [businessId,setBusinessId]=useState("")
  const[desc,setDesc]=useState("")
  const { id } = useParams()
  const { cartData } = useContext(CartContext)
  const {currentLocation} =useContext(AddressContext)
  const mapRef = useRef();
  const defaultLatLng=0.00
  const defaultRadius=6666*1000000;
  const userLocation={
    latitude:currentLocation?.lat,
    longitude:currentLocation?.lon
  }
  const providerLocation={
    latitude:businessLocation?.lat??defaultLatLng,
    longitude:businessLocation?.lon??defaultLatLng
  }
  const sellerAddress=businessLocation?.address
  console.log(sellerAddress?.city)
  const sellerPrettyAddress=""+sellerAddress?.street+", "+sellerAddress?.city+", "+sellerAddress?.state;

const deliveryRadius=businessLocation?.delivery_radius??defaultRadius;
const distanceFromSelller=haversine(userLocation,providerLocation)
const inDeliveryDistance=distanceFromSelller<(parseInt(deliveryRadius)*1000)
const defaultCenter = [38.9072, -77.0369];

const position = [51.505, -0.09]
  const cartItems = cartData?.items

  const About=(
<div className={styles.about_container}>
  
  <div className="container">
    <div className="row">
      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12" >
        
      
        <p className={styles.about_heading_text}>Map</p>
    <MapView location={providerLocation} zoom={10}/>
  
       
      </div>

   <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12" >
    <div className={styles.address_contact_container}>

   <p className={styles.about_heading_text}> Address</p>
   <div className={styles.address_content}>
    <p className={styles.business_name}>{businessName}</p>
    <div className={styles.address}>
    <LocationOnIcon style={{width:"30px",height:"30px",color:"green"}} />
    <p  className={styles.address_text}>{sellerPrettyAddress}</p>
    </div>
   
  
   </div>
     <div className={styles.business_details}>
     <p className={styles.about_heading_text}> Businees Details</p>
     <div className={styles.address_content}>
    
    <p  className={styles.address_text}>{`bppid:${bppId}`}</p>
    <p  className={styles.address_text}>{`bppUrl:${bppUri}`}</p>
    <p  className={styles.address_text}>{`businessId:${businessId}`}</p>
  
   </div>
     </div>
      </div>
    </div>
    </div>

  </div>
 

</div>
  )

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
              <div key={product?.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 p-2">
                <ProductCard product={product} fromScreen={'business'} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
  const tabScreens = [ProductScreen, About]

  useEffect(async () => {
   
    setLoading(true)
    
    const products = await getProducts({queryParam:{filterValue:id},collectionName:"ondcProducts",query_type:queryTypes.PROVIDER_FILTER_QUERY});
 
    setProducts(products)
    const businessDetails=await getBusinessDetailsById(id)
    const businessInfo=Array.isArray(businessDetails)&&businessDetails.length>0?businessDetails[0]:{}
    console.log(businessInfo)
     setBusinessImages(businessInfo?.business_data?.images ?? [])
     setBusinessName(businessInfo?.business_data?.name ?? '')
     setBusinessLocation(Array.isArray(businessInfo?.business_data?.locations)&&businessInfo?.business_data?.locations?.length>0?businessInfo?.business_data?.locations[0]:{})
     setDesc(businessInfo?.business_data?.long_desc)
     setBppId(businessInfo?.bpp_id)
     setBppUri(businessInfo?.bpp_uri)
     setBusinessId(businessInfo?.id)
   setLoading(false)

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
              backgroundColor: index === selectedTabIndex ? '#dd468a' : '',
              height: '100%',
              borderRadius: "8px"
           
            }}
          >
            <p className={styles.tabbar_text} style={{   color:index === selectedTabIndex?"white":"black"}}  onClick={() => setSelectedTabIndex(index)}>
              {screen}
            </p>
          </div>
        )
      })}
    </div>
  )
  return (
    <>
    <Navbar/>
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
        </div >
        <div className={styles.business_info}>
     
          <p className={styles.business_name}>{businessName}</p>
          <div className={styles.delivery_distance}>
            <LocationOnIcon style={{width:"30px",height:"30px",color:"green"}} />
            <p className={styles.delivery_distance_text}>{`${(distanceFromSelller/1000).toFixed()} Km`}</p>
            <div className={styles.delivery_availablity}>
            <LocalShippingIcon style={{width:"30px",height:"30px",color:inDeliveryDistance?"green":"#DC3545"}} />
            <p className={styles.delivery_distance_text} style={{color:inDeliveryDistance?"green":"#DC3545"}}  >{inDeliveryDistance? "Deliverable":"Not Deliverable"}</p>
            </div>
          </div>
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
