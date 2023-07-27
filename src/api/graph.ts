import {R} from "./model";
import socket from "../config/socketConfig";
import axiosInstance from "../config/axiosConfig";
import {EdgeModel, NodeModel} from "../@types/x6";

import ActionOptionForm = R.ActionOptionForm;
import ActionTemplate = R.ActionTemplate;
import ActionOption = R.ActionOption;
import GraphData = R.GraphData;
import GraphAddForm = R.GraphAddForm;

export const retrieveAllTemplates = () => {
    return axiosInstance.get<ActionTemplate[]>("/graphs/templates")
}
export const retrieveGraph = (graphId: string) => {
    return axiosInstance.get<GraphData>(`/graphs/${graphId}`)
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


export function addGraph(values: GraphAddForm) {
    return axiosInstance.post('/graphs', values)
}

export const deleteEdge = (graphId: string, id: string) => {
    socket.send(`/app/graph/${graphId}/edge/delete`, id)
};


export const deleteNode = (graphId: string, id: string) => {
    socket.send(`/app/graph/${graphId}/node/delete`, id)
};


export const addEdge = (graphId: string, edge: EdgeModel) => {
    socket.send(`/app/graph/${graphId}/edge/create`, edge)
}

export const addNode = (graphId: string, node: NodeModel) => {
    socket.send(`/app/graph/${graphId}/node/create`, node)
}
export const moveNode = (graphId: string, moveEvent: R.MoveNodeEvent) => {
    socket.send(`/app/graph/${graphId}/node/move`, moveEvent)
}

export const execute = (graphId: string) => {
    socket.send(`/app/graph/${graphId}/execution`)
}
