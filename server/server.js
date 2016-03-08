
/**
 * Module dependencies.
 */

var http = require('http');
var https = require('https');
var express = require('express');
var cors = require('cors');
var routes = require('./routes');
// var user = require('./routes/user');
var path = require('path');

// var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();


var io = require('socket.io');
var fs = require('fs');
var _ = require('lodash');

var yetify = require('yetify'),
    config = require('getconfig'),
    uuid = require('node-uuid'),
    crypto = require('crypto')
    ;

var publicDir = 'public';
var publicDirPath = path.join(__dirname, publicDir);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cors());
app.options('*', cors()); // include before other routes
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());
app.use(express.static(publicDirPath));

app.get('/', routes.index);
// app.get('/users', user.list);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// app.get('/', function(req, res) {
//     res.sendfile(path.join(publicDirPath,'index.html'));
// });

var sio = io.listen(server);

app.mydata = {}; // to store data

app.mydata.loggedInUsers = {};

// user store
app.mydata.AllUsers = [
    {
      username: 'alice',
      passwd: 'soi',
      role: 'lecturer'
    },
    {
      username: 'bob',
      passwd: 'soi',
      role: 'student'
    },
    {
      username: 'charlie',
      passwd: 'soi',
      role: 'student'
    },
    {
      username: 'dave',
      passwd: 'soi',
      role: 'student'
    },
    {
      username: 'erin',
      passwd: 'soi',
      role: 'student'
    }
    ];

var User = {
    login: function(username, passwd) {
        var user = _.find(app.mydata.AllUsers, {username: username, passwd: passwd});
        var loggedInUser = {error: 'No such user or wrong password.'};
        if (user) {
            loggedInUser = _.clone(user);
            loggedInUser.time = new Date();
            delete loggedInUser.passwd;
            loggedInUser.error = '';
        }
        return (loggedInUser);
    },
    logout: function(username) {
        delete username in app.mystate.loggedInUsers;
    }
}

var userIO = sio.of('/user')
    .on('connection', function(socket) {
        console.log('connected', socket.id);
        socket.on('login', function(thisUser) {
            var loggedInUser = User.login(thisUser.inputUser, thisUser.inputPasswd);
            if (!loggedInUser.error) {
                loggedInUser.socket = socket;
                app.mydata.loggedInUsers[loggedInUser.username] = loggedInUser;
            }

            userIO.emit('login', _.pick(loggedInUser, ['username', 'role', 'error']));
            console.log('login', thisUser);
        });
        socket.on('logout', function(username) {
            User.logout(username);
        });

        socket.on('update', function(msg) {
            msg.timestamp = (new Date()).toISOString();
            console.log(msg);
            userIO.emit('update', msg);
        });


    });

// chat server
var chat = sio.of('/chat')
    .on('connection', function(socket) {
        socket.on('msg', function(msg) {
            chat.emit('msg', msg);
        });
    });


// slide server

app.mydata.slides = {
    '100': [ 
        {
        slideId: 12340,
        slideNo: 0,
        title: 'Wasabi 1',
        url: 'ws1.jpg',
        urlThumb: 'ws1-thumb.jpg'
        },
        {
        slideId: 12341,
        slideNo: 1,
        title: 'Wasabi 2',
        url: 'ws2.jpg',
        urlThumb: 'ws2-thumb.jpg'
        },
        {
        slideId: 12342,
        slideNo: 2,
        title: 'Wasabi 3',
        url: 'ws3.jpg',
        urlThumb: 'ws3-thumb.jpg'
        },
        {
        slideId: 12343,
        slideNo: 3,
        title: 'Wasabi 4',
        url: 'ws4.jpg',
        urlThumb: 'ws4-thumb.jpg'
        },
        {
        slideId: 12344,
        slideNo: 4,
        title: 'Wasabi 5',
        url: 'ws5.jpg',
        urlThumb: 'ws5-thumb.jpg'
        }
      ]
};

app.get('/slides/:slideDeckId', function(req, res) {
    res.contentType('json');
    var slides = app.mydata.slides[req.params.slideDeckId];
    res.json({slideDeckData: slides, slideDeckLength: slides.length});
});

var slideIO = sio.of('/slide')
    .on('connection', function(socket) {
        socket.mydata = socket.mydata || {};

        socket.on('subSlide', function(msg) {
            slideIO.emit('subSlide', msg);

            socket.mydata.user = msg.user;
            socket.mydata.slideRoom = 'slideDeckId/'+msg.slideDeckId;
            socket.mydata.slideDeckId = msg.slideDeckId;

            socket.join(socket.mydata.slideRoom);
            // console.log('room',slideIO.adapter);
            if (socket.mydata.slideRoom && socket.mydata.user.role !== 'lecturer') {
                // socket.emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNo: msg.slideNo, username: socket.mydata.user.username});
            }
        });
        socket.on('unsubSlide', function(msg) {
            slideIO.emit('unsubSlide', msg);
            socket.leave(socket.mydata.slideRoom);
            socket.mydata.slideRoom = null;
            socket.mydata.slideDeckId = null;
        });
        socket.on('pushLocalSlide', function(msg) {
            if (socket.mydata.slideRoom && socket.mydata.user.role === 'lecturer') {
                socket.mydata.slideNo = msg.slideNo;
                slideIO.to(socket.mydata.slideRoom)
                .emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNoLecturer: msg.slideNoLocal, username: socket.mydata.user.username});
            }
        });
    });

// log server
var logIO = sio.of('/logsocket')
    .on('connection', function(socket) {
        socket.on('msg', function(msg) {
            logIO.emit('msg', msg);
        });
        socket.on('update', function(msg) {
            msg.timestamp = (new Date()).toISOString();
            console.log(msg);
            logIO.emit('update', msg);
        });
    });


