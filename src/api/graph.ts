import {R} from "./model";
import socket from "../config/socketConfig";
import axiosInstance from "../config/axiosConfig";
import {EdgeModel, NodeModel} from "../@types/x6";

import ActionTemplate = R.ActionTemplate;
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

export function addGraph(values: GraphAddForm) {
    return axiosInstance.post('/graphs', values)
}


export function deleteGraph(graphId: string) {
    return axiosInstance.delete(`/graphs/${graphId}`)
}

export const execute = (graphId: string) => {
    return axiosInstance.post(`/graphs/${graphId}/execution`)
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
