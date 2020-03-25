var express = require('express');
var router = express.Router();
var DB = require('nosql');
var nosql = DB.load('./databases/posts');

/* GET home page. */
router.post('/createPost', async function (req, res, next) {

    let currUsers = await countPosts();
    const datetime = new Date();

    if (req.body.content) {
        nosql.insert({id: currUsers, user: req.body.userId, date: datetime, body: req.body.content}).callback(function (err) {
            if (!err) {
                res.send(true);
            } else {
                res.status(500).send(err);
            }
        });
    } else if (!req.body.content) {
        res.status(500).send('Brak contentu');
    }
})
;

async function countPosts() {
    return new Promise(function (resolve, reject) {
        nosql.find().make(function (builder) {
            builder.callback(function (err, response) {
                resolve(response.length);
            });
        });
    })
}

module.exports = router;
