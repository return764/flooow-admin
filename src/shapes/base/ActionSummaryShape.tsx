import React from 'react';
import {Graph, Node} from "@antv/x6";
import {ActionData} from "../interface";
import functionSvg from "../../assets/function.svg";

const ActionSummaryShape = (props: {
    node: Node;
    graph: Graph;
}) => {
    const {node} = props;
    const {label} = node.getData<ActionData>()

    return (
        <div className='shape-wrapper'>
            <div className='shape-main-area'>
                <div className='shape-node-type-icon'>
                    <img src={functionSvg} style={{ margin: '12px',padding: '4px', borderRadius: '4px', backgroundColor: '#0958d9' }} height={'12px'} alt='function'/>
                </div>
                <div className='shape-node-label'>{label}</div>
            </div>
        </div>
    )
};

export default ActionSummaryShape;
