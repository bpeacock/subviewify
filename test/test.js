var browserify = require('browserify');

require('colors');

var b = browserify();
b.add(__dirname + '/../examples/basic');
b.transform(__dirname + '/..');
b.bundle(function (err, src) {
    console.log(err);
    console.log(src.toString().green);
});
