
var im = require('imagemagick');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

// function readFiles() {
	// console.log(val);
	var path = './images'//path to folder of images
	// var path = '/Users/mcluttermbp/Dropbox/code/nodejs/mapper/images'; //path to folder of images
	var dir = fs.readdirSync(path);
	
	// console.log(dir);
	for (var i = 0; i < dir.length; i++) {
		if (dir[i].charAt(0) === '.') {
				dir.splice(i,1);
		}
	};
	// console.log(dir);
	loop(dir, function (points) {
		module.exports.points = points;
		module.exports.emit('ready');
	});

	function loop (dir, callb) {
		var info = {};
		var count = 0;
		
		for (var i = 0; i < dir.length; i++) {
			var image = dir[i];
			console.log('current image: ', image);
			// var constructedpath = path + '/' + image;
			console.log('info value: ', info);
			getGPS(path, image, info, function (loc, info, image) {
				console.log('inside callback image: ', image);
				console.log('image: ',  image, ' - ', JSON.stringify(loc));
				info[image] = loc;
				// console.log('forEach done');
				if (++count === dir.length) {
					callb(info);
				}
			});
		};

		// dir.forEach(function (image) {
		// // console.log(image);
		// });
		console.log('outside of forEach');
		// callb(info);
	}
		
	// console.log('should be finished');
	// cb(info);

	function getGPS (path, image, info, callback) {
		console.log('inside getGPS image: ', image);
		im.readMetadata((path + '/' + image), function (err, metadata) {
			if (err) throw err;
			var lat       = metadata.exif.gpsLatitude;
			var latref    = metadata.exif.gpsLatitudeRef;
			var longitude = metadata.exif.gpsLongitude;
			var longref   = metadata.exif.gpsLongitudeRef;
			// console.log('lat:' + metadata.exif.gpsLatitude + ', long:' + metadata.exif.gpsLongitude);
			// console.log('lat:' + lat);
			// console.log('long:' + longitude);
			latlong = {
				'lat'     : [lat, latref],
				'long'    : [longitude,longref],
			};
			var converted = formatLatLong(latlong);
			converted[path] = path;
			callback(converted, info, image);
		});
	}


	function formatLatLong (latlong) {
		var converted = {};
		var keys = ['lat', 'long'];
		var refs = ['latref', 'longref'];
		for (var key in keys) {
			var keyval = keys[key];
			if (latlong.hasOwnProperty(keyval)) {
				var decimal = convertLatLong(latlong[keyval][0]);
				// console.log('dec ' + decimal);
				var checked = checkDirection(latlong[keyval][1], decimal);
				converted[keyval] = checked;
				
			}

		};

		return converted;
	}

	function convertLatLong (point) {
		// console.log(point);
		var parts = point.split(',');
		var times = {};
		var d = parts[0].trim();
		var m = parts[1].trim();
		var s = parts[2].trim();
		var times = {
			'd': d,
			'm': m,
			's': s
		};
		for (var time in times) {
			if (times.hasOwnProperty(time)) {
				var new_time = divide(times[time]);
				times[time] = new_time;
			}
		}
		//times = divide(times);
		//console.log('parts:', parts);
		
		var decimal = times['d'] + times['m']/60 + times['s']/3600;
		return decimal.toString();
	}

	function divide (time) {
		var operators = time.split('/');
		var product = Number(operators[0]) / Number(operators[1]);
		return product;
	} 
	
	function checkDirection (ref, decimal) {
		var d = decimal;
		if (ref === 'S' || ref === 'W') {
			d = '-' + d;
		}
		return d;
	}
// }
// module.exports.readFiles = readFiles;

