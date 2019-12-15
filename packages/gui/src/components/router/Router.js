import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import { Context } from "../../App";
import "./Router.css";
import { Users } from "../users/Users";
import { Home } from "../home/Home";
import { Apps } from "../apps/Apps";
import { Todo } from "../util/todo/Todo";
export function MyRouter (props) {
  const fnName = "MyRouter";
  const context = useContext(Context);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context, props });
  }, [context]);
  return (
    <Router {...props}>
      <Route exact={true} path="/" render={(props) => <Home {...props}/>}/>
      <Route exact={true} path="/users" render={(props) => <Users {...props}/>}/>
      <Route exact={true} path="/apps" render={(props) => <Apps {...props}/>}/>
      <Route exact={true} path="/credentials" render={(props) => <Todo pageName={"credentials"} {...props}/>}/>
      <Route exact={true} path="/scopes" render={(props) => <Todo pageName={"scopes"} {...props}/>}/>
      <Route exact={true} path="/schemas" render={(props) => <Todo pageName={"schemas"} {...props}/>}/>
      <Route exact={true} path="/policies" render={(props) => <Todo pageName={"policies"} {...props}/>}/>
      <Route exact={true} path="/service-endpoints" render={(props) => <Todo pageName={"service-endpoints"} {...props}/>}/>
      <Route exact={true} path="/api-endpoints" render={(props) => <Todo pageName={"api-endpoints"} {...props}/>}/>
      <Route exact={true} path="/pipelines" render={(props) => <Todo pageName={"pipelines"} {...props}/>}/>
    </Router>
  );
}
