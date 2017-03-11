import React from 'react'
import { IndexRoute, Route, Redirect } from 'react-router'

import ViewerQuery from './ViewerQuery'
import AppContainer from '../components/App/AppContainer'
import HomeContainer from '../components/Home/HomeComponent'

export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={HomeComponent} />
    <Redirect from='*' to='/' />
  </Route>
)
