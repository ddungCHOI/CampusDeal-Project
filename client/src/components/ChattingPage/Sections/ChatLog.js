import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Input } from 'antd';

const socket = io();

const ChatLog = (props) => {

    const chatId = props.chatId;

    useEffect(() => {
        socket.on('chat-msg', (name, msg) => {   // 메세지를 받았을 때 - 4
            var my_msg = document.createElement('div');
            my_msg.innerHTML = `${name} : ${msg}`;
            document.getElementById('chat_log').appendChild(my_msg);
            document.getElementById('chat_log').scrollTop = document.getElementById('chat_log').scrollHeight;// 스크롤바 자동 아래로
        });
    }, []);

    useEffect(() => {
        props.name && socket.emit('joinRoom', chatId, props.name);
    }, [props.name]);

    const submit = (value) => {
        // socket.emit('click', value);
        // if (value === "@에누리") {
        //   console.log("에누리")
        // } else if ( value === "@판매") {
        //   console.log("판매")
        // }

        socket.emit('chat-msg', chatId, props.name, value);
    }

    return (
        <React.Fragment>
            <div id="chat_log" style={{ height: '12rem', border: '1px solid #d9d9d9', borderRadius: '2px', overflow : 'auto' }}></div>
            <Input.Search
                placeholder="Message"
                enterButton="보내기"
                size="large"
                style={{ marginTop: 'auto' }}
                onSearch={value => submit(value)}
            />
        </React.Fragment>
    );
}

export default ChatLog;
