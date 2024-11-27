import React, { useEffect, useState } from 'react';
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import VideoStream from './videocam';

const Home = () => {
    const [socket, setSocket] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to signaling server");
            if (user) {
                newSocket.emit("join", { userId: user.id });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const handleStartCall = () => {
        setShowVideo(true);
    };

    const handleStopCall = () => {
        setShowVideo(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Seek</h1>
                    <SignOutButton />
                </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Podcast Studio</h2>
                    {!showVideo && (
                        <button
                            onClick={handleStartCall}
                            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            Start Call
                        </button>
                    )}
                </div>
                {showVideo && socket && <VideoStream socket={socket} userId={user.id} onStopCall={handleStopCall} />}
            </div>
        </div>
    );
};

export default Home;

