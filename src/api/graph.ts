import {R} from "./model";
import axiosInstance from "../config/axiosConfig";
import socket from "../config/socketConfig";

import ActionTemplate = R.ActionTemplate;
import ActionOption = R.ActionOption;
import GraphData = R.GraphData;
import ActionOptionForm = R.ActionOptionForm;
export const retrieveAllTemplates = () => {
    return axiosInstance.get<ActionTemplate[]>("/graph/templates")
}
export const retrieveGraph = () => {
    return axiosInstance.get<GraphData>("/graph")
}


export const retrieveActionOptions = (nodeId: string) => {
    return axiosInstance.get<ActionOption[]>(`/graph/node/${nodeId}/options`)
}


export const updateActionOptions = (nodeId: string, values: ActionOptionForm) => {
    return axiosInstance.post<ActionOptionForm>(`/graph/node/${nodeId}/options`, values)
};

export const deleteEdge = (id: string) => {
    socket.send("/app/graph/mock-id/edge/delete", id)
};


export const deleteNode = (id: string) => {
    socket.send("/app/graph/mock-id/node/delete", id)
};


export const addEdge = (edge: R.Edge) => {
    socket.send("/app/graph/mock-id/edge/create", edge)
}

export const addNode = (node: any) => {
    socket.send("/app/graph/mock-id/node/create", node)
}
export const moveNode = (moveEvent: R.MoveNodeEvent) => {
    socket.send("/app/graph/mock-id/node/move", moveEvent)
}

export const execute = () => {
    socket.send("/app/graph/mock-id/execution")
}
