import {Graph, Node} from "@antv/x6";
import inputSvg from "../../assets/input.svg";
import outputSvg from "../../assets/output.svg";
import processSvg from "../../assets/process.svg";
import React from "react";
import {RectData} from "../interface";
import {
    CheckCircleTwoTone,
    ClockCircleTwoTone,
    CloseCircleTwoTone,
    SyncOutlined
} from "@ant-design/icons";
import {R} from "../../api/model";


const BaseRect = (props: {
    node: Node;
    graph: Graph;
}) => {
    const {node} = props;
    const {label, type, status} = node.getData<RectData>()

    const handleMouseEnter = () => {
        const ports = node.getPorts() || []
        ports.forEach((port) => {
            node.setPortProp(port.id!, 'attrs/circle', {
                fill: '#fff',
                stroke: '#85A5FF',
            })
        })
    }

    const handleMouseLeave = () => {
        const ports = node.getPorts() || []
        ports.forEach((port) => {
            node.setPortProp(port.id!, 'attrs/circle', {
                fill: 'transparent',
                stroke: 'transparent',
            })
        })
    }

    const renderStatusIcon = () => {
        switch (status) {
            case R.ActionStatus.NEW:
                return <></>
            case R.ActionStatus.RUNNING:
                return <SyncOutlined spin style={{color: '#1677FF'}} />
            case R.ActionStatus.ON_READY:
                return <ClockCircleTwoTone/>
            case R.ActionStatus.FAILURE:
                return <CloseCircleTwoTone twoToneColor="#F50000"/>
            case R.ActionStatus.SUCCESS:
                return <CheckCircleTwoTone twoToneColor="#1677FF"/>
        }
    };

    return (
        <div className='process-main-area'
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
        >
            <div className='process-status-icon'>{renderStatusIcon()}</div>
            <div className='process-node-type-icon'>
                { type === 'input' && <img src={inputSvg} style={{ margin: '12px',padding: '4px', borderRadius: '4px', backgroundColor: '#0958d9' }} height={'12px'} alt='input'/> }
                { type === 'output' && <img src={outputSvg} style={{ margin: '12px',padding: '4px', borderRadius: '4px', backgroundColor: '#faad14' }}  height={'12px'} alt='output'/> }
                { type === 'process' && <img src={processSvg} style={{ margin: '12px',padding: '4px', borderRadius: '4px', backgroundColor: '#13c2c2' }}  height={'12px'} alt='processSvg'/> }
            </div>
            <div className='process-node-label'>{label}</div>
        </div>
    )
}

export default BaseRect;
