var express = require('express');
var router = express.Router();
var DB = require('nosql');
var nosql = DB.load('./databases/posts');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.post('/', verifyToken, async function (req, res, next) {
    let currUsers = await countPosts();
    const datetime = new Date();
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if (req.body.content) {
                nosql.insert({
                    id: currUsers,
                    user: req.body.userId,
                    date: datetime,
                    body: req.body.content
                }).callback(function (err) {
                    if (!err) {
                        res.json({
                            message: 'Post created',
                        });
                    } else {
                        res.status(500).send(err);
                    }
                });
            } else if (!req.body.content) {
                res.status(500).send('Brak contentu');
            }
        }
    });
});


async function countPosts() {
    return new Promise(function (resolve, reject) {
        nosql.find().make(function (builder) {
            builder.callback(function (err, response) {
                resolve(response.length);
            });
        });
    })
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;
