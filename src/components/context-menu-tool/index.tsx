import React from 'react';
import {Cell, CellView, EdgeView, ToolsView} from "@antv/x6";
import {Dropdown, MenuProps} from "antd";
import ReactDOM from "react-dom/client";


export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
    menu: MenuProps['items'],
    onClick: (cell: Cell) => void
}
class ContextMenuTool extends ToolsView.ToolItem<
    EdgeView,
    ContextMenuToolOptions
> {
    private knob: HTMLDivElement | undefined
    private root: ReactDOM.Root | undefined
    private hasRender: boolean = false

    render() {
        super.render()
        if (!this.knob) {
            this.knob = ToolsView.createElement('div', false) as HTMLDivElement
            this.knob.style.position = 'absolute'
            this.container.appendChild(this.knob)
            this.root = ReactDOM.createRoot(this.knob)
        }
        return this
    }

    private onClick: MenuProps['onClick'] = () => {
        this.options.onClick(this.cell);
    }

    private toggleContextMenu(visible: boolean) {
        if (this.hasRender) {
            this.root?.unmount()
            this.hasRender = false
            this.root = ReactDOM.createRoot(this.knob!!)
        }
        document.removeEventListener('click', this.onMouseDown, {capture: false})

        if (visible) {
            this.root?.render(
                <Dropdown
                    open={true}
                    trigger={['contextMenu']}
                    menu={{items: this.options.menu, onClick: this.onClick}}
                >
                    <a/>
                </Dropdown>)
            this.hasRender = true
            document.addEventListener('click', this.onMouseDown, {capture: false})
        }
    }

    private updatePosition(e: MouseEvent) {
        const p = this.graph.clientToGraph(e.clientX, e.clientY);
        const style = this.knob!!.style
        if (p) {
            style.left = `${p.x}px`
            style.top = `${p.y}px`
        } else {
            style.left = '-1000px'
            style.top = '-1000px'
        }
    }

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        this.updatePosition(e)
        this.toggleContextMenu(false)
    }

    private onContextMenu({ e }: CellView.EventArgs['cell:contextmenu']) {
        this.updatePosition(e as unknown as MouseEvent)
        this.toggleContextMenu(true)
    }

    delegateEvents() {
        this.cellView.on('cell:contextmenu', this.onContextMenu, this)
        return super.delegateEvents()
    }

    protected onRemove() {
        this.cellView.off('cell:contextmenu', this.onContextMenu, this)
    }
}

ContextMenuTool.config({
    tagName: 'div',
    isSVGElement: false,
});

export default ContextMenuTool;
