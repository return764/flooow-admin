import {R} from "./model";
import axiosInstance from "../config/axiosConfig";
import socket from "../config/socketConfig";




import ActionTemplate = R.ActionTemplate;
import ActionOption = R.ActionOption;
import GraphData = R.GraphData;
import ActionOptionForm = R.ActionOptionForm;
import {EdgeModel, NodeModel} from "../@types/x6";
export const retrieveAllTemplates = () => {
    return axiosInstance.get<ActionTemplate[]>("/graphs/templates")
}
export const retrieveGraph = () => {
    return axiosInstance.get<GraphData>("/graphs")
}

export const retrieveGraphList = () => {
    return axiosInstance.get("/graphs")
};

export const retrieveActionOptions = (nodeId: string) => {
    return axiosInstance.get<ActionOption[]>(`/graphs/node/${nodeId}/options`)
}


export const updateActionOptions = (nodeId: string, values: ActionOptionForm) => {
    return axiosInstance.post<ActionOptionForm>(`/graphs/node/${nodeId}/options`, values)
};

export const deleteEdge = (id: string) => {
    socket.send("/app/graph/mock-id/edge/delete", id)
};


export const deleteNode = (id: string) => {
    socket.send("/app/graph/mock-id/node/delete", id)
};


export const addEdge = (edge: EdgeModel) => {
    socket.send("/app/graph/mock-id/edge/create", edge)
}

export const addNode = (node: NodeModel) => {
    socket.send("/app/graph/mock-id/node/create", node)
}
export const moveNode = (moveEvent: R.MoveNodeEvent) => {
    socket.send("/app/graph/mock-id/node/move", moveEvent)
}

export const execute = () => {
    socket.send("/app/graph/mock-id/execution")
}
