import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { withRouter } from 'react-router-dom';

function MainPage(props) {

    const [Category, setCategory] = useState("");

    const onSearchHandler = (value) => {
        props.history.push(`/board?category=${Category}&search=${value}`);
    };

    return (
        <Input.Group compact style={{ textAlign: 'center', margin: '3rem auto' }} >
            <Select defaultValue="all" size="large" style={{ width: '10%' }} onChange={value => setCategory(value)}>
                <Select.Option value="all">통합검색</Select.Option>
                <Select.Option value="law">법학</Select.Option>
                <Select.Option value="economics">경영/경제</Select.Option>
                <Select.Option value="humanities">인문</Select.Option>
                <Select.Option value="linguistics">어문</Select.Option>
                <Select.Option value="sociology">사회과학</Select.Option>
                <Select.Option value="science">자연과학</Select.Option>
                <Select.Option value="engineering">공학</Select.Option>
                <Select.Option value="education">사범</Select.Option>
                <Select.Option value="life">생활환경</Select.Option>
                <Select.Option value="art">예체능</Select.Option>
                <Select.Option value="agriculture">농축산</Select.Option>
                <Select.Option value="medical">의약학</Select.Option>
            </Select>
            <Input.Search size="large" style={{ width: '50%' }} enterButton onSearch={value => onSearchHandler(value)} />
        </Input.Group>
    )
}

export default withRouter(MainPage);
