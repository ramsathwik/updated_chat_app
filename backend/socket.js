let onlineusers = [];
let Message = require("./models/message");

function sockethandling(io) {
  io.on("connection", (socket) => {
    let currentuser = null;

    socket.on("setuser", (user) => {
      currentuser = user;

      // only add if not already present
      let exists = onlineusers.find((u) => u.id === user);
      if (!exists) {
        onlineusers.push({ id: user, socketid: socket.id });
      } else {
        // just update socket id (refresh case)
        exists.socketid = socket.id;
      }

      console.log("online:", onlineusers);
      io.emit("onlineusers", onlineusers);
    });
    //disconnect
    socket.on("disconnect", (reason, details) => {
      console.log(reason, details);
      if (currentuser) {
        // remove only if that user has no active socket anymore
        onlineusers = onlineusers.filter((u) => u.id !== currentuser);
        console.log("from disconnect", onlineusers);
        io.emit("onlineusers", onlineusers);
      }
    });

    //private message
    socket.on("privateMessage", async (msg) => {
      let { from, to, text } = msg;
      let newmessage = new Message({ from, to, text });
      await newmessage.save();
      const isExists = onlineusers.find((client) => client.id == to);
      if (isExists) {
        io.to(isExists.socketid).emit("privateMessage", newmessage);
      }
    });

    //typing status
    socket.on("showTyping", (msg) => {
      let { fromid, to } = msg;
      console.log(msg);
      //io.to(to).emit("showTyping", { id: fromid, text: "typing..." });
    });
  });
}
module.exports = sockethandling;
