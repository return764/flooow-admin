import {createContext} from "react";
import {EdgeModel, NodeModel} from "../../@types/x6";
import {R} from "../../api/model";
import GraphData = R.GraphData;


export interface GraphContextProps {
    initGraphData(data: GraphData): void
    graphData: GraphData,
    listNodes(): NodeModel[],
    listEdges(): EdgeModel[],
    addNodeModel(node: NodeModel): void,
    getNodeModelById(id: String): NodeModel | undefined
}
export const GraphContext = createContext({} as GraphContextProps)
