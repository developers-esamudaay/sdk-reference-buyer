import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ProductList from './pages/ProductListing/ProductList'
import ProductDetails from './pages/ProductListing/Components/ProductDetails'
import Checkout from '../src/pages/Checkout/Checkout'
import { CartContextProvider } from './contextProviders/cartContextProvider'
import { AddressContextProvider } from './contextProviders/addressContextProvider'
import OrderList from './pages/orders/OrderList'
import BusinessProfile from './pages/businessPage/BusinessProfile'
export default function OndcRoutes() {
  return (
    <Router>
      <Switch>
        <CartContextProvider>
        <AddressContextProvider>
          <Route path={'/'} exact component={() => <Redirect to={'/products'} />} />
          <Route exact path={'/products/:id'} component={ProductDetails} />
          <Route exact path={'/products'} component={ProductList} />
          <Route exact path={'/orders'} component={OrderList} />
          <Route exact path={'/business/:id'} component={BusinessProfile} />
          <Route path={'/checkout'} component={Checkout} />
          </AddressContextProvider>
        </CartContextProvider>

      </Switch>
    </Router>
  )
}
