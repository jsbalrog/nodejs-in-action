var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;
var multipartMiddleware = require('connect-multiparty')();

module.exports = function(app) {
	var pics = [];

	pics.push({
		name: 'Tiger',
		path: '../images/tiger.jpg',
	});

	pics.push({
		name: 'Cows in a field',
		path: '../images/cows.jpg'
	});

	pics.push({
		name: 'Golden Retriever',
		path: '../images/dog.jpg'
	});

	app.route('/')
		.get(function(req, res, next) {
			Photo.find({}, function(err, photos) {
				if(err) return next(err);
				res.render('photos', {
					title: 'Photos',
					photos: photos
				});
			});
		});

	app.route('/photo/:id')
		.get(function(req, res, next) {
			var dir = app.get('photos'),
					id = req.params.id;
			Photo.findById(id, function(err, photo) {
				if(err) return next(err);
				var path = join(dir, photo.path);
				res.download(path, photo.name + '.jpeg', function(err) {
					if(err) return next(err);
				});
			});
		});

	app.route('/upload')
		.get(function(req, res, next) {
			res.render('photos/upload', {
				title: 'Photo upload'
			});
		})

		.post(multipartMiddleware, function(req, res, next) {
			var img = req.files.photo.image;
			var name = req.body.photo.name || image.name;
			var dir = app.get('photos');
			var p = join(dir, img.name);
			fs.rename(img.path, p, function(err) {
				if(err) return next(err);

				Photo.create({
					name: name,
					path: img.name
				}, function(err) {
					if(err) return next(err);
					res.redirect('/');
				});
			});
		});
};
