import {R} from "./model";
import axiosInstance from "../config/axiosConfig";

import ActionOption = R.ActionOption;
import ActionOptionForm = R.ActionOptionForm;

export const retrieveEnumOptions = (javaType: string) => {
    return axiosInstance.get("/nodes/enumOptions", {
        params: {
            javaType: javaType
        }
    })
};


export const retrieveActionOptions = (nodeId: string) => {
    return axiosInstance.get<ActionOption[]>(`/nodes/${nodeId}/options`)
}

export const updateActionOptions = (nodeId: string, values: ActionOptionForm) => {
    return axiosInstance.post<ActionOptionForm>(`/nodes/${nodeId}/options`, values)
};
