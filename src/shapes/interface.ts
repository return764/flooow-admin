import {R} from "../api/model";
import ActionStatus = R.ActionStatus;
import ActionOption = R.ActionOption;

type BaseRectData = {
    label: string,
}

export type RectData = {
    type?: RectType,
    status?: ActionStatus
} & BaseRectData

export type ActionData = {
    templateName: string,
    options: ActionOption[]
} & BaseRectData

export type RectType = 'input' | 'process' | 'output'
