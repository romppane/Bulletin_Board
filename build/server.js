"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Student = /** @class */ (function () {
    function Student(firstname, middleinitial, lastname) {
        this.firstname = firstname;
        this.middleinitial = middleinitial;
        this.lastname = lastname;
        this.fullname = firstname + " " + middleinitial + " " + lastname;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}
// Create a new express application instance
var app = express();
var user = new Student("Tero", "TT", "Tekijä");
app.get('/', function (req, res) {
    res.send(user.fullname);
});
app.get('/person', function (req, res) {
    res.send(greeter(user));
});
app.post('/person', function (req, res) {
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
