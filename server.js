let all_Clients = [];
let webport = 8080;

let datas;
let json = require('./json/save.json');
var { commit, elsee } = require('./utils/utils.js');

let express = require('express');
let socket = require('socket.io');
let bodyparser = require('body-parser');

let app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));

let server = app.listen(webport);
let io = socket(server);

app.get('/', (req, res) => {
    console.log(`Someone is trying to connect on the server`);
    res.render('index');
});

io.on('post_msg', function () {
    console.log('Some user is trying to post a message');
});

// io.on('register_user', function(){
//     console.log('Some user is trying to register');
// });

// io.on('connect_user', function(){
//     console.log('Some user is trying to connect');
// });

io.on('connection', (socket) => {
    all_Clients.push(socket);
    console.log("New client connection : " + socket.id);

    socket.on('post', function (data) {
        data.author = socket.id;
        console.log(data.author + " is trying to post a message :");
        console.log(data.content);
        socket.broadcast.emit('post', data);
    });

    // socket.on('cam', function (stream) {
    //     console.log("Some user is trying to CAM");
    //     console.log(stream);
    //     // socket.emit('cam', data);
    // });

    socket.on('disconnect', function () {
        console.log(socket.id + ' // Got disconnect!');
        var i = all_Clients.indexOf(socket);

        all_Clients.splice(i, 1);
        // console.log("New connected users list : ");
        // console.log(all_Clients);
    });
});



// app.listen(webport, function (req, res) {
//     console.log('My server is up and running !');
// });  