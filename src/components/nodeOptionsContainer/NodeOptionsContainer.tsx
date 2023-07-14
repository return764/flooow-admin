import React, {useEffect, useMemo, useState} from 'react';
import Paper from "../Paper";
import {Graph} from "@antv/x6";
import {App, Button, Divider, Form, Input, Select} from "antd";
import './NodeOptionsContainer.css';
import API from "../../api";
import {R} from "../../api/model";
import FormItem from "antd/es/form/FormItem";
import {useForm} from "antd/es/form/Form";
import {DragDropContext, Draggable, Droppable, OnDragEndResponder} from 'react-beautiful-dnd';
import {clone, isEmpty} from "lodash";
import OptionInputType = R.OptionInputType;

type NodeOptionsContainerProps = {
    graph: Graph
}

function NodeOptionsContainer(props: NodeOptionsContainerProps) {
    const {graph} = props;
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<R.ActionOption[]>([])
    const [nodeId, setNodeId] = useState<string>()
    const {message} = App.useApp()
    const [form] = useForm()

    const inputOptions = useMemo(() => options.filter(it => it.inputType === OptionInputType.LAST_INPUT), [options])
    const defaultOptions = useMemo(() => options.filter(it => it.inputType === OptionInputType.DEFAULT), [options])
    const initialValue = useMemo(() => options?.reduce((previous, current) => {
        return Object.assign({}, previous, {[current.label]: current.value})
    }, {}), [options])

    useEffect(() => {
        graph.on('node:click', (pop) => {
            setNodeId(pop.node.id)
            setOptions([])
            API.graph.retrieveActionOptions(pop.node.id)
                .then(r => {
                    setOptions(r.data)
                    setOpen(true)
                })
        })
        graph.on('blank:click', () => {
            setOpen(false);
        })
    }, [])

    const renderDefaultOptions = () => {
        return defaultOptions.map((it, index) => {
            return (
                <Draggable key={`${it.label}-drag`} draggableId={it.label} index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FormItem
                                key={it.label} name={it.label} label={it.label}>
                                <Input/>
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
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FormItem
                                key={it.label} name={it.label} label={it.label}>
                                <Select/>
                            </FormItem>
                        </div>
                    )}
                </Draggable>
            )
        })
    }

    const handleSubmit = () => {
        let formValue = form.getFieldsValue();
        const formOptions = clone(options).map(it => {
            it.value = formValue[it.label]
            return it
        })
        API.graph.updateActionOptions(nodeId!!, {data: formOptions})
            .then(() => message.success("success"))
    }

    const handleDragEnd: OnDragEndResponder = (result) => {
        console.log(result.source.index, result.destination?.index)
        if (result.destination?.droppableId === 'input-from') {
            setOptions((options) => {
                const arr = clone(options)
                arr[result.source.index].inputType = OptionInputType.LAST_INPUT
                return arr
            })
        }
        if (result.destination?.droppableId === 'basic') {
            setOptions((options) => {
                const arr = clone(options)
                arr[result.source.index].inputType = OptionInputType.DEFAULT
                return arr
            })
        }
    }

    return (
        <Paper id='node-options-container'
               hidden={!open}
        >
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
