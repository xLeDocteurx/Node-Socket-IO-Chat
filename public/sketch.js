let socket;
let capture;

let isStreaming;
let xstream;



function setup() {
    socket = io.connect();
    socket.on('post', receve_message);
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
    }
}

function receve_message(data) {
    console.log(data.author + " posted a message :");
    console.log(data.content);
    let msg = new Message(data.author, data.content, false);
    document.getElementById("messages_container").innerHTML += msg.html;
}

class Message {
    constructor(author, content, isMine) {
        let align = '';
        if (isMine == false) {
            align = 'ml-auto';
        }
        let img = `<img class="avatar ${align} m-2" src="img/000.jpg" alt="Generic placeholder image">`;
        let msg = `<div class="mt-0 w-90 pb-1 class="media-body">
                        <h5>${author}</h5>
                        ${content}
                    </div>`;
        if (isMine == true) {
            this.html = `<li class="media w-100 p-1">
                            ${img}
                            ${msg}
                        </li>`;
        } else {
            this.html = `<li class="media w-100 p-1">          
                            ${msg}
                            ${img}                            
                        </li>`;
        }
    }
}