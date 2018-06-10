let express = require('express');
let socket = require('socket.io');
let bodyparser = require('body-parser');
let fs = require('fs');

// let firebase = require('firebase');
// let firebaseui = require('firebaseui');
// var app = firebase.initializeApp({ ... });

let all_Clients = [];
let webport = 8080;

let save = require('./json/save.json');
var { commit, elsee } = require('./utils/utils.js');

let app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

let server = app.listen(process.env.PORT || webport);

let io = socket(server);


// ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//         firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     // Other config options...
// });

app.get('/', (req, res) => {
    res.render('index', { datas : save, users : all_Clients });
});

// io.on('post_msg', function () {
//     console.log('Some user is trying to post a message');
// });

// io.on('register_user', function(){
//     console.log('Some user is trying to register');
// });

// io.on('connect_user', function(){
//     console.log('Some user is trying to connect');
// });

io.on('connection', (socket) => {
    /////////////////////////////////////////////////////////////////////
    // récupérer le localStorage apres connection de l'utilisateur     //
    /////////////////////////////////////////////////////////////////////
    console.log(`Someone is trying to connect on the server`);
    all_Clients.push(socket.id);
    /////////////////////////////////////////////////////////////////////
    //                                                                 //
    /////////////////////////////////////////////////////////////////////

    // socket.emit('refresh_userslist', all_Clients);
    console.log("New client connection : " + socket.id);

    socket.on('refresh', function (data) {
        // data.clients = all_Clients;
        socket.broadcast.emit('refresh', data);
    });

    socket.on('post', function (data) {
        data.author = socket.id;
        console.log(data.author + " is trying to post a message :");
        console.log(data.content);
        socket.broadcast.emit('post', data);
        let post = {
            id: save.messages[save.messages.length - 1].id + 1,
            content: data.content,
            author: data.author
        };
        save.messages.push(post);
        commit(save);
    });

    // socket.on('cam', function (stream) {
    //     console.log("Some user is trying to CAM");
    //     console.log(stream);
    //     // socket.emit('cam', data);
    // });

    socket.on('disconnect', function () {
        var i = all_Clients.indexOf(socket);

        all_Clients.splice(i, 1);

        console.log(socket.id + ' // Got disconnect!');
        // console.log("New connected users list : ");
        // console.log(all_Clients);
    });
});



// app.listen(webport, function (req, res) {
//     console.log('My server is up and running !');
// });  