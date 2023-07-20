import {R} from "../api/model";
import ActionStatus = R.ActionStatus;

type BaseRectData = {
    label: string,
}

export type RectData = {
    type?: RectType,
    status?: ActionStatus
} & BaseRectData

export type RectType = 'input' | 'process' | 'output'
