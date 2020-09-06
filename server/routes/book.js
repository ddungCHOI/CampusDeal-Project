const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Book } = require('../models/Book');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // uploads라는 폴더 생성하고 저장
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`) // ex) 1220001309139_hello
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).array("images"); // 파일 하나만

router.post('/uploadImage', (req, res) => {
    return res.status(200).send("Image Upload Success");
});

router.post('/uploadBook', (req, res) => {
    //이미지를 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        req.body.methods = JSON.parse(req.body.methods)
        req.body.images = []
        res.req.files.map(img => {
            req.body.images.push(img.path)
        });

        const book = new Book(req.body);

        book.save((err, bookInfo) => {
            if (err) return res.status(400).json({ success: false });
            return res.status(200).json({ success: true, bookInfo });
        })
    })
});

router.get('/getBooks', (req, res) => {
    let limit = parseInt(req.query.limit);
    let category = req.query.category ? req.query.category : {};
    let search = req.query.search;

    if (search) {
        Book.find(category)
            .find({$text:{$search: search}}) // 몽고디비
            .populate('seller')
            .sort([["createdAt", "desc"]])
            .limit(limit)
            .exec((err, books) => {
                if (err) return res.status(400).send(err);
                res.status(200).json({ success: true, books});
            })

    } else {
        Book.find(category)
            .populate('seller')
            .sort([["createdAt", "desc"]])
            .limit(limit)
            .exec((err, books) => {
                if (err) return res.status(400).send(err);
                res.status(200).json({ success: true, books});
            })
    }

    // Book.find()
    //     .populate('seller')
    //     .sort([["createdAt", "desc"]])
    //     .limit(limit)
    //     .exec((err, books) => {
    //         console.log(limit)
    //         if (err) return res.status(400).send(err);
    //         res.status(200).json({ success: true, books});
    //     })
});

router.get('/getBookDetail', function (req, res) {

    Book.findOne({'_id' : req.query.id})
    .populate('seller')
    .exec((err, info) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, info});
    })

});

router.get('/book_by_id', function (req, res) {

    let type = req.query.type;
    let bookIds = req.query.id;

    if(type === "array") {
        let ids = req.query.id.split(',');
        bookIds = [];
        bookIds = ids.map(item => {
            return item
        })

    }

    //we need to find the product information that belong to product Id
    Book.find({'_id' : {$in: bookIds}}) // in은 배열 집어넣을 수 있음.
    .populate('seller')
    .exec((err, book) => {
        if(err) return res.status(400).send(err);
        return res.status(200).send(book); // send: 배열형식으로 보냄
    })

});



module.exports = router;
