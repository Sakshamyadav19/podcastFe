import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../socketcontext";
import { PhoneOff } from "lucide-react";
import Button from "./ui/button";
import { Card, CardContent } from "./ui/card";

const VideoStream = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const { socket, user } = useSocket();
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {


        // Start video stream
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // users.forEach((userId) => {
                //     if (userId !== socket.id) {
                //         console.log(socket.id," ",users);
                //         console.log(`Calling user: ${userId}`);
                //         const call = user.call(userId, streamRef.current);
                //         call.on("stream", (remoteStream) => {
                //             console.log("Received remote stream from call:", remoteStream);
                //             setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
                //         });
                //     }
                // });

                // // Handle incoming calls
                // user.on("call", (call) => {
                //     console.log("Received call from:", call.peer);
                //     call.answer(streamRef.current); // Answer the call with our stream
                //     call.on("stream", (remoteStream) => {
                //         console.log("Received remote stream from incoming call:", remoteStream);
                //         setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
                //     });
                // });

            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };


        startVideo();

        socket.on("get-users", (roomUsers) => {
            console.log("Users in room:", roomUsers, " ", socket.id);
            roomUsers.forEach((userId) => {
                if (userId !== socket.id) {
                    console.log(`Calling user: ${userId}`);
                    const call = user.call(userId, streamRef.current);
                    call.on("stream", (remoteStream) => {
                        console.log("Received remote stream from call:", remoteStream);
                        setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
                    });
                }
            });
        });
        user.on("call", (call) => {
            console.log("Received call from:", call.peer);
            call.answer(streamRef.current); // Answer the call with our stream
            call.on("stream", (remoteStream) => {
                console.log("Received remote stream from incoming call:", remoteStream);
                setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
            });
        });

        // socket.on("user-joined", ({ userId }) => {
        //     const call=user.call(userId, streamRef.current);
        //     console.log("User called=", userId);
        //     call.on("stream", (remoteStream) => {
        //             console.log("Remote Stream1=",remoteStream);
        //             setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
        //             // videoRef.current.srcObject = remoteStream;
        //     });
        // });

        // user.on("call", (call) => {
        //     call.answer(streamRef.current);
        //     call.on("stream", (remoteStream) => {

        //             console.log("Remote Stream2=",remoteStream);
        //             setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
        //             // videoRef.current.srcObject = remoteStream;

        //     });
        // });


        // Cleanup when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);


    const stopVideo = () => {
        // Stop video tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Emit leave room event if socket is connected
        if (socket) {
            socket.emit('leave-room', { roomId });
        }

        // Navigate back to home
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col p-4">
            <header className="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    PodWise
                </h1>
                <Button variant="destructive" onClick={stopVideo} className="flex items-center">
                    <PhoneOff className="mr-2" /> End Call
                </Button>
            </header>
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="aspect-video bg-gray-800 flex items-center justify-center">
                    <CardContent className="text-white text-center mt-2">
                        {isVideoOff ? (
                            <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-4xl font-bold">
                                You
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover rounded-lg"
                                autoPlay
                                muted
                                playsInline
                            />
                        )}
                    </CardContent>
                </Card>
                {remoteStreams.map((remoteStream, index) => (
                   <Card key={index} className="aspect-video bg-gray-800 flex items-center justify-center">
                   <CardContent className="text-white text-center mt-2">
                     <video
                       ref={(el) => {
                         if (el) {
                           el.srcObject = remoteStream;
                         }
                       }}
                       className="w-full h-full object-cover rounded-lg"
                       autoPlay
                       playsInline
                     />
                   </CardContent>
                 </Card>
                ))}
            </main>
            
        </div>
    );
};

export default VideoStream;