import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'redux/actions/user_action';

import { Drawer, Button } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import './NavBar.css';

const SubMenu = Menu.SubMenu;

const NavBar = (props) => {
  const [visible, setvisible] = useState(false);

  const showDrawer = () => {
    setvisible(true);
  };

  const onClose = () => {
    setvisible(false);
  };

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout())
      .then(response => {
        if (response.payload.success) {
          localStorage.removeItem('userId');
          props.history.push('/login');
        } else {
          alert("로그아웃 하는데 실패했습니다.")
        }
      });
  }

  return (
    <nav className="menuContainer">
      <div className="menuLogo">
        <a href="/">캠퍼스 딜</a>
      </div>
      <div className="menuGroup">
        {user.userData && !user.userData.isAuth ?

          <Menu mode="horizontal">
            <SubMenu title="MY PAGE">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key="login">
              <Link to="/login">SIGN IN</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/register">SIGN UP</Link>
            </Menu.Item>
          </Menu>
          :
          <Menu mode="horizontal">
            <SubMenu title="MY PAGE">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key="book/upload">
              <Link to='/book/upload'>UPLOAD</Link>
            </Menu.Item>
            <Menu.Item key="user/cart" style={{ height: '2.5rem' }}>
              <Badge count={user.userData && user.userData.cart.length}>
                <Link to="/user/cart" style={{ marginRight: -15, color: '#667777' }}>
                  <ShoppingCartOutlined style={{ fontSize: 30 }} />
                </Link>
              </Badge>
            </Menu.Item>
            <Menu.Item key="logout">
              <a onClick={logoutHandler}>LOGOUT</a>
            </Menu.Item>
          </Menu>}
      </div>
      <Button
        type="primary"
        onClick={showDrawer}
        className="menuMobileButton"
      >
        <MenuFoldOutlined />
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        className="menuDrawer"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {user.userData && !user.userData.isAuth ?
          <Menu mode="inline">
            <SubMenu title="MY PAGE">
              <Menu.Item key="setting:1" onClick={onClose}>Option 1</Menu.Item>
              <Menu.Item key="setting:2" onClick={onClose}>Option 2</Menu.Item>
              <Menu.Item key="setting:3" onClick={onClose}>Option 3</Menu.Item>
              <Menu.Item key="setting:4" onClick={onClose}>Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key="login">
              <Link to="/login" onClick={onClose}>SIGN IN</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/register" onClick={onClose}>SIGN UP</Link>
            </Menu.Item>
          </Menu>
          :
          <Menu mode="inline" close={onClose}>
            <SubMenu title="MY PAGE">
              <Menu.Item key="setting:1" onClick={onClose}>Option 1</Menu.Item>
              <Menu.Item key="setting:2" onClick={onClose}>Option 2</Menu.Item>
              <Menu.Item key="setting:3" onClick={onClose}>Option 3</Menu.Item>
              <Menu.Item key="setting:4" onClick={onClose}>Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key="book/upload">
              <Link to='/book/upload' onClick={onClose}>UPLOAD</Link>
            </Menu.Item>
            <Menu.Item key="user/cart" style={{ height: '2.5rem' }}>
              <Badge count={user.userData && user.userData.cart.length}>
                <Link to="/user/cart" onClick={onClose} style={{ marginRight: -15, color: '#667777' }}>
                  <ShoppingCartOutlined style={{ fontSize: 30 }} />
                </Link>
              </Badge>
            </Menu.Item>
            <Menu.Item key="logout" onClick={onClose}>
              <a onClick={logoutHandler}>LOGOUT</a>
            </Menu.Item>
          </Menu>}
      </Drawer>
    </nav>
  );
}

export default withRouter(NavBar);
