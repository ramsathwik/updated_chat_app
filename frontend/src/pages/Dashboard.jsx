import UsersList from "../components/UsersList";
import Chatbox from "../components/Chatbox";
import Messagebox from "../components/Messagebox";
import { useSocketContext } from "../contexts/SocketContext";
import { useEffect } from "react";

function Dashboard() {
  const socketData = useSocketContext();

  if (!socketData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-600">
        <p className="text-lg">Loading chat...</p>
      </div>
    );
  }

  const { selectedUser, setUsers } = socketData;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-lg border-r border-gray-200 h-64 md:h-auto">
        <UsersList />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto bg-white shadow-inner p-4">
              <Chatbox />
            </div>
            <div className="border-t border-gray-300 bg-white p-4 shadow-inner">
              <Messagebox />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-blue-600 text-xl font-semibold">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
