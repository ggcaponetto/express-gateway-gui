import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../App";
import "./Apps.css";
import {Navbar} from "../navbar/Navbar";
import {Content} from "../content/Content";
import {Button, Table, Form, Tab, Checkbox, Dropdown} from "semantic-ui-react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.css";

export function Apps(props) {
    const fnName = "Apps";
    const context = useContext(Context);
    const [isVisible, setIsVisible] = useState(false);
    const [appsResponse, setAppsResponse] = useState({
        data: {
            apps: []
        }
    });
    const [userResponse, setUserResponse] = useState({
        data: {
            users: []
        }
    });
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context, props});
        fetchApps();
        fetchUsers();
    }, [context]);
    const fetchUsers = async () => {
        if (context.requests) {
            const usersResponse = await context.requests.getUsers();
            console.debug(`${fnName} - fetchUsers`, {usersResponse, context, props});
            setUserResponse(usersResponse);
        }
    };
    const fetchApps = async () => {
        if (context.requests) {
            const appsResponse = await context.requests.getApps();
            console.debug(`${fnName} - fetchApps`, {appsResponse, context, props});
            setAppsResponse(appsResponse);
        }
    };
    const updateSelection = (app, event, data) => {
        context.dispatch({
            type: context.actions.REPLACE,
            payload: {
                apps: {
                    ...context.apps,
                    selected: data.checked ? [app, ...context.apps.selected] : context.apps.selected.filter((selectedApp) => {
                        return selectedApp.id !== app.id;
                    })
                }
            }
        });
    };
    const getActions = () => {
        const deleteSelection = async () => {
            for (let i = 0; i < context.apps.selected.length; i++) {
                const appToDelete = context.apps.selected[i];
                await context.requests.deleteApp(appToDelete.id).catch((error) => {
                    console.error(`${fnName} - could not delete app`, {error, appToDelete});
                });
                // clear the selection after the app deletes something
                context.dispatch({
                    type: context.actions.REPLACE,
                    payload: {
                        apps: {
                            ...context.apps,
                            selected: []
                        }
                    }
                });
            }
        };
        const getDeleteAction = () => {
            const buttons = [];
            if (context.apps.selected.length > 0) {
                buttons.push(
                    <Button
                        key={"delete"}
                        color={"red"}
                        onClick={async () => {
                            await deleteSelection();
                            await fetchApps();
                            await fetchUsers();
                        }}>
                        Delete
                    </Button>
                );
            }
            if (context.apps.selected.length > 0) {
                buttons.push(
                    <Button
                        key={"deselect-all"}
                        color={"grey"}
                        onClick={async () => {
                            context.dispatch({
                                type: context.actions.REPLACE,
                                payload: {
                                    apps: {
                                        ...context.apps,
                                        selected: []
                                    }
                                }
                            });
                        }}>
                        Deselect all
                    </Button>
                );
            }
            if (context.apps.selected.length < appsResponse.data.apps.length) {
                buttons.push(
                    <Button
                        key={"select-all"}
                        color={"grey"}
                        onClick={async () => {
                            context.dispatch({
                                type: context.actions.REPLACE,
                                payload: {
                                    apps: {
                                        ...context.apps,
                                        selected: appsResponse.data.apps
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
            function CreateAppForm(props) {
                const context = useContext(Context);
                const [form, setForm] = useState({
                    userId: "", name: "", redirectUri: ""
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
                    await context.requests.createApp(form).then(() => {
                        iziToast.info({
                            title: "Apps",
                            message: `Created app ${form.name}`
                        });
                    }).catch((e) => {
                        iziToast.error({
                            title: "Apps",
                            message: `Error creating app ${form.name}: ${e.message}`
                        });
                    });
                    await fetchApps();
                };
                return (
                    <Form onSubmit={(event, data) => {
                        console.debug(`${fnName} - creating app`, {event, data, context, props});
                    }}>
                        <Form.Field>
                            <label>userId</label>
                            <Dropdown
                                placeholder='userId'
                                fluid
                                search
                                selection
                                value={form.userId}
                                onChange={(event, data) => {
                                    console.debug(`${fnName} - onChange`, {event, data});
                                    const subForm = {};
                                    subForm["userId"] = data.value;
                                    setForm({
                                        ...form,
                                        ...subForm
                                    });
                                }}
                                options={userResponse.data.users.map((user, i) => {
                                    return {
                                        key: i, value: user.id, text: `${user.username}`
                                    }
                                })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>name</label>
                            <input placeholder='name' name={"name"} value={form.name} onChange={handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <label>redirectUri</label>
                            <input placeholder='redirectUri' name={"redirectUri"} value={form.redirectUri}
                                   onChange={handleChange}/>
                        </Form.Field>
                        <Button color={"green"} type='submit' onClick={onSaveUser}>Save</Button>
                    </Form>
                );
            }

            return <CreateAppForm {...props}/>;
        };
        const panes = [
            {
                menuItem: "Delete",
                render: () => (
                    <Tab.Pane>
                        <div className={"content"}>
                            <h4>{context.apps.selected.length} user(s) selected.</h4>
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
            data.apps.forEach((app) => {
                // assume the app data has always the same scheme
                for (const p in app) {
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
            const getCells = (app) => {
                const isSelected = context.apps.selected.filter((selectedApp) => {
                    return selectedApp.id === app.id;
                }).length > 0;
                const cells = [
                    (
                        <Table.Cell key={"selection"} className={"selection"}>
                            <Checkbox
                                checked={isSelected}
                                onChange={((event, data1) => {
                                    console.debug(`${fnName} - checkbox triggered`, {app, event, data1});
                                    updateSelection(app, event, data1);
                                    // TODO
                                })}
                            />
                        </Table.Cell>
                    )
                ];
                for (const p in app) {
                    cells.push(
                        <Table.Cell key={p}>{app[p].toString()}</Table.Cell>
                    );
                }
                return cells;
            };
            const rows = [];
            data.apps.forEach((app, index) => {
                rows.push(
                    <Table.Row key={index}>
                        {getCells(app)}
                    </Table.Row>
                );
            });
            return rows;
        };
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        {getTableHeaderCells(appsResponse.data)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {getTableRows(appsResponse.data)}
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
                        <h1>Apps</h1>
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
