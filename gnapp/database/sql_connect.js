var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'ksw',
  password : '1q2w3e4r',
  database : 'gn'
});

exports.connect = function(){
    return connection;
}