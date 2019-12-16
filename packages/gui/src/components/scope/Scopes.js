import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../App";
import "./Scopes.css";
import {Navbar} from "../navbar/Navbar";
import {Content} from "../content/Content";
import {Button, Table, Form, Tab, Checkbox, Dropdown} from "semantic-ui-react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.css";

export function Scopes(props) {
    const fnName = "Scopes";
    const context = useContext(Context);
    const [isVisible, setIsVisible] = useState(false);
    const [scopesResponse, setScopesResponse] = useState({
        data: {
            scopes: []
        }
    });
    useEffect(() => {
        console.debug(`${fnName} - useEffect - context changed`, {context, props});
        fetchScopes();
    }, [context]);
    const fetchScopes = async () => {
        if (context.requests) {
            const scopesResponse = await context.requests.getScopes();
            console.debug(`${fnName} - fetchScopes`, {scopesResponse, context, props});
            setScopesResponse(scopesResponse);
        }
    };
    const updateSelection = (scope, event, data) => {
        context.dispatch({
            type: context.actions.REPLACE,
            payload: {
                scopes: {
                    ...context.scopes,
                    selected: data.checked ? [scope, ...context.scopes.selected] : context.scopes.selected.filter((selectedScope) => {
                        return selectedScope !== scope;
                    })
                }
            }
        });
    };
    const getActions = () => {
        const deleteSelection = async () => {
            for (let i = 0; i < context.scopes.selected.length; i++) {
                const scopeToDelete = context.scopes.selected[i];
                await context.requests.deleteScope(scopeToDelete).catch((error) => {
                    console.error(`${fnName} - could not delete scope`, {error, scopeToDelete});
                });
                // clear the selection after the scope deletes something
                context.dispatch({
                    type: context.actions.REPLACE,
                    payload: {
                        scopes: {
                            ...context.scopes,
                            selected: []
                        }
                    }
                });
            }
        };
        const getDeleteAction = () => {
            const buttons = [];
            if (context.scopes.selected.length > 0) {
                buttons.push(
                    <Button
                        key={"delete"}
                        color={"red"}
                        onClick={async () => {
                            await deleteSelection();
                            fetchScopes();
                        }}>
                        Delete
                    </Button>
                );
            }
            if (context.scopes.selected.length > 0) {
                buttons.push(
                    <Button
                        key={"deselect-all"}
                        color={"grey"}
                        onClick={async () => {
                            context.dispatch({
                                type: context.actions.REPLACE,
                                payload: {
                                    scopes: {
                                        ...context.scopes,
                                        selected: []
                                    }
                                }
                            });
                        }}>
                        Deselect all
                    </Button>
                );
            }
            let scopes = scopesResponse.data.scopes || [];
            if (context.scopes.selected.length < scopes.length) {
                buttons.push(
                    <Button
                        key={"select-all"}
                        color={"grey"}
                        onClick={async () => {
                            context.dispatch({
                                type: context.actions.REPLACE,
                                payload: {
                                    scopes: {
                                        ...context.scopes,
                                        selected: scopesResponse.data.scopes
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
            function CreateScopeForm(props) {
                const context = useContext(Context);
                const [form, setForm] = useState({
                    scopes: []
                });
                const [options, setOptions] = useState([]);
                const handleChange = (event, data) => {
                    console.debug(`${fnName} - handleChange`, {event, data});
                    setForm({
                        ...form,
                        scopes: data.value
                    });
                };
                const handleAddition = (event, data) => {
                    console.debug(`${fnName} - handleAddition`, {event, data});
                    setOptions([...options, {
                        key: data.value, value: data.value, text: data.value
                    }]);
                    setForm({
                        ...form,
                        scopes: [...form.scopes, data.value]
                    });
                };
                const onSaveScope = async () => {
                    await context.requests.createScope(form).then(() => {
                        iziToast.info({
                            title: "Scope",
                            message: `Created scopes ${JSON.stringify(form.scopes)}`
                        });
                    }).catch((e) => {
                        iziToast.error({
                            title: "Scope",
                            message: `Error creating scopes ${JSON.stringify(form.scopes)}: ${e.message}`
                        });
                    });
                    await fetchScopes();
                };
                return (
                    <Form onSubmit={(event, data) => {
                        console.debug(`${fnName} - creating scopes`, {event, data, context, props});
                    }}>
                        <Form.Field>
                            <label>scopes</label>
                            <Dropdown
                                placeholder='scopes'
                                name={"scopes"}
                                options={options}
                                search
                                selection
                                fluid
                                allowAdditions
                                value={form.scopes}
                                multiple={true}
                                onAddItem={handleAddition}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Button color={"green"} type='submit' onClick={onSaveScope}>Save</Button>
                    </Form>
                );
            }

            return <CreateScopeForm {...props}/>;
        };
        const panes = [
            {
                menuItem: "Delete",
                render: () => (
                    <Tab.Pane>
                        <div className={"content"}>
                            <h4>{context.scopes.selected.length} scopes(s) selected.</h4>
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
        const getTableHeaderCells = () => {
            const headerCells = [];
            headerCells.push(
                <Table.HeaderCell key={"selection"}>{"selection"}</Table.HeaderCell>
            );
            headerCells.push(
                <Table.HeaderCell key={"scope"}>{"scope"}</Table.HeaderCell>
            );
            return headerCells;
        };
        const getTableRows = (data) => {
            const getCells = (scope) => {
                const isSelected = context.scopes.selected.filter((selecedScope) => {
                    return selecedScope === scope;
                }).length > 0;
                const cells = [
                    (
                        <Table.Cell key={"selection"} className={"selection"}>
                            <Checkbox
                                checked={isSelected}
                                onChange={((event, data1) => {
                                    console.debug(`${fnName} - checkbox triggered`, {scope, event, data1});
                                    updateSelection(scope, event, data1);
                                    // TODO
                                })}
                            />
                        </Table.Cell>
                    )
                ];
                cells.push(
                    <Table.Cell key={scope}>{scope.toString()}</Table.Cell>
                );
                return cells;
            };
            const rows = [];
            let scopes = data.scopes || [];
            scopes.forEach((scope, index) => {
                rows.push(
                    <Table.Row key={index}>
                        {getCells(scope)}
                    </Table.Row>
                );
            });
            return rows;
        };
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        {getTableHeaderCells(scopesResponse.data)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {getTableRows(scopesResponse.data)}
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
                        <h1>Scopes</h1>
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
