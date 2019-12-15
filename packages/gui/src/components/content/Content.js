import React, { useContext, useEffect } from "react";
import { Context } from "../../App";
import { Button, Menu, Sidebar } from "semantic-ui-react";
import "./Content.css";
import PropTypes from "prop-types";

export function Content (props) {
  const fnName = "Content";
  const context = useContext(Context);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context, props });
  }, [context]);
  return (
    <div className={fnName}>
      <Sidebar.Pushable>
        <Sidebar
          animation='overlay'
          onHide={() => props.setIsVisible(false)}
          visible={props.isVisible}
        >
          <div className={"menu"}>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/"); }}>Home</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/users"); }}>Users</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/apps"); }}>Apps</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/credentials"); }}>Credentials</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/scopes"); }}>Scopes</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/schemas"); }}>Schemas</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/policies"); }}>Policies</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/service-endpoints"); }}>Service Endpoints</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/api-endpoints"); }}>API Endpoints</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={() => { props.history.push("/pipelines"); }}>Pipelines</Button>
            </Menu.Item>
          </div>
        </Sidebar>
        <Sidebar.Pusher dimmed={props.isVisible}>
          {props.content}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}

Content.propTypes = {
  history: PropTypes.object,
  setIsVisible: PropTypes.func,
  isVisible: PropTypes.bool,
  content: PropTypes.any
};
