import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RotateCcw, Send, Volume2, VolumeX, Bot, User,
    Loader2, BookOpen, Briefcase, CheckCircle, Star,
    Download, ExternalLink, ArrowLeft, CircleAlert,
    ChevronLeft
} from 'lucide-react';

// Types
interface Message {
    content: string;
    sender: 'user' | 'assistant';
    type?: 'text' | 'assessment' | 'roadmap' | 'detailed-roadmap' | 'docs' | 'roadmap-option' | 'detailed-roadmap-option';
    data?: any;
    timestamp?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hht-training-backend.space';

const CounsellorPage: React.FC = () => {
    // State
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
    const [conversationStarted, setConversationStarted] = useState(false);
    const [showDomainButtons, setShowDomainButtons] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(false);
    const [showRoadmapOption, setShowRoadmapOption] = useState(false);
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [showDetailedRoadmap, setShowDetailedRoadmap] = useState(false);
    const [detailedRoadmapData, setDetailedRoadmapData] = useState<any>(null);
    const [isTTSEnabled, setIsTTSEnabled] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Initialize
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            startConversation();
        }
    }, []);

    // Cleanup speech
    useEffect(() => {
        return () => {
            if (speechRef.current) window.speechSynthesis.cancel();
        };
    }, []);

    // Helpers
    const addMessage = (content: string, sender: 'user' | 'assistant', type: Message['type'] = 'text', data?: any) => {
        setMessages(prev => [...prev, { content, sender, type, data, timestamp: Date.now() }]);
    };

    const addTypedMessage = (content: string, sender: 'user' | 'assistant', type: Message['type'] = 'text', data?: any) => {
        if (sender === 'assistant') {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { content, sender, type, data, timestamp: Date.now() }]);
                if (isTTSEnabled && content && type === 'text') speakText(content);
            }, 1000 + Math.random() * 500);
        } else {
            setMessages(prev => [...prev, { content, sender, type, data, timestamp: Date.now() }]);
        }
    };

    // TTS
    const speakText = (text: string) => {
        if (!isTTSEnabled || !text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const toggleTTS = () => {
        if (isTTSEnabled) window.speechSynthesis.cancel();
        setIsTTSEnabled(!isTTSEnabled);
    };

    // API Handlers
    const startConversation = async () => {
        setConnectionStatus('connecting');
        try {
            const response = await axios.post(`${API_BASE_URL}/start`);
            setSessionId(response.data.session_id);
            setConnectionStatus('online');
            addMessage("Hello! I'm your HHT AI Counsellor. I'm here to assess your technical skills and provide personalized learning recommendations. What's your name?", 'assistant');
            setConversationStarted(true);
        } catch (error) {
            setConnectionStatus('offline');
            addMessage("Connecting to server... Please wait a moment and try again.", 'assistant');
        }
    };

    const sendMessage = async () => {
        if (!inputValue.trim() || !sessionId) return;
        if (isTTSEnabled && speechRef.current) window.speechSynthesis.cancel();

        const userMessage = inputValue.trim();
        setInputValue('');
        addMessage(userMessage, 'user');

        try {
            const userMessageCount = messages.filter(m => m.sender === 'user').length + 1;

            if (userMessageCount <= 2) {
                await handlePersonalInfo(userMessage, userMessageCount);
            } else if (userMessageCount === 3) {
                const validDomains = ['backend', 'frontend', 'data analytics', 'machine learning', 'devops', 'cybersecurity', 'data engineering', 'algorithms', 'dsa'];
                const userDomain = userMessage.toLowerCase();
                const isValidDomain = validDomains.some(domain => userDomain.includes(domain.toLowerCase()));

                if (isValidDomain) {
                    await handleDomainSelection(userMessage);
                } else {
                    addTypedMessage("Sorry, I haven't been trained yet to provide counselling on that domain. Please select from the available options.", 'assistant');
                    setShowDomainButtons(true);
                }
            } else {
                await handleRegularMessage(userMessage);
            }
        } catch (error) {
            addMessage("I encountered an error processing your message. Please try again.", 'assistant');
        }
    };

    const handlePersonalInfo = async (message: string, count: number) => {
        if (count === 1) {
            let extractedName = message;
            const namePatterns = [/(?:hi|hello|hey),?\s*my name is\s+(.+)/i, /(?:hi|hello|hey),?\s*i'm\s+(.+)/i, /my name is\s+(.+)/i, /i'm\s+(.+)/i, /call me\s+(.+)/i, /(?:hi|hello|hey),?\s+(.+)/i];
            for (const pattern of namePatterns) {
                const match = message.match(pattern);
                if (match) { extractedName = match[1].trim(); break; }
            }
            if (/^[a-zA-Z\s]{2,50}$/.test(extractedName) && extractedName.split(' ').length <= 3) {
                addTypedMessage(`Nice to meet you, ${extractedName}! What's your educational background?`, 'assistant');
            } else {
                addTypedMessage("I didn't catch your name clearly. Could you please tell me your name?", 'assistant');
            }
        } else if (count === 2) {
            const userMessages = messages.filter(m => m.sender === 'user');
            const nameMessage = userMessages[0]?.content || '';
            let name = nameMessage;
            const namePatterns = [/(?:hi|hello|hey),?\s*my name is\s+(.+)/i, /my name is\s+(.+)/i, /i'm\s+(.+)/i];
            for (const pattern of namePatterns) {
                const match = nameMessage.match(pattern);
                if (match) { name = match[1].trim(); break; }
            }
            try {
                await axios.post(`${API_BASE_URL}/personal-info`, { session_id: sessionId, name, location: 'Not specified', education: message });
                addTypedMessage("Perfect! Now, which tech domain interests you most?", 'assistant');
                setShowDomainButtons(true);
            } catch (error) {
                addTypedMessage("Let's continue. Which tech domain interests you most?", 'assistant');
                setShowDomainButtons(true);
            }
        }
    };

    const handleDomainSelection = async (domain: string) => {
        if (isTTSEnabled && speechRef.current) window.speechSynthesis.cancel();
        setShowDomainButtons(false);
        addMessage(domain, 'user');
        setIsTyping(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/answer`, { session_id: sessionId, answer: domain });
            if (response.data.message) addTypedMessage(response.data.message, 'assistant');
            if (response.data.question) {
                setTimeout(() => addTypedMessage(response.data.question, 'assistant'), response.data.message ? 2000 : 0);
            }
        } catch (error) {
            addMessage("I had trouble understanding your domain selection. Please try selecting from the available options.", 'assistant');
        } finally {
            setIsTyping(false);
        }
    };

    const handleRegularMessage = async (message: string) => {
        try {
            if (isAssessmentComplete) {
                if (showRoadmapOption) {
                    const lowerMessage = message.toLowerCase().trim();
                    const isYes = ['yes', 'y', 'yeah', 'yep', 'sure', 'definitely', 'ok', 'okay'].includes(lowerMessage);
                    const isNo = ['no', 'n', 'nope', 'never', 'not really', 'nah'].includes(lowerMessage);
                    if (isYes || isNo) { handleRoadmapRequest(isYes); return; }
                }
                if (!feedbackGiven && (message.toLowerCase().includes('feedback') || message.toLowerCase().includes('suggestion') || message.toLowerCase().includes('experience') || message.length > 10)) {
                    try {
                        const response = await axios.post(`${API_BASE_URL}/feedback`, { session_id: sessionId, feedback: message });
                        setFeedbackGiven(true);
                        addTypedMessage(response.data.message, 'assistant');
                        if (response.data.docs && response.data.docs.length > 0) {
                            setTimeout(() => addMessage('', 'assistant', 'docs', response.data.docs), 1500);
                        }
                        return;
                    } catch (error) {
                        setFeedbackGiven(true);
                        addTypedMessage("Thank you so much for your valuable feedback! It helps us improve our service.", 'assistant');
                        return;
                    }
                }

                const response = await axios.post(`${API_BASE_URL}/chat`, { session_id: sessionId, message: message });
                addTypedMessage(response.data.message || response.data.reply, 'assistant');

                if (response.data.generate_roadmap) {
                    setTimeout(async () => {
                        try {
                            const roadmapResponse = await axios.post(`${API_BASE_URL}/detailed-roadmap`, { session_id: sessionId, domain: response.data.generate_roadmap });
                            addTypedMessage(`Here's your ${response.data.generate_roadmap} roadmap:`, 'assistant');
                            setTimeout(() => addMessage('', 'assistant', 'detailed-roadmap', roadmapResponse.data), 1500);
                        } catch (error) {
                            addTypedMessage("I had trouble generating the roadmap. Please try again.", 'assistant');
                        }
                    }, 1000);
                }
                if (response.data.docs && response.data.docs.length > 0) {
                    setTimeout(() => addMessage('', 'assistant', 'docs', response.data.docs), 1500);
                }
            } else {
                const response = await axios.post(`${API_BASE_URL}/answer`, { session_id: sessionId, answer: message });

                if (response.data.completed) {
                    setIsAssessmentComplete(true);
                    addTypedMessage(response.data.message, 'assistant');
                    setTimeout(() => addMessage('', 'assistant', 'assessment', response.data.recommendations), 1500);
                    setTimeout(() => addTypedMessage("Feel free to ask me any questions about your results or how to improve your skills!", 'assistant'), 2000);
                    setTimeout(() => {
                        setShowRoadmapOption(true);
                        addTypedMessage("Would you like a detailed 5-week roadmap for your domain?", 'assistant', 'roadmap-option');
                    }, 3500);
                } else {
                    if (response.data.message && response.data.message !== "Got it!") addTypedMessage(response.data.message, 'assistant');
                    if (response.data.question) {
                        setTimeout(() => addTypedMessage(response.data.question, 'assistant'), response.data.message && response.data.message !== "Got it!" ? 2000 : 0);
                    }
                }
            }
        } catch (error) {
            addTypedMessage("I had trouble processing your answer. Could you please try again?", 'assistant');
        }
    };

    const handleDetailedRoadmapRequest = async (domain: string) => {
        if (isTTSEnabled && speechRef.current) window.speechSynthesis.cancel();
        setShowDetailedRoadmap(false);
        addMessage(`Show me detailed ${domain} roadmap`, 'user');
        setIsTyping(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/detailed-roadmap`, { domain: domain.toLowerCase() });
            setDetailedRoadmapData(response.data);
            addTypedMessage(`Here's your comprehensive ${response.data.title}:`, 'assistant');
            setTimeout(() => addMessage('', 'assistant', 'detailed-roadmap', response.data), 1500);
        } catch (error) {
            addTypedMessage("I had trouble generating your detailed roadmap. Please try again later.", 'assistant');
        } finally {
            setIsTyping(false);
        }
    };

    const handleRoadmapRequest = async (wantsRoadmap: boolean) => {
        if (isTTSEnabled && speechRef.current) window.speechSynthesis.cancel();
        setShowRoadmapOption(false);
        if (wantsRoadmap) {
            addMessage("Yes, I'd like a roadmap", 'user');
            setIsTyping(true);
            try {
                const response = await axios.post(`${API_BASE_URL}/detailed-roadmap`, { session_id: sessionId });
                setRoadmapData(response.data);
                addTypedMessage(`Here's your comprehensive roadmap:`, 'assistant');
                setTimeout(() => addMessage('', 'assistant', 'detailed-roadmap', response.data), 1500);
                setTimeout(() => addTypedMessage("How was your experience? Any suggestions or feedback would be greatly appreciated!", 'assistant'), 3000);
            } catch (error) {
                addTypedMessage("I had trouble generating your roadmap. Please try again later.", 'assistant');
            } finally {
                setIsTyping(false);
            }
        } else {
            addMessage("No, I'll continue without a roadmap", 'user');
            setTimeout(() => addTypedMessage("How was your experience? Any suggestions or feedback would be greatly appreciated!", 'assistant'), 500);
        }
    };

    const downloadRoadmapPDF = async (domain?: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/download-roadmap`, {
                session_id: sessionId,
                domain: domain ? domain.toLowerCase() : undefined
            }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${domain || 'roadmap'}_roadmap.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            addTypedMessage(`📄 Roadmap PDF downloaded successfully!`, 'assistant');
        } catch (error) {
            addTypedMessage("Sorry, I couldn't generate the PDF. Please try again later.", 'assistant');
        }
    };

    const restartConversation = () => {
        if (speechRef.current) window.speechSynthesis.cancel();
        setSessionId(null);
        setMessages([]);
        setInputValue('');
        setIsAssessmentComplete(false);
        setConversationStarted(false);
        setShowDomainButtons(false);
        setFeedbackGiven(false);
        setShowRoadmapOption(false);
        setShowDetailedRoadmap(false);
        setRoadmapData(null);
        setDetailedRoadmapData(null);
        hasInitialized.current = false;
        startConversation();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Render Content
    const renderMessageContent = (msg: Message, index: number) => {
        const isLast = index === messages.length - 1;

        if (msg.type === 'assessment') {
            return (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden max-w-2xl w-full mx-auto">
                    <div className="bg-gradient-to-r from-[#00a7ff] to-blue-600 p-4 text-white">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Assessment Results</h3>
                        </div>
                        <p className="text-blue-100 text-sm mt-1">Your personalized evaluation</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">Level Achieved</span>
                            <span className="px-3 py-1 bg-blue-50 text-[#00a7ff] rounded-full text-sm font-bold">{msg.data.level}</span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-[#00a7ff] h-2 rounded-full" style={{ width: msg.data.percentage }}></div>
                        </div>
                        <p className="text-xs text-slate-400 text-right">{msg.data.score} ({msg.data.percentage})</p>

                        {msg.data.level_description && (
                            <div className="text-slate-600 text-sm leading-relaxed">{msg.data.level_description}</div>
                        )}

                        {msg.data.areas_to_improve && msg.data.areas_to_improve.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><CircleAlert className="w-4 h-4 text-orange-500" /> Areas to Improve</h4>
                                <div className="space-y-2">
                                    {msg.data.areas_to_improve.map((item: any, i: number) => (
                                        <div key={i} className="bg-orange-50 p-3 rounded-lg text-sm">
                                            <p className="font-medium text-orange-800">{item.question}</p>
                                            <p className="text-orange-600 mt-1">{item.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" /> Recommended Topics</h4>
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                    {msg.data.topics.map((topic: string, i: number) => <li key={i}>{topic}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-green-500" /> Suggested Projects</h4>
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                    {msg.data.projects.map((proj: string, i: number) => <li key={i}>{proj}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (msg.type === 'detailed-roadmap') {
            return (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden max-w-2xl w-full mx-auto">
                    <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                        <h3 className="font-bold text-[#00a7ff]">{msg.data.title}</h3>
                        <button onClick={() => downloadRoadmapPDF(msg.data.domain)} className="flex items-center gap-1 text-xs bg-[#00a7ff] text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors">
                            <Download className="w-3 h-3" /> PDF
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        <p className="text-sm text-slate-600"><strong>Description:</strong> {msg.data.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-50 p-2 rounded"><strong>Prerequisites:</strong> {msg.data.prerequisites}</div>
                            <div className="bg-slate-50 p-2 rounded"><strong>Duration:</strong> {msg.data.duration}</div>
                        </div>

                        <div className="space-y-3">
                            {msg.data.steps.map((step: any, i: number) => (
                                <div key={i} className="border-l-2 border-[#00a7ff] pl-3 py-1">
                                    <h4 className="font-semibold text-slate-800">Step {step.step}: {step.title}</h4>
                                    <p className="text-xs text-slate-400 mb-2">{step.duration}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        <div className="bg-blue-50 p-2 rounded">
                                            <p className="font-bold text-blue-800 mb-1">Topics:</p>
                                            <ul className="list-disc list-inside">{step.topics.map((t: string, j: number) => <li key={j}>{t}</li>)}</ul>
                                        </div>
                                        <div className="bg-green-50 p-2 rounded">
                                            <p className="font-bold text-green-800 mb-1">Projects:</p>
                                            <ul className="list-disc list-inside">{step.projects.map((p: string, j: number) => <li key={j}>{p}</li>)}</ul>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <h5 className="font-bold text-xs text-slate-500 mb-1">Resources:</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {step.resources.map((res: any, j: number) => (
                                                <a key={j} href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00a7ff] underline hover:text-blue-800">
                                                    {res.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <div className="flex-1 bg-slate-50 p-3 rounded-lg">
                                <h5 className="font-bold text-sm mb-1">Career Paths</h5>
                                <p className="text-xs text-slate-500">{msg.data.career_paths.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (msg.type === 'docs') {
            return (
                <div className="bg-slate-50 rounded-lg p-3 space-y-2 max-w-md w-full mx-auto">
                    <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" /> Documentation</h4>
                    <div className="grid gap-2">
                        {msg.data.map((doc: any, i: number) => (
                            <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white p-2 rounded border hover:border-[#00a7ff] hover:bg-blue-50 transition-colors text-sm group">
                                <span className="text-slate-600">{doc.title}</span>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#00a7ff]" />
                            </a>
                        ))}
                    </div>
                </div>
            );
        }

        // Default text
        return <p className="text-sm whitespace-pre-wrap">{msg.content}</p>;
    };

    // Status Indicator Component
    const StatusIndicator = () => {
        if (connectionStatus === 'online') {
            return (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-slate-500">Online • Ready to assist</span>
                </div>
            );
        }
        if (connectionStatus === 'offline') {
            return (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-red-500">Offline • Connection lost</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs text-slate-500">Connecting...</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative">
            {/* Header */}
            <nav className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={"/navbarIcon.png"} alt="HHT Logo" className="h-8 w-auto transition-all duration-300 cursor-pointer hover:scale-105" />
                            <div className="absolute left-1/2 -translate-x-1/2 text-center">
                                <h2 className="font-bold text-slate-800 leading-tight text-sm sm:text-base">
                                    AI Counsellor
                                </h2>
                                <StatusIndicator />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-shrink-0">

    <Link
        to="/dashboard"
        className="
        flex items-center gap-2
        px-2 py-2 sm:px-4
        bg-sky-500 text-white
        rounded-lg
        hover:bg-sky-600
        transition
        text-xs sm:text-sm
        "
    >

        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />

        {/* Hide text on very small screens */}
        <span className="hidden sm:inline font-medium">
            Dashboard
        </span>

    </Link>

    <button
        onClick={toggleTTS}
        className={`
        flex items-center justify-center
        p-2 sm:p-2.5
        rounded-full
        transition-colors
        ${isTTSEnabled
            ? "bg-[#00a7ff] text-white"
            : "bg-slate-200 text-slate-500 hover:bg-slate-300"}
        `}
    >
        {isTTSEnabled
            ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
        }
    </button>

</div>
                            {sessionId && (
                                <button onClick={restartConversation} className="p-2 bg-slate-100 text-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors" title="Restart">
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto pt-24 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-4">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => {
                            const isSpecial = ['assessment', 'detailed-roadmap', 'docs'].includes(msg.type || '');

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-full ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-[#00a7ff]'}`}>
                                            {msg.sender === 'user'
                                                ? <User className="w-5 h-5 text-slate-600" />
                                                : <Bot className="w-5 h-5 text-white" />
                                            }
                                        </div>

                                        {/* Message Bubble / Card */}
                                        <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isSpecial ? 'bg-transparent shadow-none p-0' :
                                                    msg.sender === 'user' ? 'bg-[#00a7ff] text-white' : 'bg-white border border-slate-100 text-slate-700'
                                                }`}>
                                                {renderMessageContent(msg, idx)}
                                            </div>

                                            {/* Action Buttons Contextually attached to message */}
                                            {msg.sender === 'assistant' && showDomainButtons && idx === messages.length - 1 && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex flex-wrap gap-2 justify-start">
                                                    {['Backend', 'Frontend', 'Data Analytics', 'Machine Learning', 'DevOps', 'Cybersecurity'].map((domain) => (
                                                        <button key={domain} onClick={() => handleDomainSelection(domain.toLowerCase())}
                                                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-[#00a7ff] hover:text-white hover:border-transparent transition-all shadow-sm">
                                                            {domain}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}

                                            {msg.type === 'roadmap-option' && showRoadmapOption && idx === messages.length - 1 && (
                                                <div className="mt-3 flex gap-2">
                                                    <button onClick={() => handleRoadmapRequest(true)} className="flex items-center gap-2 px-4 py-2 bg-[#00a7ff] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md">
                                                        <CheckCircle className="w-4 h-4" /> Yes, show roadmap
                                                    </button>
                                                    <button onClick={() => handleRoadmapRequest(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                                                        No, thanks
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/*Typing Indicator*/}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#00a7ff] flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        disabled={!sessionId}
                        className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00a7ff] focus:border-transparent bg-slate-50 text-sm text-slate-700 placeholder-slate-400"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || !sessionId || isTyping}
                        className="p-3 bg-[#00a7ff] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CounsellorPage;