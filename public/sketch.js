let socket;
let capture;

let isStreaming;
let xstream;

// let userlist = {
//     clients : []
// };

function setup() {
    socket = io.connect();
    socket.on('post', receve_message);
    socket.on('refresh', refresh_users);

    // createCanvas(390, 240);
    // capture = createCapture(VIDEO, function (stream) {
    //     isStreaming = true;
    //     xstream = stream;
    // });
    // capture.size(160, 120);
    // capture.parent("users_window");



    //    <video id="vid" autoplay></video>

    // navigator.mediaDevices.getUserMedia({
    //     video: true
    // }).then(stream => {
    //     let vid = document.getElementById("vid");
    //     vid.srcObject = stream;
    //     vid.style.width = "200px";
    //     socket.emit('cam', stream);
    // });
    noCanvas();

}

function draw() {

    // let data = {
    //     // id : ,
    //     author: "Undetected",
    //     content: capture
    // };
    // background(255);
    // image(capture, 0, 0, 320, 240);
    // if (isStreaming) {
    //     socket.emit('cam', xstream);        
    // }
}

function post_message() {
    let content = document.getElementById("content_input");
    if (content.value != "") {
        let data = {
            // id : ,
            author: localStorage.getItem('user_email'),
            content: content.value,
            time: ""
        };
        content.value = "";

        socket.emit('post', data);
        // let msg = new Message(data.author, data.content, true);
        // document.getElementById("messages_container").innerHTML += msg.html;
        autoScroll();
    }
}

function receve_message(data) {
    console.log(data.author + " posted a message :");
    console.log(data.content);
    let msg = new Message(data.author, data.content, false, data.time);
    let container = document.getElementById("messages_container");
    container.innerHTML += msg.html;
    autoScroll();
}

function autoScroll() {
    // let container = document.getElementById("messages_container");
    // document.body.scrollTop = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
}

firebase.auth().onAuthStateChanged(function (user) {
    let logged = document.getElementById('logged-button');
    let loggin = document.getElementById('loggin-button');
    let newuser = document.getElementById('newuser-button');
    // let logginp = document.getElementById('loggin-page');
    let footer_input = document.getElementById('content_input');
    let footer_button = document.getElementById('content_button');

    if (user) {
        loggin.style.display = "none";
        newuser.style.display = "none";
        // logginp.style.display = "none";
        logged.style.display = "initial";
        footer_input.style.display = "initial";
        footer_button.style.display = "initial";
        console.log("// User is signed in.");
        console.log(user.email);

        document.getElementById('userpage').innerText = user.email;

        socket.emit('adduser', user.email);
        socket.emit('refresh');

        localStorage.setItem('user_email', user.email);

    } else {
        loggin.style.display = "initial";
        newuser.style.display = "initial";
        // logginp.style.display = "initial";
        logged.style.display = "none";
        footer_input.style.display = "none";
        footer_button.style.display = "none";
        console.log("!! User is NOT signed in.");
    }
});

function login() {


    // alert("trying to log in");
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    // alert(`User is trying to connect with email : ${email} and password : ${password}`);


    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        console.log("authentification is a success");
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log("error : " + error.message);
    });
}

function logout() {

    firebase.auth().signOut().catch(function (error) {
        console.log("signing out is a FAILURE !");
    });

    socket.emit('subuser');
    console.log("signing out is a success !");

    localStorage.removeItem('user_email');
    
}

function register() {

    let email = document.getElementById('newuserEmail').value;
    let password = document.getElementById('newuserPassword').value;
    let username = document.getElementById('newUsername').value;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log("error : " + error.message);
    });

    let user = {
        email : email,
        username : username
    };

    socket.emit('register', user);
}

function refresh_users(data) {

    console.log('is refreshing');
    console.log(data);
    let container = document.getElementById('users_window');
    container.innerHTML = "";
    data.clients.forEach((client, index) => {
        console.log(client);
        let child = document.createElement("p");

        var i = data.save.users.indexOf(data.save.users.find(element => {
            return element.email == client.email;
        }));

        console.log(data.save.users[i].username);
        child.innerHTML = `<img class="userlist-img rounded-circle mr-1" src="img/000.jpg" alt="User Avatar">
                            ${data.save.users[i].username}`;
        container.appendChild(child);
    });
}

// function refresh_users(data) {
//     console.log('is refreshing');
//     console.log(data);
//     let container = document.getElementById('users_window');
//     data.clients.forEach((element, index) => {
//         let child = document.createElement("p");
//         child.innerHTML = element;
//         container.appendChild(child);
//     });
// }

class Message {
    constructor(author, content, isMine, time) {
        let align = '';
        if (isMine == false) {
            align = 'ml-auto';
        }
        let img = `<img class="avatar ${align} m-2" src="img/000.jpg" alt="Generic placeholder image">`;
        let msg = `<div class="mt-0 w-90 pb-1 media-body">
                        <h5>${author} // <small>${time}</small> : </h5>
                        ${content}
                    </div>`;

        this.html = `<li class="media w-100 p-1">
                        ${img}
                        ${msg}
                    </li>`;
    }
}