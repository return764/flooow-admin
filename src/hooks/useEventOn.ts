import {useContext} from "react";
import {EmitterContext} from "../context/EmitterContext";
import {EventHandler} from "../context/EmitterContextProvider";


const useEventOn = (name: string) => {

    const {on, removeListener} = useContext(EmitterContext);

    return {
        on: (handler: EventHandler) => {
            on(name, handler)
        },
        removeListener: (handler: EventHandler) => {
            removeListener(name, handler)
        }
    }
}

export default useEventOn
