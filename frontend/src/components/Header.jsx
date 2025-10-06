import { useSocketContext } from "../contexts/SocketContext";

function Header() {
  const { selectedUser, typingstatus, selectedUserRef } = useSocketContext();

  return (
    <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
      <div className="text-blue-700 font-semibold text-lg">
        {selectedUser || "Select a user"}
      </div>
      {typingstatus && typingstatus === selectedUserRef.current && (
        <div className="text-sm text-gray-500 italic">typing...</div>
      )}
    </div>
  );
}

export default Header;
