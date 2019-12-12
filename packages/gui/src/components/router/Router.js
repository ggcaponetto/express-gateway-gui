import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import { Context } from '../../App'
import './Router.css'
import { Users } from '../users/Users'
import { Home } from '../home/Home'

export function MyRouter (props) {
  const fnName = 'MyRouter'
  const context = useContext(Context)
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context, props })
  }, [context])
  return (
    <Router {...props}>
      <Route exact={true} path="/" render={(props) => <Home {...props}/>}/>
      <Route exact={true} path="/users" render={(props) => <Users {...props}/>}/>
    </Router>
  )
}


