/**
 * Created by Arik on 2/25/2017.
 */


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ts = require('./core/tokenservice');

const port = 80;
const apphome = '/app';
const home = '/';
const login = '/login';
const sessionMins = 30;

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logging);

app.use(home, express.static(path.join(__dirname, 'public/html')));
app.use(apphome, checkAuth, express.static(path.join(__dirname, 'private/html')));

app.get(login, function (req, res) {
    res.sendFile(path.join(__dirname, 'public/html/login.html'));
});

app.use('/cdn/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/cdn/font-awesome', express.static(path.join(__dirname, 'node_modules/font-awesome')));
app.use('/cdn/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/cdn/jquery-cookie', express.static(path.join(__dirname, 'node_modules/jquery.cookie')));
app.use('/cdn/vue', express.static(path.join(__dirname, 'node_modules/vue/dist')));
app.use('/cdn/js', express.static(path.join(__dirname, 'public/html/js')));

app.post('/api/auth/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (ts.authenticate(username, password)) { //FIXME sanitize input
        var token = ts.generate(username);
        res.cookie('auth', token, {maxAge: 1000*60*sessionMins});
        res.redirect(apphome);
    } else {
        res.redirect(login);
    }
});

app.get('/api/auth/logout', function(req, res){
    var auth = req.cookies.auth;
    ts.terminate(auth);
    res.clearCookie('auth');
    res.redirect(home);
});

app.post('/api/auth/refresh', function(req, res){
    var auth = req.cookies.auth;
    var newtoken = ts.refresh(auth);
    res.cookie('auth', newtoken, {maxAge: 1000*60*sessionMins});
    res.send();
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

//Middleware Functions
function logging(req, res, next) {
    console.log(timestamp() + ': ' + req.headers['x-forwarded-for'] + ' | ' + req.connection.remoteAddress + ' - ' + req.url);
    next();
}

function checkAuth(req, res, next) {
    var authcookie = req.cookies.auth;
    if (!ts.validate(authcookie)) {
        res.redirect(login);
    } else {
        next();
    }
}

// Other functions
function timestamp() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return year + '-' + enforceLeadingZeros(month, 2) + '-' + enforceLeadingZeros(day, 2) + " " +
        enforceLeadingZeros(hour, 2) + ':' + enforceLeadingZeros(min, 2) + ':' + enforceLeadingZeros(sec, 2);
}

function enforceLeadingZeros(_num, len) {
    var num = _num.toString();
    while (num.length < len) {
        num = '0' + num;
    }
    return num;
}