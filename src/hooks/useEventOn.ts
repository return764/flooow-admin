import {useContext} from "react";
import {EmitterContext} from "../context/EmitterContext";
import {EventHandler} from "../context/EmitterContextProvider";


const useEventOn = (name: string) => {

    const {on} = useContext(EmitterContext);

    return (handler: EventHandler) => {
        on(name, handler)
    }
}

export default useEventOn
