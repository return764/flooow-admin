import React, {useEffect, useState} from 'react';
import {Button, Progress, Space} from "antd";
import SocketStatus from "../socket-status";
import './index.css';
import Paper from "../paper";
import {Graph} from "@antv/x6";
import API from "../../api";
import {useParams} from "react-router-dom";
import useEmit from "../../hooks/useEmit";

type ToolBarProps = {
    graph: Graph
}

const ToolBar: React.FC<ToolBarProps> = ({graph}) => {
    const [executing, setExecuting] = useState(false);
    const executeEmitter = useEmit('graph-running')
    const {graphId} = useParams()

    useEffect(() => {
        const handler = executeEmitter.on((flag) => setExecuting(flag))
        return () => {
            executeEmitter.removeListener(handler)
        }
    }, [])

    const onExecute = () => {
        graph.getCells()
            .map(it=> it.setData({status: "NEW"}))
        setExecuting(true)
        API.graph.execute(graphId!!).catch(() => {
            setExecuting(false)
        })
    }

    const onCenterContent = () => {
        graph.centerContent()
    }


    return (
        <div className='tool-bar-wrapper'>
            <Paper className='tool-bar'>
                <Space>
                    <Button onClick={onCenterContent}>画布居中</Button>
                    <Button onClick={onExecute} loading={executing}>执行</Button>
                    <Button onClick={onExecute}>保存</Button>
                </Space>
                <SocketStatus/>
            </Paper>
            <Progress className='execution-progress' percent={40} showInfo={false} strokeLinecap='round'/>
        </div>

    );
};

export default ToolBar;
