import React, { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import SearchBar from 'components/SearchBar';
import BookCard from './Sections/BookCard';
import { withRouter, Link } from 'react-router-dom';
import Axios from 'axios';
import Notice from './Sections/Notice';
import QnA from './Sections/QnA';

function MainPage(props) {

  const [Books, setBooks] = useState([]);

  useEffect(() => {
    Axios.get('/api/book/getBooks?limit=4')
      .then(response => {
        if(response.data.success) {
          setBooks(response.data.books);
        } else {
          alert("책 정보를 가져오는 데 실패하였습니다.");
        }
      })
  }, []);


  return (
    <div style={{ width: '90%', margin: 'auto', display:'flex', flexDirection:'column' }}>
      <SearchBar/>
        <Typography.Title level={2} style={{marginBottom:'2rem'}}><span style={{ borderBottom: '3px solid black', paddingBottom: '8px', paddingRight:'2px', fontWeight: 'bold', fontSize: '28px' }}>NEW</span></Typography.Title>
        <Row gutter={[32, 16]}>
          {Books.map((book, index) => (
            <BookCard book={book} key={index} />
          ))}
        </Row>
        <Row style={{marginBottom:'2rem'}}>
        <Col lg={12} xs={24}>
          <div style={{ margin: '2.5em 0 1rem 2rem' }}>
            <Link to='/notice/board'><Typography.Title level={3} style={{ letterSpacing: '-0.1rem'}}>공지사항</Typography.Title></Link>
          </div>
          <Notice />
        </Col>
        <Col lg={12} xs={24}>
          <div style={{ margin: '2.5rem 0 1rem 2rem' }}>
          <Link to='/contact/board'><Typography.Title level={3} style={{ letterSpacing: '-0.1rem'}}>문의사항</Typography.Title></Link>
          </div>
          <QnA />
        </Col>
      </Row>
    </div>
  )
}

export default withRouter(MainPage);
