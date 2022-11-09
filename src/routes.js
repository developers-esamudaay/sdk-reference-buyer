import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ProductListing from '../src/containers/ProductListing'

export default function OndcRoutes() {
  return (
    <Router>
      <Switch>
        <Route path={'/'} component={ProductListing} />
        {/* <Route path="/page-not-found" component={PageNotFound} /> */}
        <Route path="" component={() => <Redirect to="/page-not-found" />} />
      </Switch>
    </Router>
  )
}
