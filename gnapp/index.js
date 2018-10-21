var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var date = require('date-utils');
var fs = require('fs');
var sql = require('./database/sql_connect');
var connection = sql.connect();  

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); 
app.set('views','../view');

app.use(express.static(path.join(__dirname, '../../neighbor')));

app.get('/', function(req, res){
    res.render('main');
});

app.get('/group', function(req, res){
    var sqll = 'SELECT * FROM board_writing order by num DESC';
    var datas =[];
    connection.query(sqll, function (err, rows, fields) {
        if (err) {
            console.log("Query failed", err);
        } else {
                res.render('group', {data : rows});
        }
    }); 
});

app.get('/users', function(req, res){
    var sqll = 'SELECT * FROM user';
    var datas =[];
    connection.query(sqll, function (err, rows, fields) {
        if (err) {
            console.log("Query failed", err);
        } else {
                res.render('users', {data : rows});
        }
    }); 
});

app.get('/support_notice', function(req, res){
    var sqll = 'SELECT * FROM support order by num DESC';
    var datas =[];
    connection.query(sqll, function (err, rows, fields) {
        if (err) {
            console.log("Query failed", err);
        } else {
                res.render('support_notice', {data : rows});
        }
    });
});

app.get('/group_writing', function(req, res){
    res.render('group_board');
});

app.get('/support', function(req, res){
    res.render('support_board');
});

app.get('/sign_up', function(req, res){
    res.render('login');
});

app.post('/group_writing', function(req, res){
    var temp = [];
    var dt = new Date();
    var d = dt.toFormat('YY-MM-DD');
    var content = req.body;
    var sqll = "INSERT INTO board_writing (title, main, _pwd, DT) VALUES(?,?,?,?)";
    temp.push(content.subject.toString(),  content.content, content.pwd, d);
    connection.query(sqll, temp, function(err, result){
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect('/group');
});

app.post('/support', function(req, res){
    var temp = [];
    var dt = new Date();
    var d = dt.toFormat('YY-MM-DD');
    var content = req.body;
    var sqll = "INSERT INTO support (title, main, _pwd, DT) VALUES(?,?,?,?)";
    temp.push(content.subject.toString(),  content.content, content.pwd, d);
    connection.query(sqll, temp, function(err, result){
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect('/support_notice');
});

app.post('/sign_up', function(req, res){
    var temp = [];
    var dt = new Date();
    var d = dt.toFormat('YY-MM-DD');
    var content = req.body;
    console.log(content);
    var sqll = "INSERT INTO user (_id, _email,_pwd, DT) VALUES(?,?,?,?)";
    temp.push(content.id, content.email, content.pwd, d);
    connection.query(sqll, temp, function(err, result){
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect('/login');
});

app.post('/group', function(req, res){
    var content = req.body.subject.toString();
    var sqll = "SELECT * FROM board_writing where title = " +  '\"' + content + '\"';
    connection.query(sqll, function (err, rows, fields) {
        if (err) {
            console.log("Query failed", err);
        } else {
                res.render('group', {data : rows});
        }
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.listen(4000, function() {
    console.log("Go!");
});