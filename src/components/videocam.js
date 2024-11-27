import React, { useEffect, useRef } from "react";

const VideoStream = ({ onStopCall }) => {
    const videoRef = useRef(null);
    let streamRef = useRef(null);

    useEffect(() => {
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

        // Cleanup when the component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const stopVideo = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        onStopCall(); // Notify parent to hide video
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-3/4 max-w-screen-md rounded-lg shadow-lg border border-gray-300"
            ></video>
            <button
                onClick={stopVideo}
                className="mt-4 bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
                Close Call
            </button>
        </div>
    );
};

export default VideoStream;
