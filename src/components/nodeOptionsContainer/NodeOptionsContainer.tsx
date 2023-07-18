import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import Paper from "../Paper";
import {Graph, NodeView} from "@antv/x6";
import {App, Button, Divider, Form, Input, Select} from "antd";
import './NodeOptionsContainer.css';
import API from "../../api";
import {R} from "../../api/model";
import FormItem from "antd/es/form/FormItem";
import {useForm} from "antd/es/form/Form";
import {DragDropContext, Draggable, Droppable, OnDragEndResponder} from 'react-beautiful-dnd';
import {clone, isEmpty} from "lodash";
import OptionInputType = R.OptionInputType;
import {NodeModel} from "../../@types/x6";
import {GraphContext} from "../../pages/drawPanel/GraphContext";
import {DefaultOptionType} from "rc-select/lib/Select";

type NodeOptionsContainerProps = {
    graph: Graph
}

function NodeOptionsContainer(props: NodeOptionsContainerProps) {
    const {graph} = props;
    const [open, setOpen] = useState(false)
    const [selectOptions, setSelectOptions] = useState<DefaultOptionType[]>([])
    const [options, setOptions] = useState<R.ActionOption[]>([])
    const [nodeModel, setNodeModel] = useState<NodeModel>()
    const {getNodeModelById} = useContext(GraphContext)
    const {message} = App.useApp()
    const [form] = useForm()

    const inputOptions = useMemo(() => options.filter(it => it.inputType === OptionInputType.LAST_INPUT), [options])
    const defaultOptions = useMemo(() => options.filter(it => it.inputType === OptionInputType.DEFAULT), [options])
    const initialValue = useMemo(() => options?.reduce((previous, current) => {
        return Object.assign({}, previous, {[current.label]: current.value})
    }, {}), [options])

    useEffect(() => {
        graph.on('node:click', openOptionsDrawer)
        graph.on('blank:click', closeOptionsDrawer)
        return () => {
            graph.off('node:click', openOptionsDrawer)
            graph.off('blank:click', closeOptionsDrawer)
        }
    }, [getNodeModelById])

    const openOptionsDrawer = useCallback((pop: NodeView.EventArgs['node:click']) => {
        setNodeModel(getNodeModelById(pop.node.id))
        setOptions([])
        API.graph.retrieveActionOptions(pop.node.id)
            .then(r => {
                const incomingNodes = graph.getNeighbors(pop.cell, {incoming: true})
                setSelectOptions(incomingNodes
                    .map(it => getNodeModelById(it.id))
                    .map(it => ({
                        label: it?.name,
                        value: it?.id
                    })))
                setOptions(r.data)
                setOpen(true)
            })
    }, [getNodeModelById]);
    const closeOptionsDrawer = () => {
        setOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue(initialValue)
    }, [form, initialValue])

    const renderDefaultOptions = () => {
        return defaultOptions.map((it, index) => {
            return (
                <Draggable key={`${it.label}-drag`} draggableId={it.label} index={index}>
                    {(provided, _) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FormItem
                                key={it.label} name={it.label} label={it.label}>
                                <Input value={it.value}/>
                            </FormItem>
                        </div>
                    )}
                </Draggable>
            )
        })
    }

    const renderInputOptions = () => {
        return inputOptions.map((it, index) => {
            return (
                <Draggable key={`${it.label}-drag`} draggableId={it.label} index={index}>
                    {(provided, _) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FormItem
                                rules={[
                                    {
                                        validator: async (_, value) => {
                                            if (!selectOptions.map(it => it.value).includes(value)) {
                                                throw new Error("please select existing node")
                                            }
                                        }
                                    }
                                ]}
                                key={it.label} name={it.label} label={it.label}>
                                <Select options={selectOptions}/>
                            </FormItem>
                        </div>
                    )}
                </Draggable>
            )
        })
    }

    const handleSubmit = async () => {
        try {
            await form.validateFields()
            let formValue = form.getFieldsValue();
            const formOptions = clone(options).map(it => {
                it.value = formValue[it.label]
                return it
            })
            API.graph.updateActionOptions(nodeModel?.id!!, {data: formOptions})
                .then(() => message.success("success"))
        } catch (e) { }
    }

    const handleDragEnd: OnDragEndResponder = (result) => {
        if (result.destination?.droppableId === 'input-from') {
            setOptions((_) => {
                const arr = clone(defaultOptions)
                arr[result.source.index].inputType = OptionInputType.LAST_INPUT
                form.setFieldValue(arr[result.source.index].label, selectOptions[0]?.value ?? null)
                return [...arr, ...inputOptions]
            })
        }
        if (result.destination?.droppableId === 'basic') {
            setOptions((_) => {
                const arr = clone(inputOptions)
                arr[result.source.index].inputType = OptionInputType.DEFAULT
                form.setFieldValue(arr[result.source.index].label, null)
                return [...arr, ...defaultOptions]
            })
        }
    }

    return (
        <Paper id='node-options-container'
               hidden={!open}
        >
            <p>{nodeModel?.name}</p>
            <DragDropContext onDragEnd={handleDragEnd}>
                {(!isEmpty(options) || !isEmpty(inputOptions)) && <Form
                  labelCol={{span: 8}}
                  initialValues={initialValue}
                  form={form}>
                  <Droppable droppableId='basic'>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               style={{backgroundColor: snapshot.isDraggingOver ? 'blue' : ''}}>
                              {renderDefaultOptions()}
                              {provided.placeholder}
                          </div>
                      )}
                  </Droppable>
                  <Divider plain={true}>
                    Input From
                  </Divider>
                  <Droppable droppableId='input-from'>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               style={{backgroundColor: snapshot.isDraggingOver ? 'blue' : ''}}>
                              {renderInputOptions()}
                              {provided.placeholder}
                          </div>
                      )}
                  </Droppable>
                </Form>}
                <Button onClick={handleSubmit}>保存</Button>
            </DragDropContext>
        </Paper>
    );
}

export default NodeOptionsContainer;
