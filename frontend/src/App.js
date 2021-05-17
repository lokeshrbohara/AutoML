import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import 'antd/dist/antd.css';
import './App.css';

import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import DataPreprocess from './Pages/DataPreprocess/DataPreprocess';
import Model from './Pages/Model/Model';
import CompleteModel from './Pages/CompleteModel/CompleteModel';
import HomePage from './Pages/HomePage/HomePage';

const { Header, Sider, Content } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Router>
        <Layout>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            {
              !this.state.collapsed && 
              <p className="mainText">Auto ML</p>
            }
            {
              this.state.collapsed && 
              <p className="mainText">A-ML</p>
            }
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/">
                  Home
                </Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<UserOutlined />}>
                <Link to="/process">
                  Data Preprocessing
                </Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<VideoCameraOutlined />}>
                <Link to="/model">
                  Build Model
                </Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<UploadOutlined />}>
                <Link to="/CompModel">
                  Complete Model
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: '100vh',
              }}
            >
              <Switch>
              <Route exact path="/">
                <HomePage />
                </Route>
                <Route path="/process">
                  <DataPreprocess />
                </Route>
                <Route path="/model">
                  <Model />
                </Route>
                <Route path="/CompModel">
                  <CompleteModel />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;