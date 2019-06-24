import express = require('express');

class Student {
  fullname : string;
  constructor(public firstname : string, public middleinitial : string, public lastname : string) {
    this.fullname = firstname + " " + middleinitial + " " + lastname;
  }
}

interface Person {
  firstname: string;
  lastname: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstname + " " + person.lastname;
}

// Create a new express application instance
const app: express.Application = express();
const user = new Student("Tero", "TT", "Tekijä");
app.get('/', function (req, res) {
  res.send(user.fullname);
});



app.get('/person', (req, res) => {
  res.send(greeter(user));
})

app.post('/person', (req,res) => {

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
