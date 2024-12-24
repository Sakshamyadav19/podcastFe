import React, { useEffect, useState } from 'react';
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router';
import { useSocket } from '../socketcontext';

const Home = () => {
    const {socket,user} = useSocket();
    const [roomIdInput, setRoomIdInput] = useState("");
    const [roomError, setRoomError] = useState("");
    const navigate = useNavigate();

    const handleStartCall = () => {
        console.log(socket.id,user._id)
        socket.emit("create-room",{ userId: socket.id }, (roomId) => {
            console.log(`Room created with ID: ${roomId}`);
            navigate(`/home/${roomId}`);
        });
    };

    const handleJoinCall = (e) => {
        console.log(user)
        e.preventDefault();
        socket.emit('join-room', { roomId: roomIdInput }, (response) => {
            if (response.success) {
                console.log(`User joined room ${response.roomId}`);
                navigate(`/home/${response.roomId}`);
            } else {
                console.log(response.message);
                setRoomError(response.message);
            }
        });
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
                    {/* Start Call Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleStartCall}
                            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            Start Call
                        </button>
                    </div>
                    {/* Join Call Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Join an Existing Call</h3>
                        <form onSubmit={handleJoinCall} className="flex flex-col space-y-4">
                            <input
                                type="text"
                                placeholder="Enter Room ID"
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInput(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                            >
                                Join Call
                            </button>
                        </form>
                        {/* Show error message if room doesn't exist */}
                        {roomError && (
                            <div className="mt-4 text-red-500 text-sm">
                                {roomError}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
