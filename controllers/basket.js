var express = require('express')
var router = express.Router()
var basket = require('../services/basket')
var redis = require('redis')
var client = redis.createClient()

router.post('/add', function (req, res) {
    basket.process("add", req.body.productId)
    res.sendStatus(200);
});

router.post('/validate', function (req, res) {
    basket.process("validate", req.body)
    res.sendStatus(200);
});

router.post('/discard', function (req, res) {
    basket.process("discard", req.body)
    res.sendStatus(200);
});

router.get('', function (req, res) {
    client.lrange("basket", 0, -1, function(err, values) {
	var ret = new Object();
	ret.products = values.map(function(value) {
	    return JSON.parse(value);
	});
	res.send(JSON.stringify(ret))
    });
});

module.exports = router
