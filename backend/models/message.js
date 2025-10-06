const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  delivered: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});
messageSchema.index({ to: 1, delivered: 1 });
messageSchema.index({ from: 1, to: 1 });
let Message = mongoose.model("Message", messageSchema);
module.exports = Message;
