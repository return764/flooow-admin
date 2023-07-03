import {Graph, Node} from "@antv/x6";
import React from "react";
import BaseRect from "./BaseRectShape";
import {RectData} from "../interface";
import _ from "lodash";


const OutputShape = (props: {
    node: Node;
    graph: Graph;
}) => {
    const {node} = props;

    const data = node.getData<RectData>()
    node.setData(_.assign({}, data, {type: 'output'}));

    return (
        <BaseRect {...props}/>
    )
}

export default OutputShape;
