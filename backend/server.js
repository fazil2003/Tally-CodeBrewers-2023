const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

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
    socket.broadcast.emit("join", data);
  });

  socket.on("present", (data) => {
    socket.broadcast.emit("present", data);
  });

  socket.on("start", (data) => {
    socket.broadcast.emit("start", data);
  });

  socket.on("progress", (data) => {
    socket.broadcast.emit("progress", data);
  });

  // socket.on("disconnect", () => {
  //   console.log("Disconnected");
  // });
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
