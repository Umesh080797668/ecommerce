'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
    
    const socketIO = io(socketUrl, {
      transports: ['websocket'],
    });

    socketIO.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Connected to Socket.IO server');
    });

    socketIO.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Disconnected from Socket.IO server');
    });

    setSocket(socketIO);

    return () => {
      socketIO.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};