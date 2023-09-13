import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Graph, KeyValue, NodeView} from "@antv/x6";
import {App, Button, Divider, Drawer, Form, Input, Select, Space} from "antd";
import './index.css';
import API from "../../api";
import {R} from "../../api/model";
import FormItem from "antd/es/form/FormItem";
import {useForm} from "antd/es/form/Form";
import {DragDropContext, Draggable, Droppable, OnDragEndResponder} from 'react-beautiful-dnd';
import {clone, isEmpty, map} from "lodash";
import {NodeModel} from "../../@types/x6";
import {GraphContext} from "../../context/GraphContext";
import {CloseOutlined} from "@ant-design/icons";
import OptionInputType = R.OptionInputType;
import Option = R.Option;
import OptionType = R.OptionType;

type KeyValueObject = {
    key: string,
    value: string
}

type NodeOptionsContainerProps = {
    graph: Graph
}

type OptionFormItemProps = {
    it: R.ActionOption
    nodeModel: NodeModel,
    graph: Graph,
}

const OptionFormItem = ({it, nodeModel, graph}: OptionFormItemProps) => {
    const {getNodeModelById} = useContext(GraphContext)
    const [enumOptions, setEnumOptions] = useState<Option[]>([])
    const [listPair, setListPair] = useState([]);

    useEffect(() => {
        if (it.type === OptionType.ENUM) {
            handleFetchEnumOptions()
        }
    }, [])

    const handleFetchEnumOptions = () => {
        API.node.retrieveEnumOptions(it.id).then(r => {
            setEnumOptions(r.data)
        })
    }

    if (it.inputType === OptionInputType.LAST_OUTPUT) {
        const incomingNodes = graph.getNeighbors(graph.getCellById(nodeModel.id!!), {incoming: true})
        const selectOptions = incomingNodes
            .map(it => getNodeModelById(it.id))
            .map(it => ({
                label: it?.name,
                value: it?.id
            }))

        return (
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
        )
    }

    if (it.type === OptionType.ENUM) {
        return (
            <FormItem
                rules={[
                    {
                        validator: async (_, value) => {
                            if (!enumOptions.map(it => it.value).includes(value)) {
                                throw new Error("please select existing node")
                            }
                        }
                    }
                ]}
                key={it.label} name={it.label} label={it.label}>
                <Select options={enumOptions}/>
            </FormItem>
        )
    }

    if (it.type === OptionType.MAP) {
        return (
            <FormItem label={it.label}>
                <Form.List name={it.label}>
                    {(subFields, subOpt) => (
                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                            {subFields.map((subField) => (
                                <Space key={subField.key}>
                                    <Form.Item noStyle name={[subField.name, 'key']}>
                                        <Input placeholder="key" />
                                    </Form.Item>
                                    <Form.Item noStyle name={[subField.name, 'value']}>
                                        <Input placeholder="value" />
                                    </Form.Item>
                                    <CloseOutlined
                                        onClick={() => {
                                            subOpt.remove(subField.name);
                                        }}
                                    />
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => subOpt.add()} block>
                                + Add
                            </Button>
                        </div>
                    )}
                </Form.List>
            </FormItem>
        )
    }

    return (
        <FormItem
            key={it.label} name={it.label} label={it.label}>
            <Input value={it.value}/>
        </FormItem>
    )
}

function NodeOptionsContainer(props: NodeOptionsContainerProps) {
    const {graph} = props;
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<R.ActionOption[]>([])
    const [nodeModel, setNodeModel] = useState<NodeModel>()
    const {getNodeModelById} = useContext(GraphContext)
    const {message} = App.useApp()
    const formRef = useRef(null)
    const [form] = useForm()

    const inputOptions = useMemo(() => options.filter(it => it.inputType === OptionInputType.LAST_OUTPUT), [options])
    const defaultOptions = useMemo(() => options.filter(it => it.inputType === OptionInputType.DEFAULT), [options])
    const initialValue = useMemo(() => options?.reduce((previous, current) => {
        if (current.type == OptionType.MAP) {
            return {
                ...previous,
                [current.label]: map((current.value as KeyValue), (key, value) => ({key, value}))
            }
        }

        return {
            ...previous,
            [current.label]: current.value
        }
    }, {}), [options])

    useEffect(() => {
        graph.on('node:click', openOptionsDrawer)
        return () => {
            graph.off('node:click', openOptionsDrawer)
        }
    }, [getNodeModelById])

    const openOptionsDrawer = useCallback(async (pop: NodeView.EventArgs['node:click']) => {
        setNodeModel(getNodeModelById(pop.node.id))
        setOptions([])
        const { data } = await API.node.retrieveActionOptions(pop.node.id)
        setOptions(data)
        setOpen(true)
    }, [getNodeModelById]);
    const closeOptionsDrawer = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (formRef.current) {
            form.resetFields()
        }
    }, [JSON.stringify(initialValue)])

    const renderDefaultOptions = () => {
        return defaultOptions.map((it, index) => {
            return renderDraggableOption(it, index)
        })
    }

    function renderDraggableOption(it: R.ActionOption, index: number) {
        return (
            <Draggable key={`${it.label}-drag`} draggableId={it.label} index={index}>
                {(provided, _) => (
                    <div
                        className={'draggable-container'}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <OptionFormItem it={it} nodeModel={nodeModel!!} graph={graph}/>
                    </div>
                )}
            </Draggable>
        );
    }

    const renderInputOptions = () => {
        return inputOptions.map((it, index) => {
            return renderDraggableOption(it, index)
        })
    }

    const handleSubmit = async () => {
        console.log(form.getFieldsValue())
        try {
            await form.validateFields()
            let formValue = form.getFieldsValue();
            const formOptions = clone(options).map(it => {
                it.value = formValue[it.label]
                if (it.type == OptionType.MAP) {
                    it.value = (formValue[it.label] as KeyValueObject[]).reduce((acc, item) => {
                        acc[item.key] = item.value;
                        return acc;
                    }, {} as KeyValue)
                    console.log(it.value)
                }
                return it
            })
            API.node.updateActionOptions(nodeModel?.id!!, {data: formOptions})
                .then(() => message.success("success"))
        } catch (e) { }
    }

    const handleDragEnd: OnDragEndResponder = (result) => {
        const {source, destination} = result
        if (source.droppableId === 'basic' && destination?.droppableId === 'input-from') {
            setOptions((_) => {
                const arr = clone(defaultOptions)
                arr[source.index].inputType = OptionInputType.LAST_OUTPUT
                return [...arr, ...inputOptions]
            })
        }
        if (source.droppableId === 'input-from' && destination?.droppableId === 'basic') {
            setOptions((_) => {
                const arr = clone(inputOptions)
                arr[source.index].inputType = OptionInputType.DEFAULT
                return [...arr, ...defaultOptions]
            })
        }
    }

    return (
        <Drawer
            title={nodeModel?.name}
            className='node-options-container'
            width={400}
            open={open}
            getContainer={false}
            onClose={closeOptionsDrawer}
            footer={<Button onClick={handleSubmit}>保存</Button>}
        >
            <DragDropContext onDragEnd={handleDragEnd}>
                {(!isEmpty(options) || !isEmpty(inputOptions)) && <Form
                  ref={formRef}
                  labelCol={{span: 8}}
                  initialValues={initialValue}
                  form={form}>
                  <Divider plain={true}>
                    Input From User Input
                  </Divider>
                  <Droppable droppableId='basic'>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               className={`droppable-container ${snapshot.isDraggingOver && 'isDragging'}`}>
                              {renderDefaultOptions()}
                              {provided.placeholder}
                          </div>
                      )}
                  </Droppable>
                  <Divider plain={true}>
                    Input From Previous Action
                  </Divider>
                  <Droppable droppableId='input-from'>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               className={`droppable-container ${snapshot.isDraggingOver && 'isDragging'}`}>
                              {renderInputOptions()}
                              {provided.placeholder}
                          </div>
                      )}
                  </Droppable>
                </Form>}
            </DragDropContext>
        </Drawer>
    );
}

export default NodeOptionsContainer;
