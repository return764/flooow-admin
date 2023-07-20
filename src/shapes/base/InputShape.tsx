import {Graph, Node} from "@antv/x6";
import React from "react";
import BaseRect from "./BaseRectShape";
import {RectData} from "../interface";
import _ from "lodash";


const InputShape = (props: {
    node: Node;
    graph: Graph;
}) => {
    const {node, graph} = props;
    const data = node.getData<RectData>()
    node.setData(_.assign({}, data, {type: 'input'}));

    return (
        <BaseRect {...props}/>
    )
}

export default InputShape;
