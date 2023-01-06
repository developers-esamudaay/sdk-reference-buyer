import React,{useContext,useEffect} from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ProductList from './pages/ProductListing/ProductList'
import { AddressContext } from './contextProviders/addressContextProvider'
import ProductDetails from './pages/ProductListing/Components/ProductDetails'
import Checkout from '../src/pages/Checkout/Checkout'
import uuid from 'react-uuid'
import OrderList from './pages/orders/OrderList'
import BusinessProfile from './pages/businessPage/BusinessProfile'
import { getAddressFromLatLng } from '../src/data/apiCall'
export default function AppRoutes() {
  const {currentAddress,currentLocation,setCurrentLocation,setCurrentAddress,setAddressLoading}=useContext(AddressContext)
  useEffect(async() => {
    let sessionId = sessionStorage.getItem('sessionId')
    if (!sessionId) sessionStorage.setItem('sessionId', uuid())
    //if current location is not available set current location
    if(Object.keys(currentLocation).length === 0 && currentLocation.constructor === Object){
      navigator.geolocation.getCurrentPosition(async function (position) {
  
        setCurrentLocation({lat: position?.coords?.latitude ?? 0.00,lon:position?.coords?.longitude ??0.00})
    }
  )}}, [])
  //get current address throgh current location
  useEffect(async()=>{
    console.log(currentLocation,"loc");
    setAddressLoading(true);
    const currentAddress=await getAddressFromLatLng({lat:currentLocation?.lat,lon:currentLocation?.lon});

    console.log(currentAddress,"add")
    setCurrentAddress((prev)=>{return{...prev,city:currentAddress.data?.address?.city||currentAddress.data?.address?.state_district,state:currentAddress.data?.address?.state??"",country:currentAddress.data?.address?.country,areaCode:currentAddress.data?.address?.postcode,door:currentAddress.data?.address?.road||currentAddress.data?.address?.neighbourhood}})
    setAddressLoading(false)
  },[currentLocation])
  return (
    <Router>
      <Switch>
       
          <Route path={'/'} exact component={() => <Redirect to={'/products'} />} />
          <Route exact path={'/products/:id'} component={ProductDetails} />
          <Route exact path={'/products'} component={ProductList} />
          <Route exact path={'/orders'} component={OrderList} />
          <Route exact path={'/business/:id'} component={BusinessProfile} />
          <Route path={'/checkout'} component={Checkout} />
        

      </Switch>
    </Router>
  )
}
