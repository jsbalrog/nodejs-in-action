var redis = require('redis'),
  bcrypt = require('bcrypt'),
  db = redis.createClient();

module.exports = User;

function User(obj) {
  // iterate on keys and merge in values
  for(var key in obj) {
    this[key] = obj[key];
  }
}

// save method on a user object
User.prototype.save = function(fn) {
  if(this.id) {
    this.update(fn);
  } else {
    var user = this;
    db.incr('user:ids', function(err, id) {
      if(err) return fn(err);
      user.id = id;
      user.hashPassword(function(err) {
        if(err) return fn(err);
        user.update(fn);
      });
    });
  }
};

User.prototype.update = function(fn) {
  var user = this;
  var id = user.id;
  // index user id by name
  db.set('user:id:' + user.name, id, function(err) {
    if(err) return fn(err);
    // use redis set to store data
    db.hmset('user:' + id, user, function(err) {
      fn(err);
    });
  });
};

User.prototype.hashPassword = function(fn) {
  var user = this;
  bcrypt.genSalt(12, function(err, salt) {
    if(err) return fn(err);
    user.salt = salt; // save salt
    // generate hash
    bcrypt.hash(user.pass, salt, function(err, hash) {
      if(err) return fn(err);
      user.pass = hash;
      fn();
    });
  });
};

User.prototype.getByName = function(name, fn) {
	User.getId(name, function(err, id) {
		if(err) return fn(err);
		User.get(id, fn);
	});
});

User.prototype.getId = function(name, fn) {
	db.get('user:id:' + name, fn);
};

User.prototype.get = function(id, fn) {
	dbhgetall('user:' + id, function(err, user) {
		if(err) return fn(err);
		fn(null, new User(user));
	});
};