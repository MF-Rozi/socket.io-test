const express = require('express');
const app = express();

const socket = require('socket.io');
const cors = require('cors');

const server =  app.listen(5500, () => {
    console.log('Server is Running at Port 5500 \n');
});

app.set('view engine', 'ejs');
app.set('views', '.\views');

app.use(cors({
    origin: '*'
}));
app.use(express.static('public'));

var io = socket(server);

io.on("connection", (socket) => {
    console.log("User Connected: " + socket.id);
    io.emit("newConnection", socket);

    socket.on("eventCreated", () => {
        console.log("User " + socket.id + " Hit the Server");
        var text = "Server Hit " + socket.id + " Back";
        io.emit("hitResponse", text);
    });
    socket.on("sendMessage", (text,data) => {
        console.log("User " + socket.id + " Sended " + data);
        console.log("text = " + text);
        io.emit("newMessage", data);
    });

    socket.on("disconnect", (socket) => {
        console.log("User Disconnected:  " + socket.id);
        text = socket.id + " Has been Disconencted";
        io.emit("disconnected", text)
    });
    socket.on("reconnect", (socket,number) => {
        console.log.apply("User Reconnected : " + socket.id+" "+number+"Times");
    });
});