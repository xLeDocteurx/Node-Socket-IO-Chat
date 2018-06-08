var fs = require('fs');

exports.commit = function(json) {
  fs.writeFile('json/save.json', JSON.stringify(json));
  console.log('JSON successfully modified!');
};

exports.elsee = function(req, res) {
  console.log('something else append');  
}