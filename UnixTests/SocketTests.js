const SocketClient = require("socket.io-client");

const socket = SocketClient("http://localhost:3000");

function TestsSocketEventListenerClass(){
 socket.emit("TEST"); 
}

TestsSocketEventListenerClass();