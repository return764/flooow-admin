import React, {useEffect, useState} from 'react';
import {App, Button, List} from "antd";
import API from "../../api";
import {R} from "../../api/model";
import GraphSummary = R.GraphSummary;
import {useNavigate} from "react-router-dom";
import useEmit from "../../hooks/useEmit";
import {EmitterType} from "../../context/EmitterContext";

interface GraphListProps {

}

const GraphList: React.FC<GraphListProps> = () => {
    const [list, setList] = useState<GraphSummary[]>();
    const navigate = useNavigate();
    const {message} = App.useApp()
    const {emit, on, removeListener} = useEmit(EmitterType.GRAPH_LIST_CHANGE)

    function requestList() {
        API.graph.retrieveGraphList().then(r => {
            setList(r.data)
        })
    }

    useEffect(() => {
        on(requestList)
        requestList();
        return () => {
            removeListener(requestList)
        }
    }, [])

    const handleEditGraph = (graph: GraphSummary) => {
        return () => {
            navigate(`/draw/${graph.id}`)
        }
    }

    const handleDeleteGraph = (graph: GraphSummary) => {
        return () => {
            API.graph.deleteGraph(graph.id).then(_ => {
                message.success('delete graph success!')
                emit()
            })
        }
    }

    return (
        <List
            itemLayout="horizontal"
            dataSource={list}
            size="small"
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button type={"primary"} onClick={handleEditGraph(item)}>Edit</Button>,
                        <Button danger onClick={handleDeleteGraph(item)}>Delete</Button>]}
                >
                    <div>{item.name}</div>
                </List.Item>
            )}
        />
    );
};

export default GraphList;
