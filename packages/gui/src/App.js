import React, { useReducer, useContext, useEffect } from 'react'
import { MyRouter as Router } from './components/router/Router'
import 'semantic-ui-css/semantic.min.css'

const defaultContext = {
  version: '0.0.1'
}
const actions = {
  REPLACE: 'REPLACE'
}
const reducer = (state, action) => {
  const fnName = 'reducer'
  if (action.type === actions.REPLACE) {
    let newState = { ...state, ...action.payload }
    return newState
  } else {
    throw new Error(`${fnName} - Unsupported reducer action`, { state, action })
  }
}
export const Context = React.createContext(defaultContext)

function App () {
  const fnName = 'App'
  const [state, dispatch] = useReducer(reducer, defaultContext)
  useEffect(() => {
    console.debug(`${fnName} - useEffect - state changed`, { state })
  }, [state])
  return (
    <div className="App">
      <Context.Provider value={state}>
        <Router/>
      </Context.Provider>
    </div>
  )
}

export default App
