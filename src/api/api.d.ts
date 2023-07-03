import {Node} from "@antv/x6/src/model/node";


declare namespace R {

    export interface ActionTemplate {
        shape: string,
        data: {
            label: string,
            template: string,
            [key: string]: string
        }
    }

    export interface Edge {
        id: string,
        shape: string,
        source: {
            cell: string,
            port: string
        },
        target: {
            cell: string,
            port: string
        },
        zIndex?: number,
        [key: string]: any,
    }

    export interface GraphData {
        nodes: Node.Metadata[]
        edges: Edge.Metadata[]
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
        value: any
    }

}
