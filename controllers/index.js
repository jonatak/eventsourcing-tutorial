var express = require('express')
var router = express.Router()
var redis = require('redis')
var client = redis.createClient()

router.use('/basket', require('./basket'))

router.use('/products', require('./product'))

router.get('/bank', function (req, res) {
    client.get("bank", function (err, value) {
	var bank = new Object();
	bank.bank = value
	res.send(JSON.stringify(bank))
    })
});

router.get('/', function(req, res) {
    res.render('home')
});

router.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

router.get('*', function(req, res) {
    res.render('home')
});

module.exports = router
