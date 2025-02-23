/**
 * Created by Arik on 2/25/2017.
 */
const jwt = require('jwt-simple');
const uuid = require('uuid');
const jwtSecret = '1234 isnt secure';
const sessionMins = 30;

module.exports.blacklist = [];
module.exports.authenticate = function (username, password) {
    if (username && password){
        if (username.toLowerCase()=='icemonkee' && password=='supersecret'){
            return true;
        }else if (username.toLowerCase()=='adam' && password=='password'){
            return true;
        }
    } else {
        return false;
    }
};

module.exports.generate = function (username) {
    var payload = {};
    payload.uid = username;
    payload.iat = Math.floor(Date.now() / 1000);
    payload.exp = Math.floor(Date.now() / 1000 + 60 * sessionMins);
    payload.sid = uuid.v4();
    payload.displayName = username;
    return jwt.encode(payload, jwtSecret);
};

module.exports.validate = function (token) {
    if (token) {
        var payload = jwt.decode(token, jwtSecret);
        if (this.blacklist.indexOf(payload.sid) < 0) {
            return payload;
        }
    }
    return null;
};

module.exports.decodeNoValidate = function (token) {
    return jwt.decode(token, jwtSecret, true);
};

module.exports.refresh = function(token){
    if (token) {
        var payload = jwt.decode(token, jwtSecret);
        if (this.blacklist.indexOf(payload.sid) < 0) {
            payload.exp = Math.floor(Date.now() / 1000 + 60 * sessionMins);
            return jwt.encode(payload, jwtSecret);
        }
    }
    return null;
};

module.exports.terminate = function (token) {
    var payload = this.decodeNoValidate(token);
    this.blacklist.push(payload.sid);
    return !!token;
};