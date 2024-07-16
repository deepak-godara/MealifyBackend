const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const addHotelRoute = require("./routes/Hotel");
const clientRoute = require("./routes/client");
const ownerRoute = require("./routes/owner");
const homeRoute = require("./routes/Home");
const CartRoute = require("./routes/Cart");
const SocketFunction = require("./utils/Sockets").SocketFunction; // Import the SocketFunction
const JoinFunction =require("./utils/Join").SocketJoin;
const AddOrder=require("./utils/NewOrder").AddOrder
const OrderConfirmation=require("./utils/OrderConfirmation").OrderConfirm
const Initiate=require("./utils/DataStructures").Initiate
const app = express();

// Middleware for parsing JSON data
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(
    "mongodb+srv://DeepakGodara:DeepakGodara@cluster1.babvun5.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("Connected to MongoDB");
    server.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  SocketFunction(socket, io); 
  JoinFunction(socket,io);
  AddOrder(socket,io);
  OrderConfirmation(socket,io);
  Initiate()
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(homeRoute);
app.use(addHotelRoute);
app.use(clientRoute);
app.use(ownerRoute);
app.use(CartRoute);
module.exports={io};
