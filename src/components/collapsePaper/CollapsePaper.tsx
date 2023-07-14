import React, {FC, HTMLAttributes, PropsWithChildren, useEffect, useRef, useState} from 'react';
import Paper from "../Paper";
import {LeftOutlined} from "@ant-design/icons";
import './CollapsePaper.css';
import {createPortal} from "react-dom";

interface CollapsePaperProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement>{
    direction?: 'right' | 'left' | 'top' | 'bottom'
}

const CollapsePaper: FC<CollapsePaperProps> = props => {
    const {children, id} = props;
    const [open, setOpen] = useState<boolean>(true);
    const _container = useRef(document.createElement('div'));

    useEffect(() => {
        document.body.append(_container.current);
        _container.current.className = 'collapse-button-portal';
    }, [])

    const toggleDndOpen = () => {
        setOpen(!open);
    }

    const renderToggleButton = () => {
        return <LeftOutlined className={`collapse-button ${!open ? 'collapse-close' : ''}`} onClick={toggleDndOpen}/>
    }

    useEffect(() => {
    }, [])

    return (
        <div className={`collapse-wrapper ${!open ? 'collapse-paper-hidden' : ''}`} id={id}>
            <Paper style={{height: '100%', width: '100%'}}>{children}</Paper>
            {createPortal(renderToggleButton(), _container.current)}
        </div>
    )
};

export default CollapsePaper;
