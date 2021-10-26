const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();

var hbs = exphbs.create({
    layoutsDir: './views/layouts',
    helpers: {}
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use(express.static('public'));
//app.use("/public", express.static('public'));
//app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))

open({
    filename: './survey_database.db',
    driver: sqlite3.Database
}).then(async function (db) {
    
    await db.migrate(); // run migrations

    app.get('/', function (req, res) {
        res.render('landing_page', {
            layouts: 'main',
        });
    });

    app.get('/survey', function (req, res) {
        res.render('survey', {
            layouts: 'main',
        });
    });

    app.post('/survey', function (req, res) {
       console.log(
            "Surname: " + req.body.surname + "\n" +
            "Firstname: " + req.body.firstname + "\n" +
            "Contact Number: " + req.body.conNumber + "\n" +
            "Date: " + req.body.date + "\n" +
            "Age: " + req.body.age + "\n" + 
            "Favorite Food: " + req.body.favFood + "\n" +
            "Like to eat out rating: " + req.body.eatOut + "\n" +
            "Like to watch movies rating: " + req.body.movies + "\n" +
            "Like to watch TV rating: " + req.body.tv + "\n" +
            "Like to listen to radio rating: " + req.body.likeRadio
       );

       res.redirect("/");
    });

    app.get('/results', function (req, res) {
        res.render('results', {
            layouts: 'main',
        });
    });


})

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})