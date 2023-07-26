import React, {useEffect, useState} from 'react';
import {Button, List} from "antd";
import API from "../../api";
import {R} from "../../api/model";
import GraphSummary = R.GraphSummary;

interface GraphListProps {

}

const GraphList: React.FC<GraphListProps> = () => {
    const [list, setList] = useState<GraphSummary[]>();

    useEffect(() => {
        API.graph.retrieveGraphList().then(r => {
            setList(r.data)
        })
    }, [])

    return (
        <List
            itemLayout="horizontal"
            dataSource={list}
            size="small"
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button type={"primary"}>Edit</Button>,
                        <Button danger>Delete</Button>]}
                >
                    <div>{item.name}</div>
                </List.Item>
            )}
        />
    );
};

export default GraphList;
