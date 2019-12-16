import React, { useReducer, useEffect } from "react";
import { MyRouter as Router } from "./components/router/Router";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";
import axios from "axios";
import * as packageJson from "./../package.json";

const defaultContext = {
  packageJson,
  name: "express gateway gui",
  users: {
    selected: []
  },
  apps: {
    selected: []
  },
  scopes: {
    selected: []
  },
  env: JSON.stringify(process.env)
};
const actions = {
  REPLACE: "REPLACE"
};
const reducer = (state, action) => {
  const fnName = "reducer";
  if (action.type === actions.REPLACE) {
    const newState = { ...state, ...action.payload };
    return newState;
  } else {
    throw new Error(`${fnName} - Unsupported reducer action`, { state, action });
  }
};
export const Context = React.createContext(defaultContext);

const config = {
  host: process.env.REACT_APP_PROXY_URL
};
export const requests = {
  createUser: async (data) => {
    const url = `${config.host}/users`;
    return await axios.post(url, data);
  },
  deleteUser: async (id) => {
    const url = `${config.host}/users/${id}`;
    return await axios.delete(url);
  },
  // eslint-disble-next-line no-unused-vars
  updateUser: async (id, data) => {
    const url = `${config.host}/users/${id}`;
    return await axios.put(url, data);
  },
  getUsers: async () => {
    const url = `${config.host}/users`;
    return await axios.get(url);
  },
  getApps: async () => {
    const url = `${config.host}/apps`;
    return await axios.get(url);
  },
  deleteApp: async (id) => {
    const url = `${config.host}/apps/${id}`;
    return await axios.delete(url);
  },
  createApp: async (data) => {
    const url = `${config.host}/apps`;
    return await axios.post(url, data);
  },
  getScopes: async () => {
    const url = `${config.host}/scopes`;
    return await axios.get(url);
  },
  createScope: async (data) => {
    const url = `${config.host}/scopes`;
    return await axios.post(url, data);
  },
  deleteScope: async (scope) => {
    const url = `${config.host}/scopes/${scope}`;
    return await axios.delete(url);
  },
};

function App (props) {
  const fnName = "App";
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
    });
  }, []);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - state changed`, { state });
  }, [state]);
  return (
    <div className="App">
      <Context.Provider value={state}>
        <Router {...props}/>
      </Context.Provider>
    </div>
  );
}

export default App;
