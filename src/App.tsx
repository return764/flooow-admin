import React, {Suspense, useState} from 'react'
import {Breadcrumb, Layout, Menu, MenuProps, theme} from "antd";
import {Outlet, Route, Routes} from "react-router-dom";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import DrawPanel from "./pages/drawPanel/DrawPanel";
import {gray} from "@ant-design/colors";
import Dashboard from "./pages/app/Dashboard";
import GraphContextProvider from "./pages/drawPanel/GraphContextProvider";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Draw Graph', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<AppInner/>}>
                <Route path='/' element={<Dashboard/>}/>
            </Route>
            <Route path='/draw' element={<GraphContextProvider><DrawPanel/></GraphContextProvider>}/>
        </Routes>
    )
};

const AppInner = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                    lineHeight: '32px',
                    color: gray[0],
                    textAlign: 'center'
                }}>D6 Demo
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout className="site-layout">
                <Header style={{padding: 0, background: colorBgContainer}}/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <Suspense fallback={"loading"}>
                        <Outlet/>
                    </Suspense>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    )
}

export default App
