import React, { useEffect, useState } from 'react';
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router';
import { useSocket } from '../socketcontext';
import { Mic, Headphones, Calendar, Clock } from 'lucide-react';
import Button from './ui/button';
import Input from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const Home = () => {
    const { socket, user } = useSocket();
    const [roomIdInput, setRoomIdInput] = useState("");
    const [roomError, setRoomError] = useState("");
    const navigate = useNavigate();

    const handleStartCall = () => {
        socket.emit("create-room", { userId: socket.id }, (roomId) => {
            navigate(`/home/${roomId}`);
        });
    };

    const handleJoinCall = (e) => {
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
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">PodWise</h1>
                <SignOutButton />
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1: Call Controls and Quick Record */}
                <Card className="col-span-1 bg-white shadow-md border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                            <Headphones className="mr-2 text-gray-600" /> Call Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* Start New Call Button */}
                        <Button onClick={handleStartCall} className="w-full bg-black text-white hover:bg-gray-800">
                            Start New Call
                        </Button>

                        {/* Room ID Input */}
                        <Input
                            type="text"
                            placeholder="Enter Room ID"
                            className="w-full border-gray-300"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                        />

                        {/* Join Call Button */}
                        <Button onClick={handleJoinCall} className="w-full bg-black text-white hover:bg-gray-800">
                            Join Call
                        </Button>
                    </CardContent>
                    {roomError && (
                        <div className="mt-4 text-red-500 text-sm">
                            {roomError}
                        </div>
                    )}
                </Card>

                <Card className="col-span-1 bg-white shadow-md border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                            <Mic className="mr-2 text-gray-600" /> Quick Record
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-black text-white hover:bg-gray-800">
                            Start Solo Recording
                        </Button>
                        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                            Quick record for ideas or solo segments
                        </p>
                    </CardContent>
                </Card>

                {/* Row 2: Upcoming Episodes and Recent Recordings */}
                <Card className="col-span-1 bg-white shadow-md border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="mr-2" /> Upcoming Episodes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center">
                                <span>Tech Talk #42</span>
                                <span className="text-sm text-gray-500">Tomorrow, 2 PM</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>Guest Interview: Jane Doe</span>
                                <span className="text-sm text-gray-500">Fri, 11 AM</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-white shadow-md border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="mr-2" /> Recent Recordings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center">
                                <span>Episode #41: AI Revolution</span>
                                <Button variant="link">Edit</Button>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>Quick Take: News Roundup</span>
                                <Button variant="link">Edit</Button>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </main>

        </div>
    );
};

export default Home;
