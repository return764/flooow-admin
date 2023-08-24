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
        type: OptionType,
        inputType: OptionInputType,
        javaType: string,
        value: any
    }

    export interface Option {
        label: string,
        value: string
    }

    export interface ActionOptionForm {
        data : ActionOption[]
    }

    export interface GraphAddForm {
        name: string
    }

    export enum OptionInputType {
        DEFAULT = 'DEFAULT',
        LAST_OUTPUT = 'LAST_OUTPUT'
    }

    export enum OptionType {
        STRING = 'STRING',
        MAP = 'MAP',
        ENUM = 'ENUM'
    }

    export enum ReturnType {
        CREATE_NODE = 'CREATE_NODE',
        CREATE_EDGE = 'CREATE_EDGE',
        MOVE_NODE = 'MOVE_NODE',
        DELETE_NODE = 'DELETE_NODE',
        DELETE_EDGE = 'DELETE_EDGE',
        EXECUTION = 'EXECUTION',
    }

    export enum ActionStatus {
       NEW = 'NEW',
       RUNNING = 'RUNNING',
       SUCCESS = 'SUCCESS',
       FAILURE = 'FAILURE',
       ON_READY = 'ON_READY',
       VALIDATION_FAILED = 'VALIDATION_FAILED'
    }

    export interface UpdateInputType {
        optionIds: string[],
        type: OptionInputType
    }

    export interface GraphSummary {
        id: string,
        name: string,
    }

}
