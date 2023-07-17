import React, {useCallback, useMemo, useState} from 'react';
import {R} from "../../api/model";
import {EdgeModel, NodeModel} from "../../@types/x6";
import GraphData = R.GraphData;
import {GraphContext} from "./GraphContext";


const baseData: GraphData = {
    nodes: [],
    edges: [],
};

const GraphContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [nodes, setNodes] = useState<NodeModel[]>(baseData.nodes);
    const [edges, setEdges] = useState<EdgeModel[]>(baseData.edges);
    const graphData = useMemo(() => ({
        nodes: nodes,
        edges: edges,
    }), [nodes, edges]);

    const initGraphData = (data: GraphData) => {
        setNodes((prevNodes) => [...prevNodes, ...data.nodes])
        setEdges((prevEdges) => [...prevEdges, ...data.edges])
    }

    const listNodes = useCallback(() => {
        return nodes
    }, [nodes])

    const listEdges = useCallback(() => {
        return edges
    }, [edges])

    const getNodeModelById = useCallback((id: String) => {
        return nodes.find((it) => it.id === id)
    }, [nodes])

    const addNodeModel = useCallback((node: NodeModel) => {
        setNodes((prevNodes) => [...prevNodes, node])
    }, [nodes])

    return (
        <GraphContext.Provider value={{
            initGraphData,
            graphData,
            listNodes,
            listEdges,
            addNodeModel,
            getNodeModelById,
        }}>
            {children}
        </GraphContext.Provider>
    )

};
export default GraphContextProvider;
