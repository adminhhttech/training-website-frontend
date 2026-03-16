import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    ChevronDown, ChevronLeft, ChevronUp
} from "lucide-react"
import { Link } from 'react-router-dom';

// -------------------- Types --------------------
interface Video {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
}

interface YouTubeSearchResult {
    videos: Video[];
    nextPageToken?: string;
}

type Message = {
    type: "user" | "assistant";
    content: string;
    videos?: Video[];
    error?: boolean;
    retry?: () => void;
};

// -------------------- Custom Hook: useYouTubeSearch --------------------
const useYouTubeSearch = () => {
    // In production, move your API key to an environment variable
    const API_KEY = "AIzaSyAYjxxS4-LRYDU4aWsGIx3ABAXZigKLzR8";

    const searchVideos = useCallback(
        async (query: string): Promise<YouTubeSearchResult> => {
            const refinedQuery = `${query} explained tutorial`;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                refinedQuery
            )}&type=video&maxResults=5&order=relevance&videoDuration=long&videoEmbeddable=true&relevanceLanguage=en&safeSearch=strict&key=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "YouTube API error");
            }

            return {
                videos: data.items.map((item: any) => ({
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.medium.url,
                })),
                nextPageToken: data.nextPageToken,
            };
        },
        []
    );

    return { searchVideos };
};

// -------------------- Subcomponents --------------------

// Individual video card with hover animation
const VideoCard: React.FC<{ video: Video; index: number }> = ({ video, index }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <p className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {index + 1}. {video.title}
            </p>
            <div className="rounded-lg overflow-hidden shadow border border-gray-200 bg-gray-100">
                {!isLoaded && (
                    <div className="aspect-video w-full bg-gray-200 animate-pulse" />
                )}
                <iframe
                    className={`w-full aspect-video transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0 h-0"
                        }`}
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>
        </div>
    );
};

// Loading skeleton for videos
const VideoSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="aspect-video w-full bg-gray-200 rounded-lg" />
            </div>
        ))}
    </div>
);

// -------------------- Main Component --------------------
const VideoRadar: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [headerStatus, setHeaderStatus] = useState<"idle" | "searching" | "ready">("idle");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { searchVideos } = useYouTubeSearch();

    // Scroll to bottom
    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // Handle scroll events to show/hide scroll button
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle message submission
    const handleSubmit = async (retryQuery?: string) => {
        const query = retryQuery ?? input.trim();
        if (!query || loading) return;

        setInput("");
        setLoading(true);
        setHeaderStatus("searching");

        // Add user message
        setMessages((prev) => [...prev, { type: "user", content: query }]);

        try {
            const videoData = await searchVideos(query);
            setMessages((prev) => [
                ...prev,
                {
                    type: "assistant",
                    content: `Here are helpful videos for "${query}"`,
                    videos: videoData.videos,
                },
            ]);
            setHeaderStatus("ready");
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    type: "assistant",
                    content: "Sorry, I couldn't find videos at the moment. Please try again.",
                    error: true,
                    retry: () => handleSubmit(query),
                },
            ]);
            setHeaderStatus("idle");
        } finally {
            setLoading(false);
            // After 3 seconds, revert to idle if no new search
            setTimeout(() => {
                setHeaderStatus((prev) => (prev === "ready" ? "idle" : prev));
            }, 3000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Helper to get header status text and animation
    const getHeaderContent = () => {
        switch (headerStatus) {
            case "searching":
                return {
                    text: "Searching videos...",
                    dot: "animate-pulse bg-yellow-400",
                };
            case "ready":
                return {
                    text: "Videos ready",
                    dot: "bg-green-500",
                };
            default:
                return {
                    text: "YouTube Topic Finder",
                    dot: "bg-red-500",
                };
        }
    };

    const { text: statusText, dot: dotColor } = getHeaderContent();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <img src="/navbarIcon.png" alt="Logo" className="h-8 w-auto" />
                </div>
                <div className="text-center">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-700">
                        Video Radar
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 transition-all duration-300">
                        <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${dotColor}`} />
                        <span className="transition-opacity duration-300">{statusText}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">

                    <Link
                        to="/dashboard"
                        className="
        flex items-center gap-2
        px-2 py-2 sm:px-4
        bg-[#00a7ff] text-white
        rounded-lg
        hover:bg-[#0095e0]
        transition
        text-xs sm:text-sm
        "
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />

                        <span className="hidden sm:inline font-medium">
                            Dashboard
                        </span>
                    </Link>

                </div>
            </header>

            {/* Main Chat Area */}
            <main
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto py-6 sm:py-10 px-4 pb-32 sm:pb-36"
            >
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.length === 0 && !loading && (
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-fit animate-fadeIn">
                            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full text-xl">
                                🤖
                            </div>
                            <p className="text-gray-600">Ask anything to find learning videos.</p>
                        </div>
                    )}

                    {messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                                } animate-fadeInUp`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div
                                className={`max-w-2xl rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow-sm ${message.type === "user"
                                    ? "bg-[#00a7ff] text-white"
                                    : message.error
                                        ? "bg-red-50 border border-red-200 text-red-700"
                                        : "bg-white border border-gray-200 text-gray-700"
                                    }`}
                            >
                                {message.type === "assistant" && !message.error && (
                                    <p className="text-xs font-semibold text-[#00a7ff] mb-1">
                                        Video Radar
                                    </p>
                                )}

                                <p className="whitespace-pre-wrap text-sm sm:text-base">
                                    {message.content}
                                </p>

                                {message.error && message.retry && (
                                    <button
                                        onClick={message.retry}
                                        className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full transition"
                                    >
                                        Try again
                                    </button>
                                )}

                                {message.videos && message.videos.length > 0 && (
                                    <div className="mt-4 space-y-6">
                                        {message.videos.map((video, i) => (
                                            <VideoCard key={video.videoId} video={video} index={i} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm w-full">
                                <p className="text-xs font-semibold text-[#00a7ff] mb-3">
                                    Video Radar is thinking...
                                </p>
                                <VideoSkeleton />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Bar with Glassmorphism effect on focus */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-4 sm:pb-6
          transition-all duration-300 ease-in-out
          ${isInputFocused ? "translate-y-0 scale-100" : "translate-y-0 scale-95"}
        `}
            >
                <div
                    className={`
            w-full max-w-3xl flex items-center gap-3
            bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-full
            px-3 sm:px-4 py-1 sm:py-2
            transition-all duration-300
            ${isInputFocused ? "shadow-xl border-[#00a7ff] bg-white/90" : "shadow-md bg-white/80"}
          `}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="Ask about any topic..."
                        disabled={loading}
                        className="flex-1 px-2 sm:px-3 py-2 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm sm:text-base"
                        aria-label="Search query"
                    />
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!input.trim() || loading}
                        className="bg-[#00a7ff] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow disabled:opacity-50 text-sm sm:text-base whitespace-nowrap transition hover:bg-[#0095e0] flex items-center gap-1"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>...</span>
                            </>
                        ) : (
                            "Send"
                        )}
                    </button>
                </div>
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom()}
                    aria-label="Scroll to bottom"
                    className="
    fixed
    bottom-20 right-4
    sm:bottom-24 sm:right-6
    flex items-center justify-center
    w-10 h-10 sm:w-12 sm:h-12
    bg-[#00a7ff] text-white
    rounded-full
    shadow-lg
    transition
    duration-200
    hover:scale-110
    active:scale-95
    z-20
    "
                >
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            )}

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll to top"
                className="
  fixed
  bottom-20 left-4
  sm:bottom-24 sm:left-6
  flex items-center justify-center
  w-10 h-10 sm:w-12 sm:h-12
  bg-[#00a7ff] text-white
  rounded-full
  shadow-lg
  transition
  duration-200
  hover:scale-110
  active:scale-95
  z-20
  "
            >
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Global Styles for Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease forwards;
        }
      `}</style>
        </div>
    );
};

export default VideoRadar;