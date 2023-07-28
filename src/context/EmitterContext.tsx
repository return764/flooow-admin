import {createContext} from "react";
import {EventHandler} from "./EmitterContextProvider";

export interface EmitterContextProps {
    on: (name: string, handler: EventHandler) => void,
    removeListener: (name: string, handler: EventHandler) => void,
    emit: <T>(name: string, event?: T) => void
}
export const EmitterContext = createContext({} as EmitterContextProps)
