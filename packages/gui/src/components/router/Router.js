import React, { useContext, useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import { Context } from '../../App'
import { Button, Menu, Segment, Sidebar } from 'semantic-ui-react'

export function MyRouter () {
  return (
    <Router>
      <Route exact={true} path="/" render={(props) => <Home {...props}/>}/>
      <Route exact={true} path="/users" render={(props) => <Users {...props}/>}/>
    </Router>
  )
}

export function Home () {
  const fnName = 'Home'
  const context = useContext(Context)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context })
  }, [context])
  return (
    <div>
      <Sidebar.Pushable>
        <Sidebar
          animation='overlay'
          onHide={() => setIsVisible(false)}
          vertical
          visible={isVisible}
        >
          <div className={"menu"}>
            <Menu.Item>
              <Button onClick={() => {setIsVisible(!isVisible)}}>Close Menu</Button>
            </Menu.Item>
            <Menu.Item>
              <Button>Home</Button>
            </Menu.Item>
            <Menu.Item>
              <Button>Users</Button>
            </Menu.Item>
          </div>
        </Sidebar>
        <Sidebar.Pusher dimmed={isVisible}>
          <Button onClick={() => {setIsVisible(!isVisible)}}>Menu Toggle</Button>
          <h1>Home</h1>
          <div>{JSON.stringify(context)}</div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  )
}

export function Users () {
  const fnName = 'Users'
  const context = useContext(Context)
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context })
  }, [context])
  return (
    <div>
      <h1>Users</h1>
      <div>{JSON.stringify(context)}</div>
    </div>
  )
}
