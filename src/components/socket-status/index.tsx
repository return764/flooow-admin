import React from 'react';
import {Badge} from "antd";
import './index.css'

const SocketStatus: React.FC<{online: boolean}> = ({online}) => {
    return (
        <div className='socket-status'>
            <Badge status={online ? 'processing' : 'error'} />
            <span>{online ? 'Online' : 'Offline'}</span>
        </div>
    );
};

export default SocketStatus;
