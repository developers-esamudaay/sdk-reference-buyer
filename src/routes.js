import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ProductList from './containers/ProductListing/Components/ProductList'
import ProductDetails from './containers/ProductListing/Components/ProductDetails'
import Checkout from '../src/containers/Checkout/Checkout'
import { CartContextProvider } from './contextProviders/cartContextProvider'

export default function OndcRoutes() {
  return (
    <Router>
      <Switch>
        <CartContextProvider>
          <Route path={'/'} exact component={() => <Redirect to={'/products'} />} />
          <Route exact path={'/products/:id'} component={ProductDetails} />
          <Route exact path={'/products'} component={ProductList} />

          <Route path={'/checkout'} component={Checkout} />
        </CartContextProvider>
        {/* <Route path="/page-not-found" component={PageNotFound} /> */}
        <Route path="" component={() => <Redirect to="/page-not-found" />} />
      </Switch>
    </Router>
  )
}
