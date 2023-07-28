import React, {useEffect, useState} from 'react';
import {Badge} from "antd";
import './index.css'
import socket from "../../config/socketConfig";
import useEmit from "../../hooks/useEmit";

const SocketStatus = () => {
    const [online, setOnline] = useState<boolean>(socket.isConnected());
    const socketConnectedEmitter = useEmit('socket-connected');

    const onlineSocket = (status: boolean) => {
        setOnline(status)
    };

    useEffect(() => {
        socketConnectedEmitter.on(onlineSocket)
        return () => {
            socketConnectedEmitter.removeListener(onlineSocket)
        }
    }, [])

    return (
        <div className='socket-status'>
            <Badge status={online ? 'processing' : 'error'} />
            <span>{online ? 'Online' : 'Offline'}</span>
        </div>
    );
};

export default SocketStatus;
