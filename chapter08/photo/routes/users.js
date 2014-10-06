var express = require('express');
var users = express.Router();

/* GET users listing. */
users.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = users;
