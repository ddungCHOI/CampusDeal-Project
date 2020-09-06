import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import Axios from 'axios';

const Notice = () => {

    const [Items, setItems] = useState([]);

    useEffect(() => {
        let data = [];
        Axios.get('/api/notice/getNotice?limit=5')
            .then(response => {
                if (response.data.success) {
                    response.data.noticeInfo.map((item, index) => (
                        data.push({title: item.title, date: item.createdAt.substr(0,10), id: item._id})
                    ));
                    setItems(data);
                }
            })
    }, []); // 뒤에 input 배열 없으면 계속 실행, 빈 배열이면 업데이트 될때만 실행

    return (
        <List
            style={{ width: '80%', marginLeft:'2.5rem'}}
            itemLayout="horizontal"
            dataSource={Items}
            renderItem={item => (<List.Item><List.Item.Meta
                title={<a href={`/notice/${item.id}`}>{item.title}</a>}
              /><div>{item.date}</div></List.Item>)}
        />
    );
}

export default Notice;
