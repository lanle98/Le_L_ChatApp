var express = require("express");
var app = express();

// import the socket.io library
const io = require("socket.io")(); // instantiate the library right away with the () method

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/login.html");
// });



const server = app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

// this is all of our socket.io messaging functionality

//attach socket.io
io.attach(server);
io.on("connection", function (socket) {
  console.log("user connected");
  socket.emit("connected", { sID: `${socket.id}`, message: "new connection" });
  io.emit("user_connected", `${socket.id} has joined the chat`);
  //listen for an incoming message from a user (socket refers to an individual user)
  socket.on("chat_message", function (msg) {
    console.log(this);

    //when we get a new message, send it to everyone so they can see it
    // io is the
    io.emit("new_message", {
      id: socket.id,
      message: msg
    });
  });


  // listen for a disconnect event
  socket.on("disconnect", function () {
    console.log("a user disconnected");

    message = `${socket.id} has left the chat`;
    io.emit("user_disconnect", message);
  });
});
