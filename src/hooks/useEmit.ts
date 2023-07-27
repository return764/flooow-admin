import {useContext} from "react";
import {EmitterContext} from "../context/EmitterContext";


const useEmit = <T>(name: string) => {

    const {emit} = useContext(EmitterContext);

    return (event?: T) => {
        emit(name, event)
    }
}

export default useEmit
