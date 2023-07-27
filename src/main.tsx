import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {App as AppProvider} from 'antd'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import './extension/x6Extension'
import RouteTree from "./RouteTree";
import EmitterContextProvider from "./context/EmitterContextProvider";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <AppProvider>
            <EmitterContextProvider>
                <BrowserRouter>
                    <RouteTree />
                </BrowserRouter>
            </EmitterContextProvider>
        </AppProvider>
    </StrictMode>,
)
