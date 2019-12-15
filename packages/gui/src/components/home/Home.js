import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../App";
import "./Home.css";
import { Navbar } from "../navbar/Navbar";
import { Content } from "../content/Content";

export function Home (props) {
  const fnName = "Home";
  const context = useContext(Context);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context, props });
  }, [context]);
  return (
    <div className={fnName}>
      <Navbar {...props} isVisible={isVisible} setIsVisible={setIsVisible}/>
      <Content
        {...props}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        content={(
          <div>
            <h1>Home</h1>
          </div>
        )}
      />
    </div>
  );
}
