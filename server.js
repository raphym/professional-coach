const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const app = express();

//routes
var appRoutes = require('./server/routes/appRoutes');
var guestbookRoutes = require('./server/routes/guestbook');
var usersAuthRoutes = require('./server/routes/users-auth');
var usersManagementRoutes = require('./server/routes/users-management');

var mailService = require('./server/routes/mail-system');
var article = require('./server/routes/article');


// API file for interacting with MongoDB
const database = require('./server/routes/database');

//set views
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'hbs');

// Parsers
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//cookieParser
app.use(cookieParser());

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'public')));//au lieu de dist c public

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

//Database location
app.use('/database', database);


//configure the root of the app
app.use('/guestbook', guestbookRoutes);
app.use('/users-auth', usersAuthRoutes);
app.use('/users-management', usersManagementRoutes);


app.use('/sendmail', mailService);
app.use('/article', article);

app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render('index');
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);


server.listen(port, () => console.log(`Running on localhost:${port}`));