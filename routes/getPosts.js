var express = require('express');
var router = express.Router();
var DB = require('nosql');
var nosql = DB.load('./databases/posts');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            nosql.find().make(function (builder) {
                builder.callback(function (err, response) {
                    res.json({
                        response,
                        authData
                    })
                });
            });
        }
    });
});

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
