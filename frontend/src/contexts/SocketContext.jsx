import { createContext, useContext } from "react";
import useSocket from "../hooks/useSocket";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketData = useSocket();
  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
}
export function useSocketContext() {
  return useContext(SocketContext);
}
