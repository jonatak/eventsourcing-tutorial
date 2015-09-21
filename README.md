# EventSourcing Tutorial

## Introduction

This project aim to help understand the eventsourcing principle, 
it will provide you a template to start implementing your own eventsourced market place.

## Technologie choices

I use nodejs for the backend, and angularjs for the frontend, for two reason:

- first javascript is known and use by everyone, so it will be easier to just understand concept,
- second, javascript is also really adapted to event driven base application, and asynchronous operation.

The database is a redis database, also because it's a really easy to use key store database.

## Dependency

To start using this project you will need to install the following dependency:

- nodejs
- npm
- bower
- redis

To lauch your project, you simply need to lauch the command:

`nodejs template.js`

## Project architecture

This project will provide you a simple interface to test your application, and the template to develope your solution

* /app: This folder contains all the angularjs files, you shouldn't need to modify it
* /views: This is all .jade template to generate the html
* /script: Contains scripts to generate simple products
* /controller: This folder contains every files where server operation is done, and here you will need to implement some code,
  * index.js: use to parameter the routing url
  * product.js: implement simple product method
  * basket.js: it's in this file that you will need to add your code

## What you should do

You should implement the basket management of this application in a eventsourced fashion.
all the method you need to implement is in /controller/basket.js.
Description of the responses is provided in the file.
Your application should also update the field 'bank' in redis, this field is the total of all command done in the application.

To know how to use redis, and what command is available, you can see the reference of all redis command here:
([http://redis.io/commands]).

The library use to communicate with redis is node_redis, description of the library here:
([https://github.com/NodeRedis/node_redis])
