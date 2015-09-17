var express = require('express');
var bodyParser = require('body-parser')
var redis = require('redis')
var async = require('async')

var client = redis.createClient()
var app = express();


app.use(bodyParser.json())

var commandHandler = function (cmd, data, callback) {
    switch (cmd) {

    case "add":
	client.get("product_"+data, function(error, res) {
	    if (error) {
		callback(null);
	    }
	    else {
		event = new Object();
		event.name = "ProductAdded";
		event.product = JSON.parse(res);
		client.rpush("basket", JSON.stringify(event.product));
		callback(event);
	    }
	});
	break;
    case "validate":
	event = new Object();
	event.name = "CardValidated";
	    var flush = function() {
		client.del("basket", redis.print)
	    };

	    client.lrange("basket", 0, -1, function(err, values) {
		var event = new Object();
		event.name = "ValidateBasket"
		var totalCard = 0
		for (elem in values) {
		    var product = JSON.parse(elem)
		    totalCard += product.price
		}
		var finalPrice = totalCard + (totalCard/100*20)
		event.ttc = finalPrice
		callback(event);
		flush();
	    });
	break;
    case "discard":
	event = new Object();
	event.name = "CardDiscard";
	client.del("basket", redis.print)
	callback(event);
	break;
    }
}

var eventHandler = {

    var saveEvent = function(event) {
	client.rpush("event", JSON.stringify(event), redis.print);
    };

    var processEvent = function(event) {
	switch(event.name) {
	case "ProductAdded":
	    break;
	case "CardDiscard":
	    break;
	case "ValidateBasket":
	    client.get("bank", function (err, data) {
		if (err) client.set("bank", event.ttc, redis.print)
		else {
		    client.set("bank", event.ttc + data, redis.print)
		}
	    });
	    break;
	};
    };
    
    var reloadState = function() {
	client.del("basket", redis.print)
	client.del("bank", redis.print)
	client.lrange("event", 0, -1, function(err, values) {
	    for (event in values) {
		process(JSON.parse(event))
	    }
	});
    };
}

var commandToEvent = function(cmd, data) {
    commandHandler(cmd, data, function(event) {
	eventHandler.saveEvent(event)
	eventHandler.process(event)
    });
}

// Account operation
app.get('/bank', function (req, res) {
    res.sendStatus(200)
}); 

// Basket operation

app.post('/basket/add', function (req, res) {
    res.sendStatus(201);
});

app.post('/basket/validate', function (req, res) {
    res.sendStatus(201);
})

app.post('/basket/discard', function (req, res) {
    res.sendStatus(201);
})

app.delete('/basket/products/:id', function (req, res) {
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
