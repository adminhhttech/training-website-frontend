import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ModeToggle from "../components/ModeToggle";
import { toast } from "@/hooks/use-toast";

function PersonalAssistant() {
    const [topic, setTopic] = useState("");
    const [mode, setMode] = useState("crisp");
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [progressText, setProgressText] = useState("Analyzing topic...");
    const [showReplay, setShowReplay] = useState(false);

    const videoRef = useRef(null);

    const steps = [
        "Analyzing topic...",
        "Generating content...",
        "Adding voice...",
        "Exporting video..."
    ];

    useEffect(() => {
        if (showOverlay && !videoUrl) {
            // Start with the first message
            setProgressText(steps[0]);

            // Schedule transitions for the first 3 steps
            const timers = [
                setTimeout(() => setProgressText(steps[1]), 10000), // after 10s
                setTimeout(() => setProgressText(steps[2]), 20000), // after 20s
                setTimeout(() => setProgressText(steps[3]), 30000), // after 30s
            ];

            // Clear timeouts if overlay closes early or video arrives
            return () => timers.forEach((t) => clearTimeout(t));
        }
    }, [showOverlay, videoUrl]);

    const generateVideo = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setShowOverlay(true);
        setVideoUrl("");
        setShowReplay(false);
        setProgressText(steps[0]);

        try
        {
            const response = await fetch('https://hht-training-backend.space/personal-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    mode
                })
            })


            const result = await response.json()

            console.log('Video generation response:', result);

            if (result.status === 'success')
            {
                const videoUrl = `https://hht-training-backend.space${result.video_url}`
                console.log('Setting video URL:', videoUrl);
                setVideoUrl(videoUrl)

                toast({
                    title: "Video Generated!",
                    description: "Your video explanation is ready to watch.",
                })
            }
            else
            {
                toast({
                    variant: "destructive",
                    title: "Generation Failed",
                    description: result.message || "Failed to generate video",
                })
            }
        }
        catch (err)
        {
            console.error(err);
            setShowOverlay(false);
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center relative overflow-hidden">




            {/* Input + Button */}
            <div className="perspective-[1200px] flex justify-center my-auto">
                <div
                    className="
      w-full
      max-w-4xl
      rounded-3xl
      bg-white/70
      backdrop-blur-xl
      shadow-[0_40px_80px_rgba(0,0,0,0.15)]
      border border-white/40
      p-8
      transform
      transition
      hover:rotate-x-[4deg]
    "
                >
                    <div className="flex flex-col gap-8">

                        {/* IMAGE + QUOTE */}
                        <div className="grid grid-cols-[200px_1fr] gap-4 items-center mx-20">
                            {/* ROBOT IMAGE */}
                            <img
                                src="/bot.png"
                                alt="AI Bot"
                                className="w-[200px] h-auto select-none"
                                style={{
                                    animation: "robotIn 0.35s ease-out forwards",
                                }}
                            />

                            {/* MESSAGE BUBBLE */}
                            <img
                                src="/message.png"
                                alt="Message Bubble"
                                className="w-[700px] h-auto select-none"
                                style={{
                                    opacity: 0,
                                    animation: "bubbleIn 0.3s ease-out forwards",
                                    animationDelay: "0.25s",
                                }}
                            />

                            {/* INLINE KEYFRAMES */}
                            <style>
                                {`
      @keyframes robotIn {
        0% {
          opacity: 0;
          transform: translateX(-20px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes bubbleIn {
        0% {
          opacity: 0;
          transform: translateX(-10px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    `}
                            </style>
                        </div>


                        {/* MODE TOGGLE (CENTERED) */}
                        <div className="flex justify-center">
                            <ModeToggle mode={mode} setMode={setMode} />
                        </div>

                        {/* INPUT + BUTTON */}
                        <div className="flex gap-3">
                            <input
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="What should I explain?"
                                className="
            flex-1
            border border-gray-300/70
            rounded-2xl
            px-4
            py-3
            bg-white/80
            focus:outline-none
            focus:ring-1
            focus:ring-[#00a7ff]/80
          "
                            />

                            <button
                                onClick={generateVideo}
                                disabled={loading || !topic}
                                className="
            bg-[#00a7ff]
            px-6
            py-3
            rounded-2xl
            text-white
            font-semibold
            shadow-lg
            transition
            hover:scale-105
            active:scale-95
            disabled:opacity-60
          "
                            >
                                {loading ? "Thinking..." : "Generate"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>



            {/* Overlay */}
            {showOverlay && (
                <div className="fixed inset-0 bg-white backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    {!videoUrl ? (
                        <>
                            <video
                                src="/botAnimation.mp4" // must be in /public folder
                                autoPlay
                                loop
                                muted
                                className="w-[500px]"
                            />
                            <p className="mt-6 text-lg text-gray-800 font-medium animate-pulse transition-all duration-500">
                                {progressText}
                            </p>
                        </>
                    ) : (
                        <div className="relative">
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                controls
                                autoPlay
                                className="w-[900px] rounded-2xl shadow-lg"
                                onEnded={() => setShowReplay(true)}
                            />

                            {/* Replay Button Overlay */}
                            {showReplay && (
                                <button
                                    onClick={() => {
                                        videoRef.current.currentTime = 0;
                                        videoRef.current.play();
                                        setShowReplay(false);
                                    }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl"
                                >
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PersonalAssistant;
