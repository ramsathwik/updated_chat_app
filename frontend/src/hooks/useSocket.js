import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../config/apiconfix";

function useSocket() {
  const chatsRef = useRef({ public: [] });
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]); // Ref for latest users
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingstatus, setTypingStatus] = useState(null);
  const selectedUserRef = useRef();
  const socketRef = useRef();
  const userRef = useRef();
  const typingTimeoutRef = useRef();
  const [unread, setUnread] = useState({ public: 0 });
  console.log(messages);

  // Helper function to update both state and ref
  function updateUsers(newUsers) {
    usersRef.current = newUsers;
    setUsers(newUsers);
  }

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      // Decode JWT and set userRef
      let token = localStorage.getItem("token");
      try {
        const payload = jwtDecode(token);
        userRef.current = payload ? payload.id : "Guest";
      } catch (e) {
        userRef.current = "Guest";
        console.error("Invalid or missing JWT token", e);
      }

      let unreadresponse = await fetch(`${API_URL}/unread/${userRef.current}`);
      let messages = await unreadresponse.json();
      let unreadmessages = messages.reduce((acc, curr) => {
        acc[curr._id] = curr.unreadCount;
        return acc;
      }, {});
      let allmessages = await fetch(`${API_URL}/messages/${userRef.current}`);
      let msgs = await allmessages.json();
      chatsRef.current = msgs;

      setUnread((prev) => ({ ...prev, ...unreadmessages }));

      // Fetch users and update state/ref
      let response = await fetch(`${API_URL}/dashboard`);
      let usersData = await response.json();
      let filteredUsers = usersData
        .map((client) => ({
          id: client._id,
          username: client.name,
          online: false,
        }))
        .filter((user) => user.id !== userRef.current);

      if (isMounted) {
        updateUsers(filteredUsers);

        // Now, only after users are fetched, connect to socket
        const socket = io("http://localhost:3000");
        socketRef.current = socket;

        function handlePrivateMessage(msg) {
          if (msg.from == userRef.current) {
            return;
          }
          console.log("from handle private msgs");
          // if (!chatsRef.current[msg.id]) {
          //   chatsRef.current[msg.id] = [];
          //   setUnread((prevUnread) => ({ ...prevUnread, [msg.id]: 0 }));
          // }
          // chatsRef.current[msg.id].push(msg);
          // if (selectedUserRef.current === msg.id) {
          //   setMessages([...chatsRef.current[msg.id]]);
          // } else {
          //   setUnread((prevUnread) => ({
          //     ...prevUnread,
          //     [msg.id]: (prevUnread[msg.id] || 0) + 1,
          //   }));
          // }
          let id = userRef.current == msg.from ? msg.to : msg.from;
          if (chatsRef.current[id] == undefined) {
            chatsRef.current[id] = [];
          }
          if (selectedUserRef.current !== id) {
            setUnread((prevread) => ({
              ...prevread,
              [id]: (prevread[id] || 0) + 1,
            }));

            chatsRef.current[id].push(msg);
          } else {
            chatsRef.current[selectedUserRef.current].push(msg);
            setMessages((prev) => [...prev, msg]);
          }
        }
        function handleOnlineUsers(userList) {
          const filtered = userList.filter(
            (client) => client.id !== userRef.current
          );
          updateUsers(
            usersRef.current.map((client) => ({
              ...client,
              online: filtered.some((user) => user.id === client.id),
            }))
          );
          let current = filtered.find(
            (client) => client.id === selectedUserRef.current
          );
          if (!current) {
            setMessages([]);
            selectedUserRef.current = null;
            setSelectedUser(null);
          }
        }
        function typinghandler(msg) {
          setTypingStatus(msg.id);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setTypingStatus(null);
            typingTimeoutRef.current = null;
          }, 1000);
        }

        // Attach listeners
        socket.on("privateMessage", handlePrivateMessage);
        socket.on("onlineusers", handleOnlineUsers);
        socket.on("showTyping", typinghandler);

        // Emit user presence
        socket.emit("setuser", userRef.current);

        // Cleanup event listeners and socket connection
        return () => {
          socket.off("privateMessage", handlePrivateMessage);
          socket.off("onlineusers", handleOnlineUsers);
          socket.disconnect();
          isMounted = false;
        };
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let count = Object.values(unread).reduce((a, b) => a + b, 0);
    document.title = `${count > 0 ? `New Messages(${count})` : "Vite + React"}`;
  }, [unread]);

  async function renderMessages(userid) {
    // console.log();
    // let response = await fetch(`${API_URL}/chat/${userRef.current}/${userid}`);
    // let message = await response.json();
    setMessages(chatsRef.current[userid] || []);
    selectedUserRef.current = userid;
    setUnread((prevUnread) => ({
      ...prevUnread,
      [userid]: 0,
    }));
  }

  function sendMessage(msg) {
    console.log("from send message");
    socketRef.current.emit("privateMessage", {
      from: userRef.current,
      to: selectedUserRef.current,
      text: msg,
    });

    // 👇 Add message to local state immediately for sender
    const newMsg = {
      from: userRef.current,
      to: selectedUserRef.current,
      text: msg,
      timestamp: new Date().toISOString(),
    };
    if (chatsRef.current[selectedUserRef.current] == undefined) {
      chatsRef.current[selectedUserRef.current] = [];
    }

    chatsRef.current[selectedUserRef.current].push(newMsg);
    setMessages([...chatsRef.current[selectedUserRef.current]] || []);
  }

  function showTyping() {
    socketRef.current.emit("showTyping", {
      fromid: userRef.current,
      to: selectedUserRef.current,
    });
  }

  return {
    users,
    setUsers: updateUsers,
    messages,
    setSelectedUser,
    sendMessage,
    renderMessages,
    selectedUser,
    showTyping,
    typingstatus,
    selectedUserRef,
    unread,
    userRef,
    usersRef,
  };
}

export default useSocket;
