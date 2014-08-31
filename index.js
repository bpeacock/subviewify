var transformTools = require('browserify-transform-tools'),
    fs = require('fs'),
    less = new require('less').Parser({}),
    subviewRegex = /subview *\(/g;

require('colors');

module.exports = transformTools.makeStringTransform('subviewify', {
  excludeExtensions: ['.json']
}, function (content, options, done) {
  var file = options.file;

  if(content.match(subviewRegex)) {
    var deps = [];

    var template = getResource(file, 'jade').replace(/include +([a-zA-Z0-9\/\.]+)( +({.*}))?/g, function(match, path, bs, config) {
      var id = deps.indexOf(path);

      if(id === -1) {
        id = deps.length;
        deps.push(path);
      }

      var configArg = config ? ' data-config='+config : '';

      return 'script(type=\'text/subview\' data-id='+id+configArg+')';
    })
      .replace(/(\r\n|\n|\r)/gm, '\\\n')  // Escape newlines
      .replace(/"/g, '\\"');              // Escape quotes

    deps = deps.length ? 'require("'+deps.join('"), require("')+'")' : '';

    less.parse(getResource(file, 'less'), function (error, cssTree) {
      if(error) {
        less.writeError(error, options);
        return;
      }

      var css = cssTree.toCSS( {
        compress: true
      }).toString()
        .replace(/"/g, '\\"'); // Escape Quotes

      //Add non-user arguments to subview
      done(null, content.replace(subviewRegex, 'subview("'+css+'", "'+template+'", ['+deps+'], '));
    });
  }
});

function getResource(jsPath, type) {
  var path = jsPath.replace(/\.js$/, '.'+type);

  if(fs.existsSync(path)) {
    return fs.readFileSync(path).toString();
  }
  else {
    return '';
  }
}
