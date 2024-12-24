import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected with ID:", newSocket.id);

            // Initialize PeerJS with socket.id
            const peer = new Peer(newSocket.id);

            peer.on("open", (id) => {
                console.log("Peer ID assigned:", id);
                setUser(peer); // Set the Peer instance once the ID is assigned
            });

            // Handle disconnection
            peer.on("disconnected", () => {
                console.log("Peer disconnected.");
            });

            // Clean up resources on unmount
            return () => {
                newSocket.disconnect();
                peer.disconnect();
            };
        });
    }, []);

    return (
        <SocketContext.Provider value={{ socket, user }}>
            {children}
        </SocketContext.Provider>
    );
};
