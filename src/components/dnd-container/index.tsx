import React, {FC, useEffect} from 'react';
import {Graph, Node} from "@antv/x6";
import './index.css';
import CollapsePaper from "../collapse-paper";
import {Stencil} from "@antv/x6-plugin-stencil";
import {ActionData, RectType} from "../../shapes/interface";
import API from "../../api";
import {R} from "../../api/model";
import OptionType = R.OptionType;

interface DndContainerProps {
    graph: Graph,
}

const calculatePorts = (type: RectType, nodeId: string) => {
    switch (type) {
        case "input":
            return [
                {
                    id: `${nodeId}-out`,
                    group: 'out'
                }
            ]
        case "output":
            return [
                {
                    id: `${nodeId}-in`,
                    group: 'in'
                }
            ]
        default:
            return [
                {
                    id: `${nodeId}-out`,
                    group: 'out'
                },
                {
                    id: `${nodeId}-in`,
                    group: 'in'
                }
            ]
    }
}

const DndContainer: FC<DndContainerProps> = props => {
    const { graph } = props;

    function calculatePortY(index: number) {
        return (30 * index) + 44 + 15;
    }

    const onDragNode = (node: Node) => {
        const newNode = graph.createNode({
            shape: 'action-detail',
            data: node.data
        });

        const {options} = node.getData<ActionData>()

        const inputOptions = options.filter(it => it.type === OptionType.INPUT);
        const outputOptions = options.filter(it => it.type === OptionType.OUTPUT);
        outputOptions.forEach((_, index) => {
            newNode.addPort({
                group: 'out',
                args: {
                    y: calculatePortY(index)
                }
            })
        })

        inputOptions.forEach((_, index) => {
            newNode.addPort({
                group: 'in',
                args: {
                    y: calculatePortY(index)
                }
            })
        })

        return newNode;
    }

    useEffect(() => {
        const dndContainer = document.getElementById("dnd-container")!;
        const stencil = new Stencil({
            title: 'components',
            target: graph,
            dndContainer: dndContainer,
            stencilGraphHeight: 0,
            stencilGraphWidth: 200,
            layoutOptions: {
                columns: 1,
                marginY: 10,
                dy: 20,
                marginX: 45,
                center: true,
                rowHeight: 'auto'
            },
            getDragNode: onDragNode,
        });

        dndContainer.appendChild(stencil.container);
        API.graph.retrieveAllTemplates().then(res => {
            if (res.data) {
                stencil.load(res.data.map(it => graph.createNode({
                    shape: 'action-summary',
                    data: it
                })))
            }
        })
        return () => {
            graph.disposePlugins('stencil')
        }
    }, [])

    return (
        <CollapsePaper id='dnd-container'/>
    );
};

export default DndContainer;
