const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/key'); // mongoURI 가져오기
const { User } = require('../models/User'); // 유저모델 가져오기
const { Book } = require('../models/Book'); // 도서모델 가져오기
const { auth } = require('../middleware/auth'); // auth 미들웨어 가져오기
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // 비밀번호 암호화 하기

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 오류 막기 위함
}).then(() => console.log('MongoDB connected...')).catch(err => console.log(err));

// 인증 메일 보내기
function emailVerify(host, email, key) {
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "aesop2418@gmail.com",
            pass: "!groovy365"
        }
    });

    var link = "http://" + host + "/api/users/verify?id=" + key;

    var mailOptions = {
        from: 'rlaaudtjd8@gmail.com', // sender address
        to: email, // list of receivers
        subject: "✔ Please confirm your Email account", // Subject line
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>" // html body
    };


    smtpTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + info.response);
        }
        smtpTransport.close();
    });
}

// 회원가입
router.post('/register', (req, res) => {
    userData = {
        name: req.body.name,
        id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        address: req.body.roadAddress + " " + req.body.detailAddress,
        phone: req.body.phone,
        campus: req.body.campus,
        key_for_verify: bcrypt.hashSync(Math.random().toString(), 10)
    }

    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어준다.

    // req.body는 JSON 형태

    const user = new User(userData); // 유저 인스턴스 생성

    // 정보들을 유저모델에 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err }) // err시 json형태로 실패한 정보 전달.
        emailVerify(req.get('host'), userData.email, userData.key_for_verify);
        return res.status(200).json({
            success: true
        })
    });
});

router.get('/verify',function (req,res) {
    User.updateOne({key_for_verify:req.query.id},{$set:{email_verified:true}}, function(err,user){
        //에러처리
        if (err) {
            console.log(err);
        }
        //일치하는 key가 없으면
        else if(user.n==0){
            res.send('<script type="text/javascript">alert("Not verified");</script>');
        }
        //인증 성공
        else {
            res.send('<script type="text/javascript">alert("Successfully verified"); window.location.href="http://localhost:3000/login";</script>');
        }
    });
});

// 로그인
router.post('/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ id: req.body.id }, (err, userInfo) => {
        if (!userInfo) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인. (메소드 제작)
        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

            // 비밀번호까지 맞다면 토큰을 생성하기. (메소드 제작)
            userInfo.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 쿠키에 토큰을 저장하고 client로 쿠키를 전달하여 로컬스토리지에 저장하도록 한다.
                res.cookie("jwt", user.token, { expires: new Date(user.tokenExp), httpOnly: true }).status(200).json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

// 인증
router.get('/auth', auth, (req, res) => { // auth라는 미들웨어 추가. 엔드포인트에서 request받고 callback전에 중간 처리.

    // 여기가지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
    res.status(200).json({
        _id: req.user._id, // auth 미들웨어 통해 가져왔기 때문에 사용 가능
        isAdmin: req.user.role === 0 ? false : true, // role : 0 -> 일반유저
        isAuth: true,
        id: req.user.id,
        address: req.user.address,
        phone: req.user.phone,
        campus: req.user.campus,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        email_verified: req.user.email_verified,
        cart: req.user.cart,
        history: req.user.history

    });
});

// 로그아웃
router.get('/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

router.get('/addToCart', auth, (req, res) => {

    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        userInfo.cart.forEach((item) => {
            if (item.id == req.query.bookId) {
                duplicate = true;
            }
        })

        // 이미 카트에 들어있다면 1증가
        if (duplicate) {
            if (err) return res.json({ success: false, err });
            res.status(200).json({success: true, duplicate, cart: userInfo.cart})
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.bookId,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json({success:true, duplicate, cart: userInfo.cart})
                }
            )
        }
    })
});

router.get('/removeFromCart', auth, (req, res) => {
    
    User.findOneAndUpdate({_id: req.user._id}, {"$pull": {"cart": {"id": req.query._id}}}, {new: true}, (err, userInfo) => {
        let cart = userInfo.cart;
        let array = cart.map(item => {
            return item.id
        })

        Book.find({'_id' : { $in: array }})
        .populate('seller')
        .exec((err, cartDetail) => {
            return res.status(200).json({
                cartDetail,
                cart
            })
        })
    })
});

router.get('/userCartInfo', auth, (req, res) => {
    User.findOne({_id: req.user._id}, (err, userInfo) => {
        let cart = userInfo.cart;
        let array = cart.map(item => {
            return item.id
        })

        Book.find({'_id': {$in: array}})
        .populate('seller')
        .exec((err, cartDetail) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success:true, cartDetail, cart}); 
        })
    })
})

module.exports = router;
