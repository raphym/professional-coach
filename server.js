const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();



//routes
var appRoutes = require('./server/routes/appRoutes');
var guestbookRoutes = require('./server/routes/guestbook');
var userRoutes = require('./server/routes/users');
var mailService = require('./server/routes/mail-system');



// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'public')));//au lieu de dist c public

// API location
app.use('/api', api);


//configure the root of the app
app.use('/guestbook', guestbookRoutes);
app.use('/user', userRoutes);
app.use('/sendmail', mailService);

app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index');
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);


server.listen(port, () => console.log(`Running on localhost:${port}`));