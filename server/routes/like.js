var express = require('express');
var router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

router.post('/getLikes', (req, res) => {

    const variable = { sellerId: req.body.sellerId };

    Like.find(variable)
        .exec((err, likes) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })

});

router.post('/getDislikes', (req, res) => {

    const variable = { sellerId: req.body.sellerId };

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })

});

router.post('/upLike', (req, res) => {

    const variable = { sellerId: req.body.sellerId, userId: req.body.userId};

    // Like collection에다가 클릭 정보를 넣어 줌.
    const like = new Like(variable);

    like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err });

        // 만약에 dislike이 이미 클릭되어있다면, dislike을 1 줄여준다.
        Dislike.findOneAndDelete(variable)
            .exec((err, dislikeResult) => {
                if (err) return res.json({ success: false, err });
                res.status(200).json({ success: true });
            });
    });
});

router.post('/unLike', (req, res) => {

    const variable = { sellerId: req.body.sellerId, userId: req.body.userId};

    Like.findOneAndDelete(variable)
    .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});

router.post('/upDislike', (req, res) => {

    const variable = { sellerId: req.body.sellerId, userId: req.body.userId};

    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult) => {
        if (err) return res.json({ success: false, err });

        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if (err) return res.json({ success: false, err });
                res.status(200).json({ success: true });
            });
    });
});

router.post('/unDislike', (req, res) => {

    const variable = { sellerId: req.body.sellerId, userId: req.body.userId};

    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});


module.exports = router;
