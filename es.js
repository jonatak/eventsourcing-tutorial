var express = require('express');
var bodyParser = require('body-parser')
var redis = require('redis')
var async = require('async')

var client = redis.createClient()
var app = express();


app.use(bodyParser.json())

// TODO there: Implement those call

// Account operation
app.get('/bank', function (req, res) {

}); 

// Basket operation
app.put('/basket/:id', function (req, res) {
    res.sendStatus(201);
});

app.post('/basket/:id/add', function (req, res) {
    res.sendStatus(201);
});

app.post('/basket/:id/validate', function (req, res) {
    res.sendStatus(201);
})

app.post('/basket/:id/discard', function (req, res) {
    res.sendStatus(201);
})

app.delete('/basket/:id/products/:pid', function (req, res) {
    res.sendStatus(202);
});

app.get('/basket/:id', function (req, res) {
    res.sendStatus(404)
})

// Simple add and remove product API
app.get('/products', function(req, res) {
    var response = new Object();
    response.products = [];

    var onComplete = function (err, elems) {
	for (elem in elems) {
	    response.products.push(JSON.parse(elem))
	}
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(response))
    };

    client.keys("product_*", function(err, replies) {
	async.parallel(
	    replies.map(function(reply) {
		return function(callback) {
		    client.get(reply, function(err, value) {
			response.products.push(JSON.parse(value))
			callback(err, value)
		    })
		};
	}), onComplete);
    });
});

app.get('/products/:id', function(req, res) {
    client.get("product_"+req.params.id, function (err, value) {
	if (err) res.sendStatus(404)
	else {
	    res.setHeader('Content-Type', 'application/json');
	    res.send(value)
	}
    })
});

app.put('/products/:id', function (req, res) {
    client.set("product_"+req.params.id, JSON.stringify(req.body), function (err, value) {
	redis.print(err, value)
	if (err) res.sendStatus(500)
	else res.sendStatus(201)
    })
});

app.listen(3000);
console.log('Listening on port 3000...');
