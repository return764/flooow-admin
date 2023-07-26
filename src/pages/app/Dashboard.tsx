import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";
import GraphList from "../../components/graphList";

function Dashboard() {
    return (
        <div>
            <Button><Link to={'/draw'}>Draw</Link></Button>
            <GraphList/>
        </div>
    );
}

export default Dashboard;
