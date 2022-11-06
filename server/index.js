const express = require("express");
const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//New imports
const http = require("http").Server(app);
const cors = require("cors");
app.use(cors());

let eventList = [];
//New imports
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("newEvent", (event) => {
        eventList.unshift(event);
        //sends the events back to the React app
        socket.emit("sendSchedules", eventList);
    });

    /*
    The code snippet loops through the event list 
    and checks if it's time for any event 
    before sending a message containing 
    the event details to the React app
    */
    let interval = setInterval(function () {
        if (eventList.length > 0) {
            for (let i = 0; i < eventList.length; i++) {
                console.log(eventList[i].hour);
                console.log(new Date().getHours());
                if (
                    Number(eventList[i].hour) === new Date().getHours() &&
                    Number(eventList[i].minute) === new Date().getMinutes() &&
                    new Date().getSeconds() === 0
                ) {
                    socket.emit("notification", {
                        title: eventList[i].title,
                        hour: eventList[i].hour,
                        mins: eventList[i].minute,
                    });
                }
            }
        }
    }, 1000);

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        socket.disconnect();
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});