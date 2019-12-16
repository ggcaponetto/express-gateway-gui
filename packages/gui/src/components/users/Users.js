import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../App";
import "./Users.css";
import {Navbar} from "../navbar/Navbar";
import {Content} from "../content/Content";
import {Button, Table, Form, Tab, Checkbox} from "semantic-ui-react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.css";

export function Users(props) {
    const fnName = "Users";
    const context = useContext(Context);
    const [isVisible, setIsVisible] = useState(false);
    const [userResponse, setUserResponse] = useState({
        data: {
            users: []
        }
    });
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context, props});
        fetchUsers();
    }, [context]);
    const fetchUsers = async () => {
        if (context.requests) {
            const usersResponse = await context.requests.getUsers();
            console.debug(`${fnName} - fetchUsers`, {usersResponse, context, props});
            setUserResponse(usersResponse);
        }
    };
    const updateSelection = (user, event, data) => {
        context.dispatch({
            type: context.actions.REPLACE,
            payload: {
                users: {
                    ...context.users,
                    selected: data.checked ? [user, ...context.users.selected] : context.users.selected.filter((selectedUser) => {
                        return selectedUser.id !== user.id;
                    })
                }
            }
        });
    };
    const getActions = () => {
        const deleteSelection = async () => {
            for (let i = 0; i < context.users.selected.length; i++) {
                const userToDelete = context.users.selected[i];
                await context.requests.deleteUser(userToDelete.id).catch((error) => {
                    console.error(`${fnName} - could not delete user`, {error, userToDelete});
                });
                // clear the selection after the user deletes something
                context.dispatch({
                    type: context.actions.REPLACE,
                    payload: {
                        users: {
                            ...context.users,
                            selected: []
                        }
                    }
                });
            }
        };
        const getDeleteAction = () => {
            const buttons = [];
            if (context.users.selected.length > 0) {
                buttons.push(
                    <Button
                        key={"delete"}
                        color={"red"}
                        onClick={async () => {
                            await deleteSelection();
                            fetchUsers();
                        }}>
                        Delete
                    </Button>
                );
            }
            if (context.users.selected.length > 0) {
                buttons.push(
                    <Button
                        key={"deselect-all"}
                        color={"grey"}
                        onClick={async () => {
                            context.dispatch({
                                type: context.actions.REPLACE,
                                payload: {
                                    users: {
                                        ...context.users,
                                        selected: []
                                    }
                                }
                            });
                        }}>
                        Deselect all
                    </Button>
                );
            }
            if (context.users.selected.length < userResponse.data.users.length) {
                buttons.push(
                    <Button
                        key={"select-all"}
                        color={"grey"}
                        onClick={async () => {
                            context.dispatch({
                                type: context.actions.REPLACE,
                                payload: {
                                    users: {
                                        ...context.users,
                                        selected: userResponse.data.users
                                    }
                                }
                            });
                        }}>
                        Select all
                    </Button>
                );
            }
            return (
                <React.Fragment>
                    {buttons}
                </React.Fragment>
            );
        };
        const getCreateAction = () => {
            function CreateUserForm(props) {
                const context = useContext(Context);
                const [form, setForm] = useState({
                    username: "", firstname: "", lastname: "", redirectUri: "", email: ""
                });
                const handleChange = (event) => {
                    event.persist();
                    const name = event.target.name;
                    const value = event.target.value;
                    console.debug(`${fnName} - handleChange`, {name, value, event});
                    const subForm = {};
                    subForm[name] = value;
                    setForm({
                        ...form,
                        ...subForm
                    });
                };
                const onSaveUser = async () => {
                    await context.requests.createUser(form).then(() => {
                        iziToast.info({
                            title: "Users",
                            message: `Created user ${form.username} (${form.email})`
                        });
                    }).catch((e) => {
                        iziToast.error({
                            title: "Users",
                            message: `Error creating user ${form.username} (${form.email}): ${e.message}`
                        });
                    });
                    await fetchUsers();
                };
                return (
                    <Form onSubmit={(event, data) => {
                        console.debug(`${fnName} - creating user`, {event, data, context, props});
                    }}>
                        <Form.Field>
                            <label>username</label>
                            <input placeholder='username' name={"username"} value={form.username}
                                   onChange={handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>firstname</label>
                            <input placeholder='firstname' name={"firstname"} value={form.firstname}
                                   onChange={handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>lastname</label>
                            <input placeholder='lastname' name={"lastname"} value={form.lastname}
                                   onChange={handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>redirectUri</label>
                            <input placeholder='redirectUri' name={"redirectUri"} value={form.redirectUri}
                                   onChange={handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>email</label>
                            <input placeholder='email' name={"email"} type={"email"} value={form.email}
                                   onChange={handleChange}/>
                        </Form.Field>
                        <Button color={"green"} type='submit' onClick={onSaveUser}>Save</Button>
                    </Form>
                );
            }

            return <CreateUserForm {...props}/>;
        };
        const panes = [
            {
                menuItem: "Delete",
                render: () => (
                    <Tab.Pane>
                        <div className={"content"}>
                            <h4>{context.users.selected.length} user(s) selected.</h4>
                            {getDeleteAction()}
                        </div>
                    </Tab.Pane>
                )
            },
            {
                menuItem: "Create",
                render: () => (
                    <Tab.Pane>
                        <div className={"content"}>
                            {getCreateAction()}
                        </div>
                    </Tab.Pane>
                )
            }
        ];
        return (
            <div>
                <Tab panes={panes} className={"Actions"}/>
            </div>
        );
    };
    const getTable = () => {
        const getTableHeaderCells = (data) => {
            const headerCells = [];
            const attributes = [
                "selection"
            ];
            data.users.forEach((user) => {
                // assume the user data has always the same scheme
                for (const p in user) {
                    if (attributes.includes(p) === false) {
                        attributes.push(p);
                    }
                }
            });
            attributes.forEach((attribute) => {
                headerCells.push(
                    <Table.HeaderCell key={attribute}>{attribute.toString()}</Table.HeaderCell>
                );
            });
            return headerCells;
        };
        const getTableRows = (data) => {
            const getCells = (user) => {
                const isSelected = context.users.selected.filter((selectedUser) => {
                    return selectedUser.id === user.id;
                }).length > 0;
                const cells = [
                    (
                        <Table.Cell key={"selection"} className={"selection"}>
                            <Checkbox
                                checked={isSelected}
                                onChange={((event, data1) => {
                                    console.debug(`${fnName} - checkbox triggered`, {user, event, data1});
                                    updateSelection(user, event, data1);
                                    // TODO
                                })}
                            />
                        </Table.Cell>
                    )
                ];
                for (const p in user) {
                    cells.push(
                        <Table.Cell key={p}>{user[p].toString()}</Table.Cell>
                    );
                }
                return cells;
            };
            const rows = [];
            data.users.forEach((user, index) => {
                rows.push(
                    <Table.Row key={index}>
                        {getCells(user)}
                    </Table.Row>
                );
            });
            return rows;
        };
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
        );
    };
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
    );
}
