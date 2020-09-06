var express = require('express');
var router = express.Router();
const { Room } = require('../models/Room');
const { Message } = require('../models/Message')

// 채팅방 만들기
router.post('/makeRoom', function (req, res, next) {

  const variables = {
    _id : req.body._id,
    title: req.body.title,
    seller: req.body.seller
  };

  const room = new Room(variables); // 채팅방 인스턴스 생성

  // 채팅방 모델 저장
  room.save((err, roomInfo) => {
    if (err) return res.json({ success: false, err }) // err시 json형태로 실패한 정보 전달.
    return res.status(200).json({ success: true });
  });
});

// 채팅방 접속
router.post('/connectRoom', function (req, res, next) {
  Room.findOne({ _id: req.body.roomId }, (err, roomInfo) => {
    if (err) return res.json({ success: false, err });
    // 접속 (구매자 추가)
    roomInfo.addBuyer(req.body.buyer, (err, roomInfo) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, roomId : roomInfo._id })
    });
  })
}
);


module.exports = function (io) {

  io.on("connection", (socket) => {
    console.log("New client connected");

    // 요거 추가
    socket.on('joinRoom', (roomId, name) => {
      console.log(`${name} join the room: ${roomId}`)
      socket.join(roomId, () => {
        io.to(roomId).emit('joinRoom', name);
      });
    });

    socket.on('chat-msg', (roomId, name, msg) => {
      console.log(`${name} sent msg to room: ${roomId} : ${msg}`)
      io.to(roomId).emit('chat-msg', name, msg); // to(room[a])를 통해 그룹에게만 메세지를 날린다.
    });

    // 요거 추가
    socket.on('leaveRoom', (roomId, name) => {
      socket.leave(roomId, () => {
        io.to(roomId).emit('leaveRoom', name);
      });
    });

    socket.on('click', (msg) => {
      console.log(msg);
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return router;
};
