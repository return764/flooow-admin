import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/app/Dashboard";
import DrawPanel from "./pages/drawPanel/DrawPanel";
import React from "react";
import App from "./App";

const RouteTree = () => {
    return (
        <Routes>
            <Route path='/' element={<App/>}>
                <Route path='/' element={<Dashboard/>}/>
            </Route>
            <Route path='/draw' element={<DrawPanel/>}/>
        </Routes>
    )
};

export default RouteTree
