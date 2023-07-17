import {Cell,Edge} from "@antv/x6";

Cell.prototype.toModel = function () {
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
