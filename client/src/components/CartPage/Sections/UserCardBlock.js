import React, {useState, useEffect} from 'react';
import {Button, Table} from 'antd';
import {Link} from 'react-router-dom';

const UserCardBlock = (props) => {

    const [Data, setData] = useState([]);

    const renderCartImage = (images) => {
        if(images.length > 0) {
            let image = images[0]
            return `/${image}`
        }
    }

    const columns = [
        {
            title: '이미지',
            dataIndex: 'img',
            key: 'img',
            render: text => <img style={{width: '150px'}} alt="product" src={renderCartImage(text)} />
        },
        {
            title: '도서명',
            dataIndex: 'title',
            key: 'title',
            render: (text, row, index) => <Link to={`/book/${row.key}`}>{text}</Link>
        },
        {
            title: '가격',
            dataIndex: 'price',
            key: 'price',
            render: (text, row, index) => <span>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</span>
        },
        {
            title: '판매자',
            dataIndex: 'writer',
            key: 'writer',
        },
        {
            title: '선택',
            dataIndex: 'select',
            key: 'select',
            render: (text, row, index) => <React.Fragment><Button style={{display:'block', width:'6rem', marginBottom:'.5rem'}} type="primary" onClick={() => props.buyItem(row.key)}>구매하기</Button><Button style={{display:'block', width:'6rem'}} type="danger" onClick={() => props.removeItem(row.key)}>remove</Button></React.Fragment>
        },
    ];

    useEffect(() => {
        props.books && props.books.map((book, index) => (
            Data.push({ key: String(book._id), img: book.images, title: book.title, price: book.price, writer: book.seller.name, select:'select'})
        ));
    }, [props.books]);

  return (
    <div>
        {Data.length > 0 && 
            <Table style={{ paddingTop: '1rem' }} pagination={false} columns={columns} dataSource={Data} />
        }
    </div>
  );
}

export default UserCardBlock;
