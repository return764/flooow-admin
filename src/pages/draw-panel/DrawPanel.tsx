import React, {useContext, useEffect, useRef, useState} from 'react';
import {Cell, EdgeView, Graph, NodeView, Platform} from "@antv/x6";
import {Scroller} from "@antv/x6-plugin-scroller";
import Paper from "../../components/paper/Paper";
import {App, Button, MenuProps, Space} from "antd";
import {MiniMap} from "@antv/x6-plugin-minimap";
import {Selection} from "@antv/x6-plugin-selection";
import './DrawPanel.css'
import API from "../../api";
import socket from "../../config/socketConfig";
import {R} from "../../api/model";
import {EdgeModel, NodeModel} from "../../@types/x6";
import {GraphContext} from "../../context/GraphContext";
import ReturnType = R.ReturnType;
import GraphContextProvider from "../../context/GraphContextProvider";
import ActionStatus = R.ActionStatus;
import {useParams} from "react-router-dom";
import DndContainer from "../../components/dnd-container/DndContainer";
import NodeOptionsContainer from "../../components/node-options-container/NodeOptionsContainer";

const DrawPanel = () => {
    const graphRef = useRef<Graph>();
    const [onReady, setOnReady] = useState(false);
    const {initGraphData, addNodeModel} = useContext(GraphContext);
    const {message} = App.useApp()
    const params = useParams()
    const graphId = params.graphId!!

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
        socket.connect((_) => {
            socket.subscribe(`/queue/graph/${graphId}`, (res) => {
                console.log("response", res)
                const jsonBody = JSON.parse(res.body)
                // @ts-ignore
                switch (res.headers["return-type"]) {
                    case ReturnType.CREATE_NODE:
                        addNodeModel(jsonBody)
                        break;
                    default:
                        break;
                }
            })

            socket.subscribe(`/queue/graph/runtime/${graphId}`, (res) => {
                const cellId = res.headers["node-id"]
                const cell = graphRef.current?.getCellById(cellId)
                const body = res.body
                const status = res.headers["status"]
                if (status === ActionStatus.VALIDATION_FAILED) {
                    message.warning(body)
                }
                cell?.setData({status})
            })
        })
        return () => {
            if (socket.isConnected()) {
                socket.disconnect()
            }
        }
    }, [])

    const combineTools = (cells: EdgeModel[] | NodeModel[]) => {
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
        API.graph.retrieveGraph(graphId as string).then((res) => {
            const nodes = combineTools(res.data.nodes)
            const edges = combineTools(res.data.edges)
            const graphData = {nodes, edges};
            initGraphData(graphData)
            graphRef.current!.fromJSON(graphData);
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
        setOnReady(true);
        return () => {
            graphRef.current!.off('cell:added', onCellCreate)
            graphRef.current!.off('edge:connected', onEdgeConnected)
            graphRef.current!.off('node:move', onNodeMove)
            graphRef.current!.off('node:moved', onNodeMoved)
            graphRef.current!.off('cell:removed', onCellDelete)
            graphRef.current?.disposePlugins(['minimap', 'scroller', 'selection'])
        }
    }, []);

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
        API.graph.moveNode(graphId, moveEvent)
    }

    const onEdgeConnected = ({isNew, edge}: EdgeView.EventArgs['edge:connected']) => {
        if (isNew) {
            API.graph.addEdge(graphId, edge.toRequestData())
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
            API.graph.addNode(graphId, e.cell.toRequestData())
        }
    }

    const onCellDelete = (e: Cell.EventArgs['removed']) => {
        if (e.cell.isNode()) {
            API.graph.deleteNode(graphId, e.cell.id)
        }

        if (e.cell.isEdge()) {
            API.graph.deleteEdge(graphId, e.cell.id)
        }
    }

    const onExecute = () => {
        graphRef.current!.getCells()
            .map(it=> it.setData({status: "NEW"}))
        API.graph.execute(graphId)
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
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
        </div>
    )
};

function wrappedContext(Component: () => JSX.Element) {
    const MemoComponent = React.memo(Component)
    return () => {
        return (
            <GraphContextProvider>
                <MemoComponent/>
            </GraphContextProvider>
        )
    }
}

export default wrappedContext(DrawPanel);
