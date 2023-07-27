import React from "react";
import {EmitterContext} from "./EmitterContext";

export interface EventHandler<Event = any> {
    (event?: Event): void
}


type ListenerMap<Event = any> = Map<string, EventHandler<Event>[]>

const EmitterContextProvider: React.FC<React.PropsWithChildren>  = ({children}) => {
    const listenerMap: ListenerMap = new Map<string, EventHandler[]>()

    const on = (name: string, handler: EventHandler) => {
        if (!listenerMap.has(name)) {
            listenerMap.set(name, new Array<EventListener>())
        }
        const previousList = listenerMap.get(name)!!;
        previousList.push(handler)
        listenerMap.set(name, previousList)
    }

    const emit = <T extends any = any>(name: string, event?: T) => {
        if (!listenerMap.has(name)) return
        const listeners = listenerMap.get(name)!!;
        listeners.forEach(callback => callback(event))
    };


    return (
        <EmitterContext.Provider value={{on, emit}}>
            {children}
        </EmitterContext.Provider>
    )
}

export default EmitterContextProvider;
