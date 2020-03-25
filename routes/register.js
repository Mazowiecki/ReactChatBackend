var express = require('express');
var router = express.Router();
var DB = require('nosql');
var nosql = DB.load('./databases/users');

/* GET home page. */
router.post('/', async function (req, res, next) {

    let currUsers = await countUsers();

    if (await checkEmail(req.body.email) === 0) {
        if (req.body.email && req.body.password) {
            nosql.insert({id: currUsers, email: req.body.email, password: req.body.password}).callback(function (err) {
                if (!err) {
                    res.send(true);
                } else {
                    res.status(500).json({status: err});
                }
            });
        } else if (!req.body.password) {
            res.status(500).json({status: 'Brak hasła'});
        } else if (!req.body.email) {
            res.status(500).json({status: 'Brak emaila'});
        }
    } else {
        res.status(500).json({ status: 'Konto o podanym emailu znajduje się w bazie'});
    }

});

// res.json({
//     status: 'Brak usera o podanych danych'
// })

async function countUsers() {
    return new Promise(function (resolve, reject) {
        nosql.find().make(function (builder) {
            builder.callback(function (err, response) {
                resolve(response.length);
            });
        });
    })
}

async function checkEmail(email) {
    return new Promise(function (resolve, reject) {
        nosql.find().make(function (builder) {
            builder.where('email', email);
            builder.callback(function (err, response) {
                resolve(response.length);
            });
        });
    })
}

module.exports = router;