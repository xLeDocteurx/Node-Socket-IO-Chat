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
    // socket.on('refresh_userslist', refresh_users);

    // socket.emit('refresh_userslist', userlist);
    // refresh_users();

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
            author: "Undetected",
            content: content.value
        };
        content.value = "";
        // console.log(content);
        // console.log(data.author + " is trying to post a message :");
        // console.log(data.content);
        socket.emit('post', data);
        let msg = new Message(data.author, data.content, true);
        document.getElementById("messages_container").innerHTML += msg.html;
        autoScroll();
    }
}

function receve_message(data) {
    console.log(data.author + " posted a message :");
    console.log(data.content);
    let msg = new Message(data.author, data.content, false);
    let container = document.getElementById("messages_container");
    container.innerHTML += msg.html;
    autoScroll();
}

function autoScroll() {
    // let container = document.getElementById("messages_container");
    // document.body.scrollTop = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
}

// function windowResized() {
//     let chat_window = document.getElementById("chat_window");
//     // chat_window.style.maxHeight = windowHeight;
//     chat_window.style.height = windowHeight;
// }

firebase.auth().onAuthStateChanged(function (user) {
    let logged = document.getElementById('logged-button');
    let loggin = document.getElementById('loggin-button');
    let logginp = document.getElementById('loggin-page');
    let footer_input = document.getElementById('content_input');
    let footer_button = document.getElementById('content_button');
    
    if (user) {
        console.log("// User is signed in.");
        logged.style.display = "initial";
        footer_input.style.display = "initial";
        footer_button.style.display = "initial";
        loggin.style.display = "none";
        logginp.style.display = "none";
    } else {
        logged.style.display = "none";        
        footer_input.style.display = "none";
        footer_button.style.display = "none";
        loggin.style.display = "initial";        
        logginp.style.display = "initial";
        console.log("!! User is NOT signed in.");
    }
});

function login() {

    // alert("trying to log in");
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');

    console.log(`Ùser is trying to connect with email : ${email} and password : ${password}`);


}

function refresh_users() {

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
    constructor(author, content, isMine) {
        let align = '';
        if (isMine == false) {
            align = 'ml-auto';
        }
        let img = `<img class="avatar ${align} m-2" src="img/000.jpg" alt="Generic placeholder image">`;
        let msg = `<div class="mt-0 w-90 pb-1 media-body">
                        <h5>${author} : </h5>
                        ${content}
                    </div>`;

        this.html = `<li class="media w-100 p-1">
                        ${img}
                        ${msg}
                    </li>`;
    }
}