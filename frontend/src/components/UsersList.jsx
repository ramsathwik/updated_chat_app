import { useState } from "react";
import { useSocketContext } from "../contexts/SocketContext";

function UsersList() {
  const { users, setSelectedUser, renderMessages, unread, selectedUser } =
    useSocketContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((client) => (
            <div
              key={client.id}
              onClick={() => {
                renderMessages(client.id);
                setSelectedUser(client.username);
              }}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-blue-100 transition duration-200 ${
                selectedUser === client.username ? "bg-blue-100" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div>
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {client.username.charAt(0).toUpperCase()}
                  </div>
                  {/* Username */}
                  <div className="text-blue-700 font-medium">
                    {client.username}
                  </div>
                </div>
                <div>{client.online ? <p>online</p> : <p>offline</p>}</div>
              </div>

              {/* Unread count */}
              {unread[client.id] ? (
                <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {unread[client.id]}
                </span>
              ) : null}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
}

export default UsersList;
