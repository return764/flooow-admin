import React, {useEffect, useState} from 'react';
import Paper from "../Paper";
import {Graph} from "@antv/x6";
import {Button, Form, Input} from "antd";
import './NodeOptionsContainer.css';
import API from "../../api";
import FormItem from "antd/es/form/FormItem";
import {R} from "../../api/api";

type NodeOptionsContainerProps = {
    graph: Graph
}

function NodeOptionsContainer(props: NodeOptionsContainerProps) {
    const {graph} = props;
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<R.ActionOption[]>()

    useEffect(() => {
        graph.on('node:click', (pop) => {
            setOpen(true);
            // 通过节点id获取options
            API.graph.retrieveActionOptions(pop.node.id)
                .then(r => setOptions(r.data))
        })
        graph.on('blank:click', () => {
            setOpen(false);
        })
    }, [])

    const renderOptions = () => {
        return (
            <Form>
                {options?.map(it => {
                    return (
                        <FormItem key={it.label} label={it.label}>
                            <Input/>
                        </FormItem>
                    )
                })}
            </Form>
        )
    }

    return (
        <Paper id='node-options-container'
               hidden={!open}
        >
            {renderOptions()}
            <Button>保存</Button>
        </Paper>
    );
}

export default NodeOptionsContainer;
