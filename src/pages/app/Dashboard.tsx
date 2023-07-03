import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";

function Dashboard(props) {
    return (
        <div>
            <Button><Link to={'/draw'}>Draw</Link></Button>
        </div>
    );
}

export default Dashboard;
