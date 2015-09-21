var express = require('express')
var router = express.Router()
var redis = require('redis')
var client = redis.createClient()

router.post('/add', function (req, res) {
    // implement add
    res.sendStatus(200);
});

router.post('/validate', function (req, res) {
    // implement validate
    res.sendStatus(200);
});

router.post('/discard', function (req, res) {
    // implement discard
    res.sendStatus(200);
});

router.get('', function (req, res) {
    // implement basket list
    res.sendStatus(200)
});

module.exports = router
