import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../socketcontext";

const VideoStream = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const {socket,user} = useSocket();

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

        // Cleanup when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [roomId, user]);

    

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
            <div className="w-full max-w-2xl px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto"
                    />
                    <div className="p-4 text-center">
                        <button
                            onClick={stopVideo}
                            className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                        >
                            Close Call
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Room ID: {roomId}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoStream;