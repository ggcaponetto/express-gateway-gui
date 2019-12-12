import React, { useReducer, useEffect } from 'react'
import { MyRouter as Router } from './components/router/Router'
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css"
import axios from "axios";

const defaultContext = {
  version: '0.0.1',
  name: "express gateway gui",
  users: {
    selected: []
  }
};
const actions = {
  REPLACE: 'REPLACE'
};
const reducer = (state, action) => {
  const fnName = 'reducer';
  if (action.type === actions.REPLACE) {
    let newState = { ...state, ...action.payload };
    return newState
  } else {
    throw new Error(`${fnName} - Unsupported reducer action`, { state, action })
  }
};
export const Context = React.createContext(defaultContext);

const config = {
  host: "http://localhost:9877"
}
export const requests = {
  createUser: async (data) => {
    const url = `${config.host}/users`
    return await axios.post(url, data)
  },
  deleteUser: async (id) => {
    const url = `${config.host}/users/${id}`
    return await axios.delete(url)
  },
  updateUser: async (id, data) => {
    const url = `${config.host}/users/${id}`
    return await axios.put(url)
  },
  getUsers: async () => {
    const url = `${config.host}/users`
    return await axios.get(url)
  }
}

function App (props) {
  const fnName = 'App';
  const [state, dispatch] = useReducer(reducer, defaultContext);
  useEffect(() => {
    console.debug(`${fnName} - useEffect`, { state });
    // adds the dispatcher to the context so that any consumer can update the context itself
    dispatch({
      type: actions.REPLACE,
      payload: {
        actions: actions,
        dispatch: dispatch,
        requests
      }
    })
  }, []);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - state changed`, { state })
  }, [state]);
  return (
    <div className="App">
      <Context.Provider value={state}>
        <Router {...props}/>
      </Context.Provider>
    </div>
  )
}

export default App
