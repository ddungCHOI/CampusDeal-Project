import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import { Typography, Row, Col } from 'antd';
import ImageSlider from 'components/Common/ImageSlider';
import BookInfo from './Sections/BookInfo';

const BookDetailPage = (props) => {

    const bookId = props.match.params.bookId;
    const [Book, setBook] = useState(null);

    useEffect(() => {
        Axios.get(`/api/book/getBookDetail?id=${bookId}`)
            .then(response => {
                if (response.data.success) {
                    setBook(response.data.info);
                    console.log(response.data.info)
                } else {
                    alert('해당 도서의 정보를 가져오는데 실패하였습니다.');
                }
            })
    }, []);
    return (
        <div style={{  width: '90%', margin: '3rem auto' }}>
            {Book &&
                <React.Fragment>
                    <Typography.Title level={2}><span style={{ borderBottom: '3px solid #868686', paddingBottom: '8px', fontWeight: 'bold', fontSize: '28px' }}>{Book.title}</span></Typography.Title>
                    <Row gutter={[32, 16]} style={{marginTop:'2rem'}}>
                        <Col lg={6} xs={24} style={{display:'flex', flexDirection:'column'}}>
                            <div style={{margin:'auto 0'}}><ImageSlider images={Book.images}/></div>
                        </Col>
                        <Col lg={18} xs={24}>
                            <BookInfo detail={Book} />
                        </Col>
                    </Row>
                </React.Fragment>
            }
        </div>
    );
}

export default withRouter(BookDetailPage);
