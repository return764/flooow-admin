import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {App as AppProvider} from 'antd'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import './extension/x6Extension'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <AppProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AppProvider>,
)
