import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { NodeData } from "../types";

interface SocketContextProps {
  sendMessage: (msg: string) => void;
  messages: NodeData[];
  connectionStatus: "connected" | "disconnected" | "reconnecting";
}

const SocketContext = createContext<SocketContextProps>({
  sendMessage: () => {},
  messages: [],
  connectionStatus: "disconnected",
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  url: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  url,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<NodeData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("disconnected");

  // Reference for number of reconnect attempts
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 30;
  const reconnectInterval = 1000; // en millisecondes

  const hasConnectedRef = useRef(false);

  useEffect(() => {
    let ws: WebSocket;
    let timeout: number;

    // To avoid multiple connections
    if (hasConnectedRef.current) return;
    hasConnectedRef.current = true;

    const connect = () => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("✅ Connected to the WebSocket");
        reconnectAttemptsRef.current = 0;
        setConnectionStatus("connected");

        // Subscribe to "table_data" topic
        const subscribeMessage = JSON.stringify({
          action: "subscribe",
          topic: "table_data",
        });
        ws.send(subscribeMessage);
      };

      ws.onmessage = (event: MessageEvent) => {
        const rawMessage = event.data.toString();
        // console.log("Raw message received:", rawMessage);
        try {
          const jsonData = JSON.parse(rawMessage);
          if (jsonData.topic === "table_data") {
            // to be modified later
            setMessages((prev) => [...prev, jsonData.message]);
            // console.log("data :", jsonData.message);
          } else {
            // to be modified later
            setMessages((prev) => [...prev, rawMessage]);
          }
        } catch (error) {
          console.error("Error parsing JSON message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("🚪 WebSocket is closed");
        setConnectionStatus("disconnected");
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(
            `Attempting to reconnect in ${
              reconnectInterval / 1000
            } seconds... (Attempt ${
              reconnectAttemptsRef.current
            }/${maxReconnectAttempts})`
          );
          setConnectionStatus("reconnecting");
          timeout = window.setTimeout(connect, reconnectInterval);
        } else {
          console.error("Maximum reconnection attempts reached.");
        }
      };

      setSocket(ws);
    };

    connect();

    return () => {
      if (timeout) clearTimeout(timeout);
      if (ws) ws.close();
    };
  }, [url]);

  const sendMessage = (msg: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <SocketContext.Provider value={{ sendMessage, messages, connectionStatus }}>
      {children}
    </SocketContext.Provider>
  );
};
