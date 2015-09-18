var express = require('express')
var router = express.Router()
var redis = require('redis')
var async = require('async')
var client = redis.createClient()


// Simple add and remove product API
router.get('', function(req, res) {
    var response = new Object();
    response.products = [];

    var onComplete = function (err, elems) {
	response.products = elems.map(function (elem) {
	    return JSON.parse(elem);
	});
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(response))
    };

    client.keys("product_*", function(err, replies) {
	async.parallel(
	    replies.map(function(reply) {
		return function(callback) {
		    client.get(reply, function(err, value) {
			callback(err, value)
		    })
		};
	}), onComplete);
    });
});

router.get('/:id', function(req, res) {
    client.get("product_"+req.params.id, function (err, value) {
	if (err) res.sendStatus(404)
	else {
	    res.setHeader('Content-Type', 'application/json');
	    res.send(value)
	}
    })
});

router.put('/:id', function (req, res) {
    client.set("product_"+req.params.id, JSON.stringify(req.body), function (err, value) {
	redis.print(err, value)
	if (err) res.sendStatus(500)
	else res.sendStatus(201)
    })
});

module.exports = router
