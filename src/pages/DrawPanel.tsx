import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Cell, EdgeView, Graph, Model, NodeView, Path, Platform} from "@antv/x6";
import {register} from "@antv/x6-react-shape";
import {Scroller} from "@antv/x6-plugin-scroller";
import Paper from "../components/Paper";
import {Button, MenuProps, Space} from "antd";
import {MiniMap} from "@antv/x6-plugin-minimap";
import {Selection} from "@antv/x6-plugin-selection";
import './DrawPanel.css'
import DndContainer from "../components/dndContainer/DndContainer";
import InputShape from "../shapes/base/InputShape";
import ProcessShape from "../shapes/base/PorcessShape";
import OutputShape from "../shapes/base/OutputShape";
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import {Node} from "@antv/x6/src/model/node";
import {Edge} from "@antv/x6/src/model/edge";
import API from "../api";
import socket from "../config/socketConfig";
import ContextMenuTool from "../components/contextMenuTool/ContextMenuTool";
import {R} from "../api/model";
import NodeOptionsContainer from "../components/nodeOptionsContainer/NodeOptionsContainer";

register({
    shape: 'input',
    width: 180,
    height: 36,
    component: InputShape,
    ports: {
        groups: {
            out: {
                position: {
                    name: 'right',
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'transparent',
                        strokeWidth: 1,
                        fill: 'transparent',
                    },
                },
            },
        },
    },
})

register({
    shape: 'process',
    width: 180,
    height: 36,
    component: ProcessShape,
    ports: {
        groups: {
            in: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'transparent',
                        strokeWidth: 1,
                        fill: 'transparent',
                    },
                },
            },
            out: {
                position: {
                    name: 'right',
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'transparent',
                        strokeWidth: 1,
                        fill: 'transparent',
                    },
                },
            },
        },
    },
})

register({
    shape: 'output',
    width: 180,
    height: 36,
    component: OutputShape,
    ports: {
        groups: {
            in: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'transparent',
                        strokeWidth: 1,
                        fill: 'transparent',
                    },
                },
            }
        },
    },
})

Graph.registerConnector(
    'curveConnector',
    (sourcePoint, targetPoint) => {
        const hgap = Math.abs(targetPoint.x - sourcePoint.x)
        const path = new Path()
        path.appendSegment(
            Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y),
        )
        path.appendSegment(
            Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y),
        )
        // 水平三阶贝塞尔曲线
        path.appendSegment(
            Path.createSegment(
                'C',
                sourcePoint.x < targetPoint.x
                    ? sourcePoint.x + hgap / 2
                    : sourcePoint.x - hgap / 2,
                sourcePoint.y,
                sourcePoint.x < targetPoint.x
                    ? targetPoint.x - hgap / 2
                    : targetPoint.x + hgap / 2,
                targetPoint.y,
                targetPoint.x - 6,
                targetPoint.y,
            ),
        )
        path.appendSegment(
            Path.createSegment('L', targetPoint.x + 4, targetPoint.y),
        )

        return path.serialize()
    },
    true,
)

Graph.registerEdge('process-edge', {
    markup: [
        {
            tagName: 'path',
            selector: 'wrap',
            attrs: {
                fill: 'none',
                cursor: 'pointer',
                stroke: 'transparent',
                strokeLinecap: 'round',
            },
        },
        {
            tagName: 'path',
            selector: 'line',
            attrs: {
                fill: 'none',
                pointerEvents: 'none',
            },
        },
    ],
    connector: {
        name: 'curveConnector',
    },
    attrs: {
        wrap: {
            connection: true,
            strokeWidth: 10,
            strokeLinejoin: 'round',
        },
        line: {
            connection: true,
            stroke: '#A2B1C3',
            strokeWidth: 1,
            targetMarker: {
                name: 'classic',
                size: 6,
            },
        },
    },
})

Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)

const baseData = {
    nodes: [],
    edges: [],
} as {
    nodes: Node.Metadata[]
    edges: Edge.Metadata[]
};

const DrawPanel = () => {
    const graphRef = useRef<Graph>();
    const [onReady, setOnReady] = useState(false);
    const [nodes, setNodes] = useState(baseData.nodes);
    const [edges, setEdges] = useState(baseData.edges);
    const graphData = useMemo(() => ({
        nodes: nodes,
        edges: edges,
    }), [nodes, edges]) as Model.FromJSONData;
    const onClick: (cell: Cell) => void = (cell) => {
        cell.remove()
    };
    const menu: MenuProps['items'] = [
        {
            key: '1',
            label: 'Delete Item',
        }
    ];

    useEffect(() => {
        socket.connect()
            .then(() => {
                socket.subscribe("/queue/graph/mock-id", (res) => {
                    console.log("response", res)
                })
            })
    }, [])

    const combineTools = (cells: Edge.Metadata[] | Node.Metadata[]) => {
        return cells.map(it => Object.assign({}, it, {
            tools: [
                {
                    name: 'contextmenu',
                    args: {
                        menu,
                        onClick
                    },
                }
            ]
        }))
    };

    useEffect(() => {
        API.graph.retrieveGraph().then((res) => {
            const nodes = combineTools(res.data.nodes)
            const edges = combineTools(res.data.edges)
            setNodes((prevNodes) => [...prevNodes, ...nodes])
            setEdges((prevEdges) => [...prevEdges, ...edges])
        })
    }, [])

    useEffect(() => {
        graphRef.current = new Graph({
            container: document.getElementById("draw-container")!,
            autoResize: true,
            background: {
                color: "#F2F7FA",
            },
            connecting: {
                snap: true,
                allowEdge: false,
                allowBlank: false,
                allowNode: false,
                allowLoop: false,
                allowMulti: false,
                highlight: true,
                sourceAnchor: {
                    name: 'left',
                    args: {
                        dx: Platform.IS_SAFARI ? 4 : 8,
                    },
                },
                targetAnchor: {
                    name: 'right',
                    args: {
                        dx: Platform.IS_SAFARI ? 4 : -8,
                    },
                },
                createEdge() {
                    return graphRef.current!.createEdge({
                        shape: 'process-edge',
                        zIndex: -1,
                    })
                },
                validateConnection({ sourceMagnet, targetMagnet }) {
                    if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
                        return false;
                    }
                    return !(!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in');

                },
            }
        });
        setOnReady(true);
        graphRef.current!.use(
            new Scroller({
                enabled: true,
            })
        );
        graphRef.current!.use(
            new MiniMap({
                container: document.getElementById("minimap")!,
                width: 150,
                height: 120,
                padding: 2
            })
        );
        graphRef.current!.use(
            new Selection({
                multiple: true,
                rubberEdge: true,
                rubberNode: true,
                modifiers: 'shift',
                rubberband: true,
            })
        );
        graphRef.current!.on('cell:added', onCellCreate)
        graphRef.current!.on('edge:connected', onEdgeConnected)
        graphRef.current!.on('node:move', onNodeMove)
        graphRef.current!.on('node:moved', onNodeMoved)
        graphRef.current!.on('cell:removed', onCellDelete)
    }, []);

    useEffect(() => {
        graphRef.current!.fromJSON(graphData);
    }, [graphData])

    const onCenterContent = () => {
        graphRef.current!.centerContent()
    }

    const onNodeMove = (e: NodeView.EventArgs['node:move']) => {
        e.node.setData({
            previousX: e.x,
            previousY: e.y,
        })
    }

    const onNodeMoved = (e: NodeView.EventArgs['node:moved']) => {
        const data = e.node.getData()
        const moveEvent: R.MoveNodeEvent = {
            id: e.node.id,
            previousX: data["previousX"],
            previousY: data["previousY"],
            postX: e.node.position().x,
            postY: e.node.position().y
        }
        API.graph.moveNode(moveEvent)
    }

    const onEdgeConnected = ({isNew, edge}: EdgeView.EventArgs['edge:connected']) => {
        if (isNew) {
            const edgeParam = {
                id: edge.id,
                shape: edge.shape,
                source: edge.source,
                target: edge.target
            } as R.Edge
            API.graph.addEdge(edgeParam)
        }
    }
    const onCellCreate = (e: Cell.EventArgs['added']) => {
        e.cell.addTools({
            name: 'contextmenu',
            args: {
                menu,
                onClick
            },
        })
        if (e.cell.isNode()) {
            const node = e.cell
            const nodeMetaData = {
                id: node.id,
                shape: node.shape,
                data: node.data,
                ports: {items: node.ports.items},
                ...node.size(),
                ...node.getPosition(),
            }
            API.graph.addNode(nodeMetaData)
        }
    }

    const onCellDelete = (e: Cell.EventArgs['removed']) => {
        if (e.cell.isNode()) {
            API.graph.deleteNode(e.cell.id)
        }

        if (e.cell.isEdge()) {
            API.graph.deleteEdge(e.cell.id)
        }
    }

    const onExecute = () => {
        API.graph.execute()
    }

    return (
        <>
            <div id='draw-container' style={{height: '100%', width: '100%'}}> </div>
            {onReady && <DndContainer graph={graphRef.current!} />}
            {onReady && <NodeOptionsContainer graph={graphRef.current!} />}
            <Paper id='tool-bar'>
                <Space>
                    <Button onClick={onCenterContent}>画布居中</Button>
                    <Button onClick={onExecute}>执行</Button>
                    <Button onClick={onExecute}>保存</Button>
                </Space>
            </Paper>
            <Paper id='minimap' style={{
                position: 'fixed',
                padding: '4px',
                right:'20px',
                bottom: '20px',
            }}/>

        </>
    )
};

export default DrawPanel;
