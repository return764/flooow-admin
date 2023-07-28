import React, {useEffect, useState} from 'react';
import {Button, Progress, Space} from "antd";
import SocketStatus from "../socket-status";
import './index.css';
import Paper from "../paper";
import {Graph} from "@antv/x6";
import API from "../../api";
import {useParams} from "react-router-dom";
import useEmit from "../../hooks/useEmit";
import {EmitterType} from "../../context/EmitterContext";

type ToolBarProps = {
    graph: Graph
}

const ToolBar: React.FC<ToolBarProps> = ({graph}) => {
    const [executing, setExecuting] = useState(false);
    const [online, setOnline] = useState(false);
    const executeEmitter = useEmit(EmitterType.GRAPH_RUNNING)
    const actionSuccessEmitter = useEmit(EmitterType.ACTION_SUCCESS)
    const socketConnectedEmitter = useEmit(EmitterType.SOCKET_CONNECTED)
    const {graphId} = useParams()
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const handler = executeEmitter.on((flag) => setExecuting(flag))
        const handler1 = actionSuccessEmitter.on(() => {
            const actionCount = graph.getNodes().length
            setPercent(p => ((p+1) / actionCount * 100))
        })
        const handler2 = socketConnectedEmitter.on((flag) => setOnline(flag))
        return () => {
            executeEmitter.removeListener(handler)
            actionSuccessEmitter.removeListener(handler1)
            socketConnectedEmitter.removeListener(handler2)
        }
    }, [])

    const onExecute = () => {
        graph.getCells()
            .map(it=> it.setData({status: "NEW"}))
        setPercent(0)
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
                    <Button onClick={onExecute} loading={executing} disabled={!online}>执行</Button>
                    <Button onClick={onExecute}>保存</Button>
                </Space>
                <SocketStatus online={online}/>
            </Paper>
            <Progress className='execution-progress' percent={percent} showInfo={false} strokeLinecap='round'/>
        </div>

    );
};

export default ToolBar;
