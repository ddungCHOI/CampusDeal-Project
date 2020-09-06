import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';
import queryString from 'query-string';
import SearchBar from 'components/SearchBar';


const BoardPage = (props) => {

    const [Category, setCategory] = useState("");
    const [Search, setSearch] = useState("");

    const categoryName = {
        "all":"통합검색",
        "law":"법학",
        "economics":"경영/경제",
        "humanities":"인문",
        "linguistics":"어문",
        "sociology":"사회과학",
        "science":"자연과학",
        "engineering":"공학",
        "education":"사범",
        "life":"생활환경",
        "art":"예체능",
        "agriculture":"농축산",
        "medical":"의약학"
    };

    const columns = [
        {
            title: '번호',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: '교재명',
            dataIndex: 'title',
            key: 'title',
            render: (text, row, index) => <Link to={`/book/${row.key}`}>{text}</Link>,
        },
        {
            title: '가격',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '작성자',
            dataIndex: 'writer',
            key: 'writer',
        },
        {
            title: '작성일',
            dataIndex: 'date',
            key: 'date',
        },
    ];


    const [Items, setItems] = useState([]);

    useEffect(() => {
        const query = queryString.parse(props.location.search);
        setCategory(query.category);
        setSearch(query.search);
        let data = [];
        Axios.get('api/book/getBooks')
            .then(response => {
                if (response.data.success) {
                    response.data.books.map((item, index) => (
                        data.push({ key: String(item._id), no: response.data.books.length - index, title: item.title, price: item.price, writer: item.seller.name, date: item.createdAt.substr(0,10) })
                    ));
                    setItems(data);
                } else {
                    alert('교재 리스트를 가져오기를 실패 했습니다.')
                }
            })
    }, []); // 뒤에 input 배열 없으면 계속 실행, 빈 배열이면 업데이트 될때만 실행

    return (
        <div style={{ width: '90%', margin: '3rem auto' }}>
            <SearchBar />
            <Typography.Title level={2}><span style={{ borderBottom: '3px solid #868686', paddingBottom: '8px', fontWeight: 'bold', fontSize: '28px' }}>{categoryName[Category]}</span></Typography.Title>
            <Table style={{ paddingTop: '1rem' }} columns={columns} pagination={{ position: ["bottomCenter"], pageSize: 5, showSizeChanger: false }} dataSource={Items} />
        </div>
    );
}

export default withRouter(BoardPage);
