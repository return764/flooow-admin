import React, {useEffect} from 'react';
import functionSvg from "../../assets/function.svg";
import {Graph, Node} from "@antv/x6";
import {ActionData} from "../interface";
import {R} from "../../api/model";
import OptionType = R.OptionType;

const ActionDetailShape = (props: {
    node: Node;
    graph: Graph;
}) => {
    const {node} = props;
    const {label, options} = node.getData<ActionData>()

    const inputOptions = options.filter(it => it.type === OptionType.INPUT);
    const outputOptions = options.filter(it => it.type === OptionType.OUTPUT);

    const renderOutput = () => {
        return outputOptions.map(it => {
            return (
                <div style={{
                    height: '30px',
                    lineHeight: '30px',
                    marginRight: '10px'
                }}>
                    {it.name}
                </div>
            )
        })
    }

    const renderInput = () => {
        return inputOptions.map(it => {
            return (
                <div style={{
                    height: '30px',
                    lineHeight: '30px',
                    marginLeft: '10px'
                }}>
                    {it.name}
                </div>
            )
        })
    }

    return (
        <div className='shape-wrapper'>
            <div className='shape-main-area'>
                <div className='shape-node-type-icon'>
                    <img src={functionSvg} style={{ margin: '12px',padding: '4px', borderRadius: '4px', backgroundColor: '#0958d9' }} height={'12px'} alt='function'/>
                </div>
                <div className='shape-node-label'>{label}</div>
            </div>
            <div className='shape-detail-area'>
                <div className='shape-input'>
                    {renderInput()}
                </div>
                <div className='shape-output'>
                    {renderOutput()}
                </div>
            </div>
        </div>
    );
};

export default ActionDetailShape;
