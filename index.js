require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoutes");
const messageRoute = require("./Routes/messageRoutes");
const app = express();
const port = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Configure and connect to MongoDB
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(express.static("public"));
app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

// Serve HTML pages
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

// Socket.IO implementation
io.on("connection", (socket) => {
  console.log("Socket connected");

  socket.emit("user connected"); // Emit an event to the connected client

  socket.on("message", (msg) => {
    io.emit("message", msg); // Broadcast the message to all connected clients
  });
});

http.listen(port, () => {
  console.log("Server is running on port", port);
});


