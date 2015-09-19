var redis = require('redis')
var client = redis.createClient()

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
		var totalCard = values.map(function(elem) {
		    var product = JSON.parse(elem)
		    return product.price
		}).reduce(function(a, b) {return a + b;});
		var finalPrice = totalCard + (totalCard/100*20)
		event.ttc = Math.round(finalPrice)
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

    saveEvent : function(event) {
	client.rpush("event", JSON.stringify(event), redis.print);
    },

    processEvent : function(event) {
	switch(event.name) {
	case "ProductAdded":
	    break;
	case "CardDiscard":
	    break;
	case "ValidateBasket":
	    client.incrby("bank", event.ttc, redis.print);
	    break;
	}
    },

    reload:  function() {
	client.del("basket", redis.print)
	client.set("bank", 0)
	client.lrange("event", 0, -1, function(err, values) {
	    values.map(function(event) {
		eventHandler.processEvent(JSON.parse(event))
	    });
	});
    }
}

module.exports = {
    reload: function() {
	eventHandler.reload();
    },
    process: function(cmd, data) {
	commandHandler(cmd, data, function(event) {
	    eventHandler.saveEvent(event);
	    eventHandler.processEvent(event);
	})
    }
}

