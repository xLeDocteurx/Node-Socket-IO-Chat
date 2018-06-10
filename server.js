let express = require('express');
let socket = require('socket.io');
let bodyparser = require('body-parser');
let fs = require('fs');
var moment = require('moment');

// moment().format();



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
    res.render('index', { datas: save, users: all_Clients });
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
    all_Clients.push({ sockid: socket.id, email: "" });
    /////////////////////////////////////////////////////////////////////
    //                                                                 //
    /////////////////////////////////////////////////////////////////////

    // socket.emit('refresh_userslist', all_Clients);
    console.log("New client connection : " + socket.id);

    socket.on('refresh', function () {
        // data.clients = all_Clients;
        // data = all_Clients;
        // console.log("refresh is asked to the serveur. request is prepared to be sent to all clients");
        let data = {
            clients : all_Clients,
            save : save
        };
        io.sockets.emit('refresh', data);
    });

    socket.on('adduser', function (data) {

        var i = all_Clients.indexOf(all_Clients.find(element => {
            return element.sockid == socket.id;
        }));
        all_Clients[i].email = data;
        console.log("pushed datas to all_Clients :");
        console.log(data);
        console.log("=== TO ==>");
        console.log(all_Clients);

        addanuser();
    });

    socket.on('subuser', function (data) {

        subanuser(socket);
    });

    socket.on('register', function (data) {

        let user = {
            id: save.users[save.users.length - 1].id + 1,
            email: data.email,
            username: data.username,
            avatar: "001.jpg"
        };
        save.users.push(user);
        commit(save);

    });

    socket.on('post', function (data) {

        var i = save.users.find(element => {
            return element.email == data.author;
        });
        data.author = i.username;

        data.time = moment().format('LLLL');
        // console.log(data.author + " is trying to post a message :");
        // console.log(data.content);
        io.sockets.emit('post', data);
        let post = {
            id: save.messages[save.messages.length - 1].id + 1,
            content: data.content,
            author: data.author,
            time: data.time
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
        subanuser(socket);

        console.log(socket.id + ' // Got disconnect!');
        // console.log("New connected users list : ");
        // console.log(all_Clients);
    });
});

// function addanuser(data) {
function addanuser() {

    io.sockets.emit('refresh', all_Clients);
}

function subanuser(data) {

    console.log("substracted datas from all_Clients :");
    var i = all_Clients.indexOf(data.id);

    all_Clients.splice(i, 1);
    console.log("substracted datas from all_Clients :");
    console.log(all_Clients);
    io.sockets.emit('refresh', all_Clients);
}

// app.listen(webport, function (req, res) {
//     console.log('My server is up and running !');
// });  