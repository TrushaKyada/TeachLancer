const http = require("http");
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();
const { Server } = require("socket.io");
const app = require("./src/app");

const port = process.env.PORT || 8000;

app.use(cors());
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`SETUP :- Server running at : ${port}`);
})

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
require("./src/webSocket/socket")(io);