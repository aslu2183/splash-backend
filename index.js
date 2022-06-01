const express = require('express');
const app     = express();
const http   = require('http');
const server = http.createServer(app);
const { Server }    = require("socket.io");

const io     = new Server(server,{
    cors : {
        origin : "http://localhost:3005"
    }
}); 

app.get("/", function(req, res){
    res.send("Welcome")
})


let rendered = 0
let timer    = null

io.on('connection',(socket) => {
    console.log("Connection Estabilished Time ",new Date())
    console.log("Connection Established on Server with Connect ID ", socket.id);

    socket.on('disconnect',() => {
        console.log("Disconnected Time ",new Date())
        console.log("Socket Connection Disconnected By Client")
        rendered = 0
        clearInterval(timer)
    })

    socket.on('initialize-data',(arg) => {
        timer = setInterval(updateCounter,2000)
        rendered = 0
        
    })

    socket.on('stop-interval',(arg) => {
        console.log("Clear interval request from client")
        rendered = 0
        clearInterval(timer);
    })

    
})


function updateCounter(){
    console.log("Data emitted at ",new Date())
    //if(rendered <= 10){
        io.emit('receive-data',Math.floor((Math.random() * 100)));
        rendered++
   // }
    //else{
    //    clearInterval(timer);
        //console.log("timer Cleared")
    //}    
}




server.listen(4020,() => {
    console.log("Node jS Server connected at port 4020")
})