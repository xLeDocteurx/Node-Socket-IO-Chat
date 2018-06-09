var fs = require('fs');

exports.commit = function(data) {
  // console.log(JSON.stringify(data));
  // fs.writeFile('save.json', "This is working");
  fs.writeFile('json/save.json', JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log('JSON successfully modified!');
  }); 
};

exports.autoscroll = function(req, res) {
  console.log('something else append');
}