import {useContext} from "react";
import {EmitterContext} from "../context/EmitterContext";
import {EventHandler} from "../context/EmitterContextProvider";


const useEmit = <T>(name: string) => {

    const {emit, on, removeListener} = useContext(EmitterContext);

    return {
        emit: (event?: T) => {
            emit(name, event)
        },
        on: (handler: EventHandler) => {
            on(name, handler)
        },
        removeListener: (handler: EventHandler) => {
            removeListener(name, handler)
        }
    }
}

export default useEmit
