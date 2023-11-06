import {Cell, Edge, Graph, Path} from "@antv/x6";
import {register} from "@antv/x6-react-shape";
import InputShape from "../shapes/base/InputShape";
import ProcessShape from "../shapes/base/PorcessShape";
import OutputShape from "../shapes/base/OutputShape";
import ContextMenuTool from "../components/context-menu-tool";
import ActionSummaryShape from "../shapes/base/ActionSummaryShape";
import ActionDetailShape from "../shapes/base/ActionDetailShape";

Cell.prototype.toRequestData = function () {
    if (this.isNode()) {
        return {
            id: this.id,
            shape: this.shape,
            data: this.data,
            ports: {items: this.ports.items},
            ...this.size(),
            ...this.getPosition(),
        }
    } else {
        const edge = this as Edge
        return {
            id: edge.id,
            shape: edge.shape,
            source: edge.source,
            target: edge.target
        }
    }

}

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

register({
    shape: 'action-summary',
    width: 180,
    height: 36,
    component: ActionSummaryShape,
})

register({
    shape: 'action-detail',
    component: ActionDetailShape,
    width: 180,
    height: 36,
    ports: {
        groups: {
            connectorIn: {
                position: {
                    name: "absolute",
                    args: {
                        x: 0,
                        y: 20,
                    }
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                        stroke: '#85A5FF',
                    },
                },
            },
            connectorOut: {
                position: {
                    name: "absolute",
                    args: {
                        x: '100%',
                        y: 20,
                    }
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                        stroke: '#85A5FF',
                    },
                },
            },
            in: {
                position: {
                    name: 'absolute',
                    args: {
                        x: 0,
                        y: 0,
                    }
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                        stroke: '#85A5FF',
                    },
                },
            },
            out: {
                position: {
                    name: 'absolute',
                    args: {
                        x: '100%',
                        y: 0,
                    }
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        strokeWidth: 1,
                        fill: '#fff',
                        stroke: '#85A5FF',
                    },
                },
            },
        },
        items: [{
            group: 'connectorIn'
        },{
            group: 'connectorOut'
        }]
    }
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
