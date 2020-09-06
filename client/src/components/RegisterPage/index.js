import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, Select, Checkbox } from 'antd';
import KaKaoAddress from 'components/Common/KaKaoAddress';
import campusList from 'utils/Campus';
import privacy from './Sections/Privacy';
import service from './Sections/Service';
import { registerUser } from 'redux/actions/user_action';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';



// iPhone(320) S5(360) iPhone6/7/8/X(375) iPhone+(414) iPad(768) iPad-Pro(1024)
// xs   <   sm   <   md   <   lg   <   xl   <   xxl
//     576      768      992      1200     1600
// span 24를 최대로 본다.
// offset은 앞에 공간.
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const RegisterPage = (props) => {

  const [form] = Form.useForm();
  const [Visible, setVisible] = useState(false);
  const [Postcode, setPostcode] = useState("");
  const [RoadAddress, setRoadAddress] = useState("");

  const dispatch = useDispatch();

  const onSubmitHandler = (data) => {

    if(data.password !== data.confirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
    }

    if(!data.privacy) {
      return alert('개인정보 제 3자 제공을 동의해주세요.');
    }

    if(!data.service) {
      return alert('서비스 이용약관을 동의해주세요.');
    }

    dispatch(registerUser(data))
    .then(response => {
      if(response.payload.success){
        props.history.push('/login');
      } else {
        if(response.payload.err.code === 11000){
          alert("이미 존재하는 ID입니다.");
        } else {
          alert("Failed to sign up");
        }
      }
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      postcode: Postcode,
      roadAddress: RoadAddress
    })
  }, [Postcode, RoadAddress]);

  return (
    <div style={{ minWidth: '360px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography.Title level={2}>회원가입</Typography.Title>
      </div>
      <Form
        form={form}
        hideRequiredMark={true}
        style={{ display: 'flex', flexDirection: 'column' }}
        {...formItemLayout}
        onFinish={onSubmitHandler}
      >
        <Form.Item name="name" required label="Name" labelAlign="left" hasFeedback>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
          />
        </Form.Item>
        <Form.Item name="id" required label="ID" labelAlign="left" hasFeedback>
          <Input
            id="id"
            placeholder="Enter your ID"
            type="text"
          />
        </Form.Item>
        <Form.Item name="password" required label="Password" labelAlign="left" hasFeedback>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
          />
        </Form.Item>

        <Form.Item name="confirmPassword" required label="Confirm" labelAlign="left" hasFeedback>
          <Input
            id="confirmPassword"
            placeholder="Enter your confirmPassword"
            type="password"
          />
        </Form.Item>
        <Form.Item name="campus" required label="Campus" labelAlign="left" hasFeedback>
          <Select
            showSearch
            placeholder="Enter you campus"
          >
            {campusList.map((campus, index) =>
              <Select.Option key={index} value={campus}>{campus}</Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item name="email" required label="Email" labelAlign="left" hasFeedback>
          <Input
            id="email"
            placeholder="Enter your Email"
            type="email"
          />
        </Form.Item>
        <Form.Item name="phone" required label="Phone" labelAlign="left" hasFeedback>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            type="text"
          />
        </Form.Item>
        <Form.Item label="Address" labelAlign="left" style={{margin:'0'}}>
          <Row>
            <Col span={12} >
              <Form.Item name="postcode">
                <Input type="text" id="postcode" placeholder="우편번호" onClick={() => setVisible(true)} />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'flex' }}>
              <Button type="primary" onClick={() => setVisible(true)} style={{ marginLeft: 'auto' }} >
                우편번호 찾기
              </Button>
            </Col>
          </Row>
          <KaKaoAddress Visible={Visible} setVisible={setVisible} setPostcode={setPostcode} setRoadAddress={setRoadAddress} />
          <Form.Item name="roadAddress">
            <Input type="text" id="roadAddress" placeholder="도로명주소" onClick={() => setVisible(true)} />
          </Form.Item>
          <Form.Item name="detailAddress">
            <Input type="text" id="detailAddress" placeholder="상세주소" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="privacy" required valuePropName="checked" style={{margin:'0'}}>
          <Checkbox><span style={{color:'#1890ff', paddingLeft:'1rem'}} onClick={privacy}>개인정보 제 3자 제공 동의 (필수)</span></Checkbox>
        </Form.Item>
        <Form.Item name="service" required valuePropName="checked">
          <Checkbox><span style={{color:'#1890ff', paddingLeft:'1rem'}} onClick={service}>서비스 이용약관 동의 (필수)</span></Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button htmlType="submit" style={{ minWidth: '100%' }} type="primary">
            회원 가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};

export default withRouter(RegisterPage);