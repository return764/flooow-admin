import React, {FC, useEffect} from 'react';
import {Graph, Node} from "@antv/x6";
import './index.css';
import CollapsePaper from "../collapse-paper";
import {Stencil} from "@antv/x6-plugin-stencil";
import {RectType} from "../../shapes/interface";
import API from "../../api";

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

    const onDragNode = (node: Node) => {
        const cloneNode = node.clone();
        cloneNode.addPorts(calculatePorts(cloneNode.data.type, cloneNode.id))
        return cloneNode;
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
                dy: 20,
                dx: 40,
                rowHeight: 'compact'
            },
            getDragNode: onDragNode,
        });

        dndContainer.appendChild(stencil.container);
        API.graph.retrieveAllTemplates().then(res => {
            if (res.data) {
                stencil.load(res.data.map(it => graph.createNode(it)))
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
