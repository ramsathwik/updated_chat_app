import Header from "./Header";
import { useSocketContext } from "../contexts/SocketContext";

function Chatbox() {
  const { messages, userRef } = useSocketContext();

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isOwnMessage = msg.from === userRef.current;
            return (
              <div
                key={index}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow-sm ${
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-700 border border-gray-200"
                  }`}
                >
                  <div className="text-sm">{msg.text}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-8">No messages yet</div>
        )}
      </div>
    </div>
  );
}

export default Chatbox;
