import {EdgeModel, NodeModel} from "../@types/x6";


export namespace R {

    export interface ActionTemplate {
        shape: string,
        data: {
            label: string,
            template: string,
            [key: string]: string
        }
    }

    export interface GraphData {
        nodes: NodeModel[],
        edges: EdgeModel[],
    }

    export interface MoveNodeEvent {
        id: string,
        previousX: number,
        previousY: number,
        postX: number,
        postY: number,
    }

    export interface ActionOption {
        label: string,
        type: string,
        inputType: OptionInputType,
        value: any
    }

    export interface ActionOptionForm {
        data : ActionOption[]
    }

    export enum OptionInputType {
        DEFAULT = 'DEFAULT',
        LAST_INPUT = 'LAST_INPUT'
    }

    export interface UpdateInputType {
        optionIds: string[],
        type: OptionInputType
    }

}
