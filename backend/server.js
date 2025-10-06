//built-in modules
const express = require("express");
const app = express();
const cors = require("cors");
let mongoose = require("mongoose");
let { Server } = require("socket.io");
let server;
let dotenv = require("dotenv");
dotenv.config();

//Routers
let Authrouter = require("./routes/AuthRouter");
let Chatrouter = require("./routes/Chatrouter");

//built-in middlwares
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

//routes
app.use("/", Authrouter);
app.use("/", Chatrouter);

//custom
let sockethandling = require("./socket");

//server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("successfully connected to database");
    server = app.listen(3000, () => {
      console.log(`server is listening at http://localhost:3000`);
    });
    let io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    sockethandling(io);
  })
  .catch((err) => {
    console.log(err);
  });
