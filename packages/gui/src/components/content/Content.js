import React, {useContext, useEffect} from 'react'
import {Context} from '../../App'
import {Button, Menu, Sidebar} from 'semantic-ui-react'
import "./Content.css";

export function Content(props) {
  const fnName = 'Content';
  const context = useContext(Context);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, {context, props})
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
              <Button basic primary onClick={()=>{props.history.push("/")}}>Home</Button>
            </Menu.Item>
            <Menu.Item>
              <Button basic primary onClick={()=>{props.history.push("/users")}}>Users</Button>
            </Menu.Item>
          </div>
        </Sidebar>
        <Sidebar.Pusher dimmed={props.isVisible}>
          {props.content}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  )
}
