let onlineusers = [];
let Message = require("./models/message");
async function analyzeMessage(text) {
  try {
    const res = await fetch("http://127.0.0.1:8001/api/analyze/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    console.log("💬 Django Sentiment Response:", data);
    return data;
  } catch (error) {
    console.error("❌ Django API error:", error);
  }
}

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
      let Sentiment = await analyzeMessage(newmessage.text);
      console.log(newmessage);
      await newmessage.save();
      newmessage = { ...newmessage.toObject(), Sentiment };
      console.log(newmessage);
      const isExists = onlineusers.find((client) => client.id == to);
      if (isExists) {
        io.to(isExists.socketid).emit("privateMessage", newmessage);
      }
    });

    //typing status
    socket.on("showTyping", (msg) => {
      let { fromid, to } = msg;
      //io.to(to).emit("showTyping", { id: fromid, text: "typing..." });
    });
  });
}
module.exports = sockethandling;
