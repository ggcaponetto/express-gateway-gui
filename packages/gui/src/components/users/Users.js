import React, {useContext, useEffect, useState} from 'react'
import {Context} from '../../App'
import "./Users.css";
import { Navbar } from '../navbar/Navbar'
import { Content } from '../content/Content'
import {Button} from 'semantic-ui-react'


export function Users(props) {
  const fnName = 'Users';
  const context = useContext(Context);
  const [isVisible, setIsVisible] = useState(false);
  const [userResponse, setUserResponse] = useState(null);
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, {context, props});
  }, [context]);
  useEffect(() => {
    console.debug(`${fnName} - useEffect`, {context, props});
    fetchUsers()
  }, [context.requests]);
  const fetchUsers = () => {
    let usersResponse = context.requests.getUsers();
    setUserResponse(usersResponse);
  }
  const getUserList = () => {
    try {
      if(userResponse && userResponse.data){
        return <div>{JSON.stringify(userResponse.data)}</div>
      }
    } catch (e) {
      console.error(`${fnName} - can't get the users`);
      return <div>{e.message}</div>
    }
  }
  return (
    <div className={fnName}>
      <Navbar {...props} isVisible={isVisible} setIsVisible={setIsVisible}/>
      <Content
        {...props}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        content={(
          <div>
            <h1>Users</h1>
            <div>{JSON.stringify(context)}</div>
            {
              getUserList()
            }
          </div>
        )}
      />
    </div>
  )
}
