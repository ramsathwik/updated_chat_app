import messagehandler from "../utils/messagehandler";
import { useRef } from "react";
import { useSocketContext } from "../contexts/SocketContext";

function Messagebox() {
  const { sendMessage, showTyping } = useSocketContext();
  const msgRef = useRef();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        let msg = messagehandler(e, msgRef);
        if (msg.trim() !== "") {
          sendMessage(msg);
          msgRef.current.value = "";
        }
      }}
      className="flex items-center gap-2 bg-white p-3 border-t border-gray-300 shadow-inner"
    >
      <input
        type="text"
        placeholder="Type your message..."
        ref={msgRef}
        onChange={showTyping}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Send
      </button>
    </form>
  );
}

export default Messagebox;
