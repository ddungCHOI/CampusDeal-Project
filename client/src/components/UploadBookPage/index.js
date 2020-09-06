import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Button, DatePicker, Select, message, InputNumber } from 'antd';
import FileUplaod from 'components/Common/FileUpload';
import Category from 'utils/Category';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

message.config({top: 100});

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const UploadBookPage = (props) => {

  const [PulbishDate, setPulbishDate] = useState(null);
  const [Images, setImages] = useState([]);
  const user = useSelector(state => state.user);

  const uploadImageHandler = (image) => {
    if (image.file.status === 'done') {
      setImages([...Images, image.file.originFileObj]);
      message.success('이미지 업로드 완료', 0.7);
    } else if (image.file.status === 'error') {
      message.error('이미지 업로드 실패', 0.7);
    }
  };


  const onSubmitHandler = (data) => {

    if (!data.title || !data.writer || !data.publisher || !PulbishDate || !data.grade || !data.price || !data.category || !data.methods) {
      return message.error('모든 입력폼을 입력해주세요.');
    }

    let formData = new FormData();

    // 파일 전송시 오류 안나게 헤더 추가
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }

    formData.append('seller', user.userData._id)
    formData.append('title', data.title)
    formData.append('writer', data.writer)
    formData.append('publisher', data.publisher)
    formData.append('publishDate', PulbishDate)
    formData.append('grade', data.grade)
    formData.append('price', data.price)
    formData.append('category', data.category)
    formData.append('methods', JSON.stringify(data.methods))

    for (const img of Images) {
      formData.append('images', img)
    }

    Axios.post('/api/book/uploadBook', formData, config)
      .then(response => {
        if (response.data.success) {
          message.success('교재등록에 성공하였습니다.', 0.7);

          Axios.post('/api/chat/makeRoom', {_id: response.data.bookInfo._id, title: data.title, seller: user.userData._id})
          .then(response => {
            if (response.data.success) {
              message.success("채팅방이 정상등록되었습니다.")
            } else {
              message.error("채팅방 생성에 실패하였습니다.")
            }
          })
          props.history.push('/');
        } else {
          message.error("교재 등록에 실패하였습니다.")
        }
      })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '947.5px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography.Title level={2}>도서 판매 등록</Typography.Title>
      </div>
      <Form style={{ display: 'flex' }} {...formItemLayout} autoComplete="off" hideRequiredMark={true} onFinish={onSubmitHandler}>
        <div style={{ width: '50%' }}>
          <Form.Item name="title" required label="교재명" labelAlign="left" hasFeedback>
            <Input
              id="title"
              placeholder="Enter book title"
              type="text"
              size="large"
            />
          </Form.Item>
          <Form.Item name="writer" required label="지은이" labelAlign="left" hasFeedback>
            <Input
              id="writer"
              placeholder="Enter book writer"
              type="text"
              size="large"
            />
          </Form.Item>
          <Form.Item name="publisher" required label="출판사" labelAlign="left" hasFeedback>
            <Input
              id="publisher"
              placeholder="Enter book publisher"
              type="text"
              size="large"
            />
          </Form.Item>
          <Form.Item name="publishDate" required label="출판일" labelAlign="left" hasFeedback>
            <DatePicker onChange={(date, dateString) => setPulbishDate(dateString)} picker="month" size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="grade" required label="교재 상태" labelAlign="left" hasFeedback>
            <Select size="large">
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="C">C</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" required label="가격" labelAlign="left" hasFeedback>
            <InputNumber
              id="price"
              placeholder="Enter Price"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="category" required label="분류" labelAlign="left" hasFeedback>
            <Select size="large">
              {Category.map(item =>
                <Select.Option key={item.id} value={item.title}>{item.title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="methods" required label="거래방법" labelAlign="left" hasFeedback>
            <Select mode="multiple" placeholder="Select methods" size="large">
              <Select.Option value="meet">직거래</Select.Option>
              <Select.Option value="safe">안전거래</Select.Option>
              <Select.Option value="post">택배</Select.Option>
              <Select.Option value="etc">기타</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
          <div style={{ maxWidth: '21rem', margin: '0 auto 8px auto' }}>
            <FileUplaod uploadImageHandler={uploadImageHandler} />
          </div>
          <Button htmlType="submit" size="large" type="primary" style={{ width: '21rem', margin: 'auto auto 24px auto' }} >판매 등록하기</Button>
        </div>
      </Form>

    </div>
  );
}

export default withRouter(UploadBookPage);
