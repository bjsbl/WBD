var http = require("http")
    , express = require("express")
    , bodyParser = require("body-parser")
    , app = express()
    , server = http.createServer(app)
    , io = require("socket.io").listen(server)
    , SERVER_PORT = process.env["PORT"] || 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

server.listen(parseInt(SERVER_PORT));

io.sockets.on("connection", function (socket) {
    socket.on("draw", function (info) {
        socket.broadcast.emit("draw", info);
    });

    socket.on("reset", function () {
        socket.broadcast.emit("reset");
    });
});
