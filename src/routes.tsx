import React,{useContext,useEffect} from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Homepage from 'pages/home/HomePage'

import { AddressContext } from './contextProviders/addressContextProvider'
import ProductDetails from './pages/ProductListing/Components/ProductDetails'
import Checkout from './pages/Checkout/Checkout'
import uuid from 'react-uuid'
import OrderList from './pages/orders/OrderList'
import BusinessProfile from './pages/businessPage/BusinessProfile'

import CartPage from './pages/cart/Components/CartPage'
export default function AppRoutes() {
  const {currentAddress,currentLocation,setCurrentLocation,setCurrentAddress,setAddressLoading}=useContext(AddressContext)
  useEffect(()=>{
    (async() => {
      //if new session started set new session id
      let sessionId = sessionStorage.getItem('sessionId')
      if (!sessionId) sessionStorage.setItem('sessionId', uuid())
      //if current location is not available set current location
      if(!currentLocation){
        navigator.geolocation.getCurrentPosition(async function (position) {
           console.log(position)
    
           setCurrentLocation&&  setCurrentLocation({lat: position?.coords?.latitude ?? 0.00,lon:position?.coords?.longitude ??0.00})
      }
    )}})()
  }
    , [])

  
  return (
    <Router>
      <Switch>
       
          <Route path={'/'} exact component={() => <Redirect to={'/products'} />} />
          <Route exact path={'/products/:id'} component={ProductDetails} />
          <Route exact path={'/products'} component={Homepage} />
          <Route exact path={'/orders'} component={OrderList} />
          <Route exact path={'/business/:id'} component={BusinessProfile} />
          <Route path={'/checkout'} component={Checkout} />
          <Route path={"/cart"} component={CartPage}/>
        

      </Switch>
    </Router>
  )
}
