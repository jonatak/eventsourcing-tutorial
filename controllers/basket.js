var express = require('express')
var router = express.Router()
var redis = require('redis')
var client = redis.createClient()

/*
* Request add:
*
* request:
* { 
*   "productId" : Int
* }
*
* You can find the product list with 'keys product_*' in redis
* see http://redis.io/commands to know how to request it.
*
* response: code 200
*/
router.post('/add', function (req, res) {
    // implement add
    res.sendStatus(200);
});

/*
* Request validate:  show calculate the total of the card + TVA (lets say 19.6),
* add the result in bank, and then empty basket.
*
* request: {}
*
* response: code 200
*/
router.post('/validate', function (req, res) {
    // implement validate
    res.sendStatus(200);
});

/*
* Request discard
*
* request: {}
*
* response: code 200
*/
router.post('/discard', function (req, res) {
    // implement discard
    res.sendStatus(200);
});


/*
* Request /
*
* request: None
*
* response: {
*    "products": [{
*      "id": Int,
*      "name": String,
*      "price": Int
*    }]
* }
*
*/
router.get('', function (req, res) {
    // implement basket list
    res.sendStatus(200)
});

module.exports = router
