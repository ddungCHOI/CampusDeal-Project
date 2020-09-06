import React, {useState, useEffect} from 'react';
import { Typography, Row, Col, Card, Avatar  } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ChatLog from './Sections/ChatLog';
import Axios from 'axios';

const ChattingPage = (props) => {

  const user = useSelector(state => state.user);
  const [USER, setUSER] = useState("");
  const chatId = props.match.params.chatId;

  useEffect(() => {
    Axios.post('/api/chat/connectRoom', { roomId : chatId, buyer : user.userData._id })
    .then(response => {
      if(response.data.success) {
        alert("채팅방 접속에 성공하였습니다.")
      } else {
        alert("채팅방 접속에 실패하였습니다.")
      }
    })
  }, []);

  useEffect(() => {
    user.userData && setUSER(user.userData.name);
  }, [user.userData]);

  return (
    <div style={{ width: '90%', margin: '3rem auto' }}>
      <Typography.Title level={2}><span style={{ borderBottom: '3px solid #868686', paddingBottom: '8px', fontWeight: 'bold', fontSize: '28px' }}>Chat</span></Typography.Title>
      <Row gutter={[32, 16]} style={{ marginTop: '2rem' }}>
        <Col lg={6} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card size="small" title={<strong>판매자</strong>} style={{width:'100%', textAlign:'center'}}>
            <p><Avatar style={{ backgroundColor: '#87d068', marginRight:'.5rem' }} icon={<UserOutlined />} />김명성</p>
          </Card>
          <Card size="small" title={<strong>구매자</strong>} style={{width:'100%', textAlign:'center'}}>
          <p><Avatar style={{ backgroundColor: '#f56a00', marginRight:'.5rem' }} icon={<UserOutlined />} />최동현</p>
          </Card>
        </Col>
        <Col lg={18} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
          <ChatLog name={USER} chatId={chatId} />
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(ChattingPage);
