import React, { useContext, useEffect } from "react";
import { Context } from "../../App";
import { Button, Header } from "semantic-ui-react";
import "./Navbar.css";
import PropTypes from "prop-types";

export function Navbar (props) {
  const fnName = "Navbar";
  const context = useContext(Context);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context, props });
  }, [context]);
  return (
    <div className={fnName}>
      <div className={"controls"}>
        <Button basic primary onClick={() => {
          props.setIsVisible(!props.isVisible);
        }}>
          <i className="fas fa-bars"/>
        </Button>
        <Header as={"h3"} color={"teal"} style={{
          margin: "0px", alignItems: "center", textAlign: "center", display: "flex", paddingLeft: "15px"
        }}>{context.name} v{context.packageJson.default.version}</Header>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  setIsVisible: PropTypes.func,
  isVisible: PropTypes.bool,
};
