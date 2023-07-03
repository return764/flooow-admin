import {R} from "./api";
import axiosInstance from "../config/axiosConfig";
import socket from "../config/socketConfig";
import ActionTemplate = R.ActionTemplate;
import ActionOption = R.ActionOption;
import GraphData = R.GraphData;


export const retrieveAllTemplates = () => {
    return axiosInstance.get<ActionTemplate[]>("/graph/templates")
}


export const retrieveGraph = () => {
    return axiosInstance.get<GraphData>("/graph")
}

export const retrieveActionOptions = (id: string) => {
    return axiosInstance.get<ActionOption[]>(`/graph/node/options/${id}`)
}


export const addEdge = (edge: R.Edge) => {
    socket.send("/app/graph/mock-id/edge/create", edge)
}

export const addNode = (node: any) => {
    socket.send("/app/graph/mock-id/node/create", node)
}
export const moveNode = (moveEvent: R.MoveNodeEvent) => {
    socket.send("/app/graph/mock-id/node/move", moveEvent)
}
