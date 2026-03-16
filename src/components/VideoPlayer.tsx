
// components/VideoPlayer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
    block: {
        id: string;
        type: 'video';
        title?: string;
        data: {
            url: string;
        };
    };
    onComplete: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ block, onComplete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playerType, setPlayerType] = useState<'iframe' | 'video'>('video');
    const [playerUrl, setPlayerUrl] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Function to detect what type of player to use
    useEffect(() => {
        if (!block.data.url) {
            setError('No video URL provided');
            return;
        }

        const url = block.data.url.toLowerCase();
        let type: 'iframe' | 'video' = 'video';
        let finalUrl = block.data.url;

        // YouTube - use iframe
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            type = 'iframe';
            // Convert to embed URL
            const videoId = extractYouTubeId(block.data.url);
            if (videoId) {
                finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
        }
        // Google Drive - use iframe
        else if (url.includes('drive.google.com')) {
            type = 'iframe';
            const fileId = extractGoogleDriveId(block.data.url);
            if (fileId) {
                finalUrl = `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }
        // Vimeo - use iframe
        else if (url.includes('vimeo.com')) {
            type = 'iframe';
            const videoId = extractVimeoId(block.data.url);
            if (videoId) {
                finalUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
            }
        }
        // Direct video files - use video tag
        else if (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov')) {
            type = 'video';
        }
        // w3schools test videos
        else if (url.includes('w3schools.com')) {
            type = 'video';
        }
        // Default to video tag
        else {
            type = 'video';
        }

        setPlayerType(type);
        setPlayerUrl(finalUrl);
    }, [block.data.url]);

    // Extract video IDs from different platforms
    const extractYouTubeId = (url: string): string | null => {
        const patterns = [
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
            /youtu\.be\/([a-zA-Z0-9_-]+)/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match?.[1]) return match[1];
        }
        return null;
    };

    const extractGoogleDriveId = (url: string): string | null => {
        const patterns = [
            /\/d\/([a-zA-Z0-9_-]+)/,
            /id=([a-zA-Z0-9_-]+)/,
            /\/file\/d\/([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match?.[1]) return match[1];
        }
        return null;
    };

    const extractVimeoId = (url: string): string | null => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match?.[1] || null;
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(true);
        
        // If it's a direct video, play it
        if (playerType === 'video' && videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.error('Failed to play video:', err);
                setError('Failed to play video');
                setIsLoading(false);
            });
        }
    };

    const handleVideoEnded = () => {
        onComplete();
        setIsPlaying(false);
    };

    const handleVideoError = () => {
        setError('Failed to load video');
        setIsPlaying(false);
        setIsLoading(false);
    };

    const handleVideoLoaded = () => {
        setIsLoading(false);
        setError(null);
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
        setError(null);
    };

    const handleIframeError = () => {
        setError('Failed to load video');
        setIsLoading(false);
    };

    // Render the actual video player
    const renderPlayer = () => {
        if (playerType === 'iframe') {
            return (
                <iframe
                    src={playerUrl}
                    title={block.title || 'Video'}
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                />
            );
        } else {
            return (
                <video
                    ref={videoRef}
                    src={playerUrl}
                    className="w-full h-full bg-black"
                    controls
                    autoPlay
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    onCanPlay={handleVideoLoaded}
                >
                    Your browser does not support the video tag.
                </video>
            );
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            {block.title && (
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {block.title}
                </h2>
            )}

            <div className="w-full max-w-5xl aspect-video bg-white border border-gray-200 rounded-lg overflow-hidden relative">
                {!isPlaying ? (
                    <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center relative">
                        {/* Preview thumbnail for direct videos */}
                        {playerType === 'video' && !block.data.url.includes('drive.google.com') && (
                            <video
                                className="absolute inset-0 w-full h-full object-cover opacity-0"
                                src={`${block.data.url}#t=0.1`}
                                preload="metadata"
                            />
                        )}
                        
                        {/* Background gradient */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-gray-100" />
                        
                        <h1 className="text-4xl font-bold text-gray-900 z-10">
                            {block.title ?? 'Lesson Video'}
                        </h1>

                        <button
                            onClick={handlePlay}
                            disabled={isLoading}
                            className="w-20 h-20 bg-[#0080ff] rounded-full flex items-center justify-center mt-10 z-10 transition hover:scale-110 hover:shadow-lg"
                        >
                            <Play fill="white" size={32} className="text-white ml-1" />
                        </button>

                        <p className="mt-4 text-gray-600 z-10">
                            Click play to start the video
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Loading overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        
                        {/* Error message */}
                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white p-6 z-20">
                                <p className="text-lg mb-4">{error}</p>
                                <button
                                    onClick={() => {
                                        setIsPlaying(false);
                                        setError(null);
                                    }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                        
                        {/* Actual player */}
                        <div className="w-full h-full">
                            {renderPlayer()}
                        </div>
                    </>
                )}
            </div>

            {/* Manual completion button for iframe videos (YouTube, Google Drive, Vimeo) */}
            {isPlaying && playerType === 'iframe' && !error && !isLoading && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <button
                        onClick={() => {
                            onComplete();
                            setIsPlaying(false);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Mark as Complete
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;