import React from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { loginUser } from 'redux/actions/user_action';
import { withRouter } from 'react-router-dom';

// xs   <   sm   <   md   <   lg   <   xl   <   xxl
//     576      768      992      1200     1600
// span 24를 최대로 본다.
// offset은 앞에 공간.

const LoginPage = (props) => {

  const dispatch = useDispatch();

  const onSubmitHandler = (data) => {

    dispatch(loginUser(data))
      .then(response => {
        if (response.payload.loginSuccess) {
          localStorage.setItem('userId', response.payload.userId);
          props.history.push('/'); // 로그인 성공시 페이지 이동
        } else {
          alert("Error");
        }
      })
  }

  return (
    <div style={{ margin: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography.Title level={2}>로그인</Typography.Title>
      </div>
      <Form initialValues={{ remember: true, id: localStorage.getItem("id") ? localStorage.getItem("id") : "" }} style={{ minWidth: '360px', display: 'flex', flexDirection: "column" }} onFinish={onSubmitHandler}>
        <Form.Item
          name="id"
          rules={[
            {
              required: true,
              message: '아이디를 입력하세요!',
            },
          ]}
        >
          <Input
            id="id"
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)', marginRight: '.5rem' }} />}
            placeholder="Enter your ID"
            type="text"
            defaultValue={localStorage.getItem("id") ? localStorage.getItem("id") : ""}
            size="large"
            style={{paddingTop:'1px', paddingBottom:'1px'}}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '패스워드를 입력하세요!',
            },
          ]}
        >
          <Input.Password
            id="password"
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)', marginRight: '.5rem' }} />}
            placeholder="Enter your password"
            size="large"
            style={{paddingTop:'1px', paddingBottom:'1px'}}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>아이디 기억하기</Checkbox>
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit" className="login-form-button" size="large" style={{ minWidth: '100%' }}>
            로그인
        </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default withRouter(LoginPage);