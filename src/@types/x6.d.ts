import {Edge, Node} from "@antv/x6";


declare module '@antv/x6' {
    interface Cell {
        toModel() : NodeModel | EdgeModel
    }
}

declare interface NodeModel extends Node.Metadata {

}

declare interface EdgeModel extends Edge.Metadata {

}
