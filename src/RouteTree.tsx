import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/app/Dashboard";
import React from "react";
import App from "./App";
import DrawPanel from "./pages/draw-panel";

const RouteTree = () => {
    return (
        <Routes>
            <Route path='/' element={<App/>}>
                <Route path='/' element={<Dashboard/>}/>
            </Route>
            <Route path='/draw/:graphId' element={<DrawPanel/>}/>
        </Routes>
    )
};

export default RouteTree
