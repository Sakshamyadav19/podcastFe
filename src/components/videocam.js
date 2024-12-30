import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../socketcontext";

const VideoStream = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const { socket, user } = useSocket();
    // console.log("Users-",users);

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
                
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };


        startVideo();

        socket.on("get-users", (roomUsers) => {
            console.log("Users in room:", roomUsers," ",socket.id);
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="w-full h-full flex">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-1/2 h-full object-cover"
            />
            {remoteStreams.map((remoteStream, index) => (
                <video
                    key={index}
                    ref={(el) => {
                        if (el) {
                            el.srcObject = remoteStream;
                        }
                    }}
                    autoPlay
                    playsInline
                    className="w-1/2 h-full object-cover"
                />
            ))}
        </div>
        <div className="absolute bottom-4 w-full text-center">
            <button
                onClick={stopVideo}
                className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
                Close Call
            </button>
        </div>
    </div>
    );
};

export default VideoStream;