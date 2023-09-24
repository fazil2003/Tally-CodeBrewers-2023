const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const Room = require("./models/roomModel");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

const port = process.env.PORT || 5000;

io.on("connect", (socket) => {
  socket.on("join", (data) => {
    if (data.roomID.length === 6) {
      socket.broadcast.emit("join", data);
    }
  });

  socket.on("present", (data) => {
    if (data.roomID.length === 6) {
      socket.broadcast.emit("present", data);
    }
  });

  socket.on("start", (data) => {
    if (data.roomID.length === 6) {
      socket.broadcast.emit("start", data);
    }
  });

  socket.on("progress", (data) => {
    if (data.roomID.length === 6) {
      socket.broadcast.emit("progress", data);
    }
  });

  socket.on("exitRoom", (data) => {
    if (data.roomID.length === 6) {
      Room.findOne({ roomID: data.roomID }).then((room) => {
        if (room && room.creator === data.username) {
          Room.deleteOne({ roomID: data.roomID }).then(() => {
            socket.broadcast.emit("close", data);
          });
        } else {
          socket.broadcast.emit("exitRoom", data);
        }
      });
    }
  });
});

const dbConnect = require("./config/dbConnect");

app.use(express.json());

app.use("/api/v1/login", require("./routes/loginRoute"));
app.use("/api/v1/register", require("./routes/registerRoute"));
app.use("/api/v1/practice", require("./routes/practiceRoute"));
app.use("/api/v1/private", require("./routes/privateRoute"));

app.use(errorHandler);

const start = async () => {
  try {
    await dbConnect();
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
