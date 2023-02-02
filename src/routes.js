import React,{useContext,useEffect} from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import ProductList from './pages/ProductListing/ProductList'
import { AddressContext } from '../src/contextProviders/addressContextProvider'
import ProductDetails from './pages/ProductListing/Components/ProductDetails'
import Checkout from './pages/Checkout/Checkout'
import uuid from 'react-uuid'
import OrderList from '../src/pages/orders/OrderList'
import BusinessProfile from '../src/pages/businessPage/BusinessProfile'

import CartPage from './pages/cart/Components/CartPage'
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
  
  return (
    <Router>
      <Switch>
       
          <Route path={'/'} exact component={() => <Redirect to={'/products'} />} />
          <Route exact path={'/products/:id'} component={ProductDetails} />
          <Route exact path={'/products'} component={ProductList} />
          <Route exact path={'/orders'} component={OrderList} />
          <Route exact path={'/business/:id'} component={BusinessProfile} />
          <Route path={'/checkout'} component={Checkout} />
          <Route path={"/cart"} component={CartPage}/>
        

      </Switch>
    </Router>
  )
}
