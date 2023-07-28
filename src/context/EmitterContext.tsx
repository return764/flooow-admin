import {createContext} from "react";
import {EventHandler} from "./EmitterContextProvider";



export enum EmitterType {
    SOCKET_CONNECTED = 'socket-connected',
    GRAPH_RUNNING = 'graph-running',
    ACTION_SUCCESS = 'action-success',
    GRAPH_LIST_CHANGE = 'graph-list-change',
}

export interface EmitterContextProps {
    on: (name: string, handler: EventHandler) => void,
    removeListener: (name: string, handler: EventHandler) => void,
    emit: <T>(name: string, event?: T) => void
}
export const EmitterContext = createContext({} as EmitterContextProps)
