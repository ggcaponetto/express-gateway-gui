import React, {useContext, useEffect, useState} from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from 'react-router-dom'
import {Context} from '../../App'
import {Button, Menu, Segment, Sidebar} from 'semantic-ui-react'
import "./Router.css";

export function MyRouter() {
    return (
        <Router>
            <Route exact={true} path="/" render={(props) => <Home {...props}/>}/>
            <Route exact={true} path="/users" render={(props) => <Users {...props}/>}/>
        </Router>
    )
}

export function Home() {
    const fnName = 'Home';
    const context = useContext(Context);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context})
    }, [context]);
    return (
        <div className={fnName}>
            <Navbar isVisible={isVisible} setIsVisible={setIsVisible}/>
            <Content isVisible={isVisible} setIsVisible={setIsVisible}/>
        </div>
    )
}

export function Users() {
    const fnName = 'Users';
    const context = useContext(Context);
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context})
    }, [context]);
    return (
        <div className={fnName}>
            <h1>Users</h1>
            <div>{JSON.stringify(context)}</div>
        </div>
    )
}

export function Navbar(props) {
    const fnName = 'Navbar';
    const context = useContext(Context);
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context})
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

export function Content(props) {
    const fnName = 'Content';
    const context = useContext(Context);
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context})
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
                            <Button basic primary >Home</Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button basic primary >Users</Button>
                        </Menu.Item>
                    </div>
                </Sidebar>
                <Sidebar.Pusher dimmed={props.isVisible}>
                    <h1>Home</h1>
                    <div>{JSON.stringify(context)}</div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    )
}

