import React, {useEffect, useState} from 'react';
import Paper from "../Paper";
import {Graph} from "@antv/x6";
import {App, Button, Form, Input} from "antd";
import './NodeOptionsContainer.css';
import API from "../../api";
import FormItem from "antd/es/form/FormItem";
import {R} from "../../api/api";
import {useForm} from "antd/es/form/Form";

type NodeOptionsContainerProps = {
    graph: Graph
}

function NodeOptionsContainer(props: NodeOptionsContainerProps) {
    const {graph} = props;
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<R.ActionOption[]>()
    const [nodeId, setNodeId] = useState<string>()
    const {message} = App.useApp()
    const [form] = useForm()

    useEffect(() => {
        graph.on('node:click', (pop) => {
            setOpen(true);
            setNodeId(pop.node.id)
            API.graph.retrieveActionOptions(pop.node.id)
                .then(r => setOptions(r.data))
        })
        graph.on('blank:click', () => {
            setOpen(false);
        })
    }, [])

    const renderOptions = () => {
        const initialValue = options?.reduce((previous, current) => {
            return Object.assign({}, previous, {[current.label]: current.value})
        }, {})
        return (
            <Form
                initialValues={initialValue}
                form={form}>
                {options?.map(it => {
                    return (
                        <FormItem key={it.label} name={it.label} label={it.label}>
                            <Input/>
                        </FormItem>
                    )
                })}
            </Form>
        )
    }

    const handleSubmit = () => {
        API.graph.updateActionOptions(nodeId!!, form.getFieldsValue())
            .then(() => message.success("success"))
    }

    return (
        <Paper id='node-options-container'
               hidden={!open}
        >
            {options && renderOptions()}
            <Button onClick={handleSubmit}>保存</Button>
        </Paper>
    );
}

export default NodeOptionsContainer;
