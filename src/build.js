// In the root:
// npm run-script build

var jsp  = require('uglify-js').parser,
    pro  = require('uglify-js').uglify,
    fs   = require('fs');

function readFiles(callback) {
  var left, mainData, minData, copyrightData;

  left = 2;

  fs.readFile(__dirname + '/copyright.js', function (err, data) {
    if (err) { throw err; }

    copyrightData = data.toString();
    if (!--left) {
      callback(copyrightData, mainData, minData);
    }
  });

  fs.readFile(__dirname + '/treeIt.js', function (err, data) {
    var ast, finalCode;

    if (err) { throw err; }

    data = data.toString();
    mainData = data;

    ast  = jsp.parse(data);
    ast  = pro.ast_mangle(ast);
    ast  = pro.ast_squeeze(ast);

    minData = pro.gen_code(ast);

    if (!--left) {
      callback(copyrightData, mainData, minData);
    }
  });
}

function createFiles(mainData, minData, callback) {
  var left = 2;

  function toDo(err) {
    if (err) { throw err; }
    if (!--left) {
      callback();
    }
  }

  fs.writeFile(__dirname + '/../treeIt.js', mainData, toDo);
  fs.writeFile(__dirname + '/../treeIt.min.js', minData, toDo);
}

(function build() {

  // build treeIt.js & treeIt.min.js
  readFiles(function(copyrightData, mainData, minData) {
    var mainData, minData;

    // copyright + non-minified content
    mainData = copyrightData + '\n' + mainData;
    // copyright + minified content
    minData  = copyrightData + minData;
    createFiles(mainData, minData, function() {
      console.log('Build complete.');
    });
  });
}());
