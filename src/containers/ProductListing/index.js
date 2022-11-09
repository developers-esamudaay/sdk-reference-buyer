import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { CartContextProvider } from '../../contextProviders/cartContextProvider'

import ProductList from './Components/ProductList'
import ProductDetails from './Components/ProductDetails'

export default function ProductListing() {
  return (
    <CartContextProvider>
      <Switch>
        <Route path={'/'} exact component={() => <Redirect to={'/products'} />} />
        {/* <PrivateRoute path={'/products/:id'}>
          <ProductDetails />
        </PrivateRoute> */}
        <Route path={'/products/:id'} component={ProductDetails} />
        <Route path={'/products'} component={ProductList} />

        {/* <AddressContextProvider>
          <PrivateRoute path={'/application/initialize'}>
            <InitializeOrder />
          </PrivateRoute>
          <PrivateRoute path={'/application/checkout'}>
            <Checkout />
          </PrivateRoute>
        </AddressContextProvider> */}
      </Switch>
    </CartContextProvider>
  )
}
