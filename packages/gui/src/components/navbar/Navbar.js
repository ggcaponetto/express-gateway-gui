import React, {useContext, useEffect} from 'react'
import {Context} from '../../App'
import {Button} from 'semantic-ui-react'
import "./Navbar.css";

export function Navbar(props) {
  const fnName = 'Navbar';
  const context = useContext(Context);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, {context, props})
  }, [context]);
  return (
    <div className={fnName}>
      <div className={"controls"}>
        <Button basic primary onClick={() => {
          props.setIsVisible(!props.isVisible)
        }}>
          <i className="fas fa-bars"/>
        </Button>
      </div>
    </div>
  )
}
