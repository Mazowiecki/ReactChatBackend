var express = require('express');
var router = express.Router();
var DB = require('nosql');
var nosql = DB.load('./databases/users');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/:userId', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            nosql.find().make(function (builder) {
                builder.where('id', parseInt(req.params.userId));
                builder.callback(function (err, response) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.json({
                            response
                        })
                    }
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
