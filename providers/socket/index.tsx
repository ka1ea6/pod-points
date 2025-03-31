"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const defaultContext: SocketContextType = {
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
};

const SocketContext = createContext<SocketContextType>(defaultContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  const joinRoom = (room: string) => {
    if (socket && isConnected) {
      socket.emit("join-room", room);
    }
  };

  const leaveRoom = (room: string) => {
    if (socket && isConnected) {
      socket.emit("leave-room", room);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, joinRoom, leaveRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
