import React, { useState } from "react";
import "./Todo.css";
import { Navbar } from "../../navbar/Navbar";
import { Content } from "../../content/Content";
import "izitoast/dist/css/iziToast.css";
import PropTypes from "prop-types";

export function Todo (props) {
  const fnName = "Todo";
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className={fnName}>
      <Navbar {...props} isVisible={isVisible} setIsVisible={setIsVisible}/>
      <Content
        {...props}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        content={(
          <div>
            <h1>TODO: {props.pageName} page</h1>
            <h4>Hey you. Wanna contribute?</h4>
            <a href={"https://github.com/ggcaponetto/express-gateway-gui"}>https://github.com/ggcaponetto/express-gateway-gui</a>
          </div>
        )}
      />
    </div>
  );
}

Todo.propTypes = {
    pageName: PropTypes.string
};
