import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, Send, PhoneOff, Clock,
    Bot, GraduationCap, Building,
    X
} from 'lucide-react';

// Mapping mentor types to display names and icons
const mentorTypeMap: Record<string, { label: string; icon: any }> = {
    ai: { label: 'AI Mentor', icon: Bot },
    'top-institutes': { label: 'Top Institutes Mentor', icon: GraduationCap },
    corporate: { label: 'Corporate Mentor', icon: Building },
};

// Keywords to detect voice gender (browser dependent)
const maleKeywords = ['male', 'david', 'daniel', 'james', 'alex', 'thomas', 'jon', 'fred', 'guy', 'heera', 'hemant', 'kumar', 'ravi', 'microsoft mark'];
const femaleKeywords = ['female', 'zira', 'samantha', 'karen', 'moira', 'tessa', 'fiona', 'veena', 'alice', 'kate', 'victoria', 'kalpana', 'linda', 'hazel', 'susan', 'google uk english female'];

const CallPage: React.FC = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>(() =>
        (localStorage.getItem('language') as 'en-IN' | 'hi-IN') || 'en-IN'
    );

    // Single unified messages array
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'mentor' }>>([
        { text: 'Hello! I’m your mentor. How can I help you today?', sender: 'mentor' }
    ]);

    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Refs
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const sessionId = useRef(`user_${Date.now()}`);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Voice caching using a unique identifier (voiceURI or name+lang)
    const selectedVoiceId = useRef<string | null>(null);
    const lastLangGender = useRef<{ lang: string; gender: string } | null>(null);

    // Get selections from localStorage
    const userType = (localStorage.getItem('userType') as 'corporate' | 'student') || 'corporate';
    const mentorGender = (localStorage.getItem('mentorGender') as 'male' | 'female') || 'male';
    const mentorType = (localStorage.getItem('mentorType') as string) || 'ai';
    const mode = userType;

    const mentorInfo = mentorTypeMap[mentorType] || mentorTypeMap.ai;
    const isAIMentor = mentorType === 'ai';

    // --- Cleanup on unmount ---
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
            recognitionRef.current?.stop();
        };
    }, []);

    // --- Dynamic background based on mentor type ---
    const getBackgroundStyle = (): React.CSSProperties => {
        if (isAIMentor) {
            const imageUrl = mentorGender === 'female' ? '/Bot2.jpg' : '/Bot1.jpg';
            return {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            };
        }
        // For corporate / top institutes: clean white background with subtle pattern
        return {
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(220, 240, 255, 0.4) 0%, transparent 30%)',
        };
    };

    // --- Theme classes (light for non-AI, dark for AI) ---
    const theme = {
        // Navbar
        navBg: isAIMentor ? 'bg-black/10 backdrop-blur-xl border-white/10' : 'bg-white/80 backdrop-blur-xl border-gray-200',
        navText: isAIMentor ? 'text-white' : 'text-gray-900',
        navButton: isAIMentor ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700',
        timerBg: isAIMentor ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-300',
        timerText: isAIMentor ? 'text-white' : 'text-gray-800',
        selectBg: isAIMentor ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900',
        // Chat bubbles
        mentorBubble: isAIMentor
            ? 'bg-white/15 backdrop-blur-md border border-white/20 text-white'
            : 'bg-gray-100 border border-gray-300 text-gray-900',
        userBubble: isAIMentor
            ? 'bg-sky-500/40 backdrop-blur-md border border-sky-400/30 text-white'
            : 'bg-blue-500 text-white border border-blue-600', // solid blue for light mode user messages
        // Input bar
        inputBarBg: isAIMentor ? 'bg-black/10 backdrop-blur-xl border-white/10' : 'bg-white/80 backdrop-blur-xl border-gray-200',
        inputField: isAIMentor
            ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
            : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500',
        micButton: isAIMentor
            ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300',
        sendButton: 'bg-sky-500 text-white hover:bg-sky-600', // same for both
        endButton: 'bg-red-500/80 text-white hover:bg-red-600', // same
    };

    // --- Auto-scroll to bottom on new messages ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Timer ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    endCall();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- Speech Recognition setup ---
    useEffect(() => {
        const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionConstructor) {
            recognitionRef.current = new SpeechRecognitionConstructor();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                sendMessage(transcript);
            };

            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = () => setIsListening(false);
        }
    }, []);

    // Update recognition language on change
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition not supported');
            return;
        }
        // Stop any ongoing speech before listening
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.lang = language;
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // --- Voice selection (strict language, returns voice and its unique ID) ---
    const selectVoice = useCallback((lang: string, gender: string): { voice: SpeechSynthesisVoice | null; id: string | null } => {
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = lang.split('-')[0]; // 'en' or 'hi'

        // Helper to generate a unique ID for a voice (fallback to name+lang)
        const getVoiceId = (v: SpeechSynthesisVoice) => v.voiceURI || `${v.name}|${v.lang}`;

        // 1. Try exact language match + gender keywords
        let voice = voices.find(v =>
            v.lang === lang &&
            (gender === 'male'
                ? maleKeywords.some(k => v.name.toLowerCase().includes(k))
                : femaleKeywords.some(k => v.name.toLowerCase().includes(k)))
        );

        // 2. Try any voice with same language prefix + gender keywords
        if (!voice) {
            voice = voices.find(v =>
                v.lang.toLowerCase().startsWith(langPrefix) &&
                (gender === 'male'
                    ? maleKeywords.some(k => v.name.toLowerCase().includes(k))
                    : femaleKeywords.some(k => v.name.toLowerCase().includes(k)))
            );
        }

        // 3. Fallback to exact language match (any gender)
        if (!voice) {
            voice = voices.find(v => v.lang === lang);
        }

        // 4. Fallback to language prefix (any gender)
        if (!voice) {
            voice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
        }

        // 5. Last resort: any voice
        if (!voice && voices.length > 0) {
            voice = voices[0];
        }

        return {
            voice: voice || null,
            id: voice ? getVoiceId(voice) : null
        };
    }, []);

    // --- Update cached voice when language/gender changes ---
    useEffect(() => {
        const { voice, id } = selectVoice(language, mentorGender);
        if (voice && id) {
            selectedVoiceId.current = id;
            lastLangGender.current = { lang: language, gender: mentorGender };
        }

        // Listen for voice list changes and update cache only if our cached voice is gone
        const handleVoicesChanged = () => {
            if (!selectedVoiceId.current) return;

            const voices = window.speechSynthesis.getVoices();
            const stillExists = voices.some(v => {
                const vid = v.voiceURI || `${v.name}|${v.lang}`;
                return vid === selectedVoiceId.current;
            });

            if (!stillExists) {
                // Our cached voice is no longer available – pick a new one
                const { voice, id } = selectVoice(language, mentorGender);
                if (voice && id) {
                    selectedVoiceId.current = id;
                }
            }
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, [language, mentorGender, selectVoice]);

    // --- Text‑to‑Speech (strict language, uses cached voice ID) ---
    const speak = (text: string) => {
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9;
        utterance.volume = 1;

        // Get current voices and try to find the cached voice by ID
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice: SpeechSynthesisVoice | null = null;

        if (selectedVoiceId.current) {
            selectedVoice = voices.find(v => {
                const vid = v.voiceURI || `${v.name}|${v.lang}`;
                return vid === selectedVoiceId.current;
            }) || null;
        }

        // If cached voice not found, run selection again and update cache
        if (!selectedVoice) {
            const { voice, id } = selectVoice(language, mentorGender);
            selectedVoice = voice;
            if (id) selectedVoiceId.current = id;
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Adjust pitch if voice doesn't match desired gender
        const voiceName = selectedVoice?.name.toLowerCase() || '';
        const isMaleVoice = maleKeywords.some(k => voiceName.includes(k));
        const isFemaleVoice = femaleKeywords.some(k => voiceName.includes(k));

        if (mentorGender === 'male') {
            if (isFemaleVoice && !isMaleVoice) {
                utterance.pitch = 0.6; // lower pitch for female voice
            } else {
                utterance.pitch = 1.0;
            }
        } else {
            if (isMaleVoice && !isFemaleVoice) {
                utterance.pitch = 1.4; // raise pitch for male voice
            } else {
                utterance.pitch = 1.1;
            }
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    // --- API call ---
    const sendMessage = async (message: string) => {
        if (!message.trim() || isProcessing) return;

        // Stop any ongoing speech
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);

        setMessages(prev => [...prev, { text: message, sender: 'user' }]);
        setInputText('');
        setIsProcessing(true);

        try {
            const res = await fetch('https://hht-training-backend.space/chat-ai-mentor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId.current,
                    message,
                    mode,
                    language
                }),
            });

            if (!res.ok) throw new Error('Network error');
            const data = await res.json();

            setMessages(prev => [...prev, { text: data.response, sender: 'mentor' }]);
            speak(data.response);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: 'Sorry, something went wrong.', sender: 'mentor' }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSend = () => {
        if (inputText.trim()) sendMessage(inputText);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const endCall = () => {
        window.speechSynthesis?.cancel();
        recognitionRef.current?.stop();
        localStorage.setItem('callEnded', 'true');
        navigate('/mentor');
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden">

{/* BACKGROUND LAYER */}
<div
className={`absolute inset-0 transition-transform duration-[2500ms] ease-in-out ${isSpeaking ? 'speaking-active' : ''}`}
style={getBackgroundStyle()}
/>

{/* UI LAYER */}
<div className="relative z-10 flex flex-col h-full">
            {/* Global animations */}
            <style>{`
                @keyframes aiGlow {
                    0% { box-shadow: inset 0 0 100px rgba(0, 128, 255, 0.0); }
                    100% { box-shadow: inset 0 0 150px rgba(0, 128, 255, 0.25); }
                }
                
                @keyframes mentorBreathing {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.speaking-active {
  animation: mentorBreathing 2.6s ease-in-out infinite;
}
                /* Scrollbar styling */
                .chat-container::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-container::-webkit-scrollbar-track {
                    background: ${isAIMentor ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                }
                .chat-container::-webkit-scrollbar-thumb {
                    background: ${isAIMentor ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'};
                    border-radius: 4px;
                }
                    @keyframes voicePulse {
  0% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
}

            `}</style>

            {/* --- NAVBAR (theme aware) --- */}
            <nav className={`h-16 flex-shrink-0 z-20 ${theme.navBg} border-b ${isAIMentor ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/navbarIcon.png" alt="HHT" className="h-8 w-auto" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 text-sm ${theme.timerBg} backdrop-blur px-3 py-1.5 rounded-full ${theme.timerText} border font-mono`}>
                            <Clock className="w-4 h-4" />
                            <span>{formatTime()}</span>
                        </div>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en-IN' | 'hi-IN')}
                            className={`${theme.selectBg} rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-opacity-50`}
                        >
                            <option value="en-IN" className="text-black bg-white">English</option>
                            <option value="hi-IN" className="text-black bg-white">हिन्दी</option>
                        </select>
                        <button
                            onClick={endCall}
                            className={`p-2 ${theme.navButton} rounded-full transition-colors`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CHAT AREA (responsive, bubbles close to edges) --- */}
            <main className="flex-1 overflow-hidden relative z-10 flex flex-col">

                <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-6 chat-container">
                    <AnimatePresence>
{isSpeaking && (
<motion.div
initial={{ opacity: 0, x: -10, scale: 0.95 }}
animate={{ opacity: 1, x: 0, scale: 1 }}
exit={{ opacity: 0, x: -10, scale: 0.95 }}
transition={{ duration: 0.25, ease: "easeOut" }}
className="absolute bottom-28 left-[45%] -translate-x-1/2 z-50 hidden sm:block">
<div className="
flex items-center gap-2
bg-black/40 backdrop-blur-xl
text-white text-xs font-medium
px-4 py-1.5
rounded-full
border border-white/10
shadow-lg shadow-black/30
">

<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
</span>

<span className="tracking-wide">
Mentor speaking
</span>

</div>
</motion.div>
)}
</AnimatePresence>
                    <div className="flex flex-col space-y-4">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.sender === 'mentor' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[480px] w-fit px-4 py-2.5 rounded-2xl shadow-lg text-base leading-relaxed ${msg.sender === 'mentor'
                                                ? theme.mentorBubble + ' rounded-bl-md'
                                                : theme.userBubble + ' rounded-br-md'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>
                </div>

                
            </main>

            {/* --- INPUT BAR (theme aware) --- */}
            <div className={`h-20 flex-shrink-0 z-20 ${theme.inputBarBg} border-t ${isAIMentor ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="h-full max-w-3xl mx-auto px-4 flex items-center gap-3">
                    <button
                        onClick={toggleListening}
                        className={`p-3 rounded-full transition-all border ${isListening
                                ? 'bg-red-500 text-white border-red-400 scale-110 shadow-lg shadow-red-500/30'
                                : theme.micButton
                            }`}
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className={`flex-1 rounded-full px-5 py-2.5 focus:outline-none focus:ring-1 transition-all text-base ${theme.inputField}`}
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing || !inputText.trim()}
                        className={`p-3 rounded-full shadow-lg transition-transform hover:scale-105 ${theme.sendButton} disabled:opacity-50`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <button
                        onClick={endCall}
                        className={`p-3 rounded-full shadow-lg transition-transform hover:scale-105 ${theme.endButton}`}
                    >
                        <PhoneOff className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Listening wave overlay */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-1 z-50 bg-black/40 px-4 py-2 rounded-full backdrop-blur border border-white/10"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <span
                                key={i}
                                className="w-1 bg-white rounded-full animate-bounce"
                                style={{
                                    height: `${Math.random() * 16 + 8}px`,
                                    animationDuration: `${0.4 + i * 0.1}s`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
};

export default CallPage;