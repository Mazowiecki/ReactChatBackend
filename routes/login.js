var express = require('express');
var router = express.Router();
var DB = require('nosql');
var nosql = DB.load('./databases/users');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.post('/', function (req, res, next) {
    nosql.find().make(function (builder) {
        builder.where('email', req.body.email);
        builder.where('password', req.body.password);
        builder.callback(function (err, response) {
            if (response.length > 0) {
                const [user] = response;
                console.log(user);
                var datetime = new Date();
                console.log(datetime);
                jwt.sign({user}, 'secretkey', {expiresIn: '30m'}, (err, token) => {
                    res.json({
                        token
                    })
                })
            } else {
                res.send('Brak usera o podanych danych');
            }
        });
    });
});

module.exports = router;
