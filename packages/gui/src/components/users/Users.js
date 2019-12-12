import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../App'
import './Users.css'
import { Navbar } from '../navbar/Navbar'
import { Content } from '../content/Content'
import { Button, Table, Form, Tab, Checkbox } from 'semantic-ui-react'

export function Users (props) {
  const fnName = 'Users'
  const context = useContext(Context)
  const [isVisible, setIsVisible] = useState(false)
  const [userResponse, setUserResponse] = useState(null)
  useEffect(() => {
    console.debug(`${fnName} - useEffect - context changed`, { context, props })
    fetchUsers()
  }, [context])
  const fetchUsers = async () => {
    if (context.requests) {
      let usersResponse = await context.requests.getUsers()
      console.debug(`${fnName} - fetchUsers`, { usersResponse, context, props })
      setUserResponse(usersResponse)
    }
  }
  const updateSelection = (user, event, data) => {
    context.dispatch({
      type: context.actions.REPLACE,
      payload: {
        users: {
          ...context.users,
          selected: data.checked ? [user, ...context.users.selected] : context.users.selected.filter((selectedUser) => {return selectedUser.id !== user.id})
        }
      }
    })
  }
  const getActions = () => {
    const deleteSelection = async () => {
      for (let i = 0; i < context.users.selected.length; i++) {
        let userToDelete = context.users.selected[i]
        await context.requests.deleteUser(userToDelete.id).catch((error) => {
          console.error(`${fnName} - could not delete user`, { error, userToDelete })
        })
        // clear the selection after the user deletes something
        context.dispatch({
          type: context.actions.REPLACE,
          payload: {
            users: {
              ...context.users,
              selected: []
            }
          }
        })
      }
    }
    const getDeleteAction = () => {
      if (context.users.selected.length > 0) {
        return (
          <Button
            color={'red'}
            onClick={async () => {
              await deleteSelection();
              fetchUsers();
            }}>
            Delete
          </Button>
        )
      }
    }
    const getCreateAction = () => {
      function CreateUserForm(props){
        const [form, setForm] = useState({
          username: "", firstname:"", lastname:"", email:""
        })
        const handleChange = (event, data) => {
          console.debug(`${fnName} - handleChange`, {event, data})
        }
        return (
          <Form onSubmit={(event, data) => {
            console.debug(`${fnName} - creating user`, { event, data, context, props })
          }}>
            <Form.Field>
              <label>username</label>
              <input placeholder='username' value={form.username} onChange={handleChange}/>
            </Form.Field>
            <Form.Field>
              <label>firstname</label>
              <input placeholder='firstname' value={form.firstname} onChange={handleChange}/>
            </Form.Field>
            <Form.Field>
              <label>lastname</label>
              <input placeholder='lastname' value={form.lastname} onChange={handleChange}/>
            </Form.Field>
            <Form.Field>
              <label>email</label>
              <input placeholder='email' type={"email"} value={form.email} onChange={handleChange}/>
            </Form.Field>
            <Button color={"green"} type='submit'>Save</Button>
          </Form>
        )
      }
      return <CreateUserForm {...props}/>
    }
    const panes = [
      {
        menuItem: 'Delete',
        render: () => (
          <Tab.Pane>
            <h4>{context.users.selected.length} user(s) selected.</h4>
            {getDeleteAction()}
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Create',
        render: () => (
          <Tab.Pane>
            {getCreateAction()}
          </Tab.Pane>
        )
      }
    ]
    return (
      <div>
        <Tab panes={panes} />
      </div>
    )
  }
  const getTable = () => {
    try {
      if (userResponse && userResponse.data) {
        const getTableHeaderCells = (data) => {
          let headerCells = [
            (
              <Table.HeaderCell key={'selection'}>Selection</Table.HeaderCell>
            )
          ]
          data.users.forEach((user, i) => {
            // assume the user data has always the same scheme
            if (i === 1) {
              for (let p in user) {
                headerCells.push(
                  <Table.HeaderCell key={p}>{p.toString()}</Table.HeaderCell>
                )
              }
            }
          })
          return headerCells
        }
        const getTableRows = (data) => {
          const getCells = (user) => {
            const isSelected = context.users.selected.filter((selectedUser) => {return selectedUser.id === user.id}).length > 0;
            let cells = [
              (
                <Table.Cell key={'selection'} className={'selection'}>
                  <Checkbox
                    checked={isSelected}
                    onChange={((event, data1) => {
                      console.debug(`${fnName} - checkbox triggered`, { user, event, data1 })
                      updateSelection(user, event, data1)
                      // TODO
                    })}
                  />
                </Table.Cell>
              )
            ]
            for (let p in user) {
              cells.push(
                <Table.Cell key={p}>{user[p].toString()}</Table.Cell>
              )
            }
            return cells
          }
          let rows = []
          data.users.forEach((user, index) => {
            rows.push(
              <Table.Row key={index}>
                {getCells(user)}
              </Table.Row>
            )
          })
          return rows
        }
        return (
          <Table celled>
            <Table.Header>
              <Table.Row>
                {getTableHeaderCells(userResponse.data)}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {getTableRows(userResponse.data)}
            </Table.Body>
          </Table>
        )
      }
    } catch (e) {
      console.error(`${fnName} - can't get the users`)
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
            {
              getActions()
            }
            {
              getTable()
            }
          </div>
        )}
      />
    </div>
  )
}
