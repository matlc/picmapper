// TODO
// upload to github - DONE
// clone to linode; test - DONE
// refactor
// clean up comments
// look up .gitignore/.gitkeep for images folder
// handle/parse daphne's photo formats
// add error handling if photos don't have gps data
// add images to infowindow in gmaps; scale down
// make photos uploadable
// funtion that checks images; deletes older than an hour; cronjob?
// make 'keep' image folder so doesn't delete



var exif = require('./exifreader');
// exif.readFiles();

exif.on('ready', function() {
    // console.log('not starting server');
    console.log('printing final: ', exif.points);
    start(exif.points);
})
// var exif = require('./exifreader');
// // var val = 'flip';
// // exif.readFiles(function (points) {
// //     console.log('starting start with ' + JSON.stringify(points));
// //     start(points);
// // });
// // var points = exif.points;
// // start(points);
// var points = exif.readFiles();
// // console.log('inside');
// console.log('points: ' + points);
// // var test = points['little.jpg'];

// // console.log(test);

// // start(points);

function start (points) {

    // var lat = points['little.jpg']['lat'];
    // var longitude = points['little.jpg']['long'];


    var app = require('express').createServer();

    app.set('views', __dirname + '/views');

    // app.use(app.static(__dirname + '/../public'));

    app.get('/', function (req, res) {
        res.render('index.jade', {title: 'maps', points: points});
    });

    app.listen(1234, '50.116.52.79');
    console.log('server is running');


    // console.log(points);
}



// lat: lat, lon: longitude
