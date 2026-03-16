import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "@/services/api";

interface McqData {
    title: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

interface MCQBlock {
    id: string;
    data: McqData;
}

interface MCQLessonProps {
    block: MCQBlock;
    onComplete: (lessonId: string) => void;
}

interface AIQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

const MCQLesson = ({ block, onComplete }: MCQLessonProps) => {
    const [view, setView] = useState<"options" | "slides">("options");
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    
    // AI-generated question state
    const [aiQuestion, setAiQuestion] = useState<AIQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch AI-generated question on mount
    useEffect(() => {
        const fetchAIQuestion = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Use a more descriptive topic for better AI generation
                const topic = `${block.data.title} - OpenAI API programming`;
                console.log(`[MCQLesson] Fetching AI question for topic: "${topic}"`);
                
                const result = await api.generateLessonMCQ(topic);
                
                if (!result || !result.questions || result.questions.length === 0) {
                    throw new Error('AI API returned empty question data');
                }
                
                const aiQ = result.questions[0];
                const correctIndex = aiQ.options.findIndex(
                    opt => opt === aiQ.correct_answer
                );
                
                setAiQuestion({
                    question: aiQ.question,
                    options: aiQ.options,
                    correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0
                });
                
                console.log(`[MCQLesson] Successfully loaded AI question`);
            } catch (err) {
                console.error(`[MCQLesson] Failed to fetch AI question:`, err);
                setError(err instanceof Error ? err.message : 'Failed to load question');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAIQuestion();
    }, [block.data.title, block.id]);

    const handleRetry = () => {
        setSelectedOption(null);
        setSubmitted(false);
        setIsCorrect(null);
        setAiQuestion(null);
        setIsLoading(true);
        setError(null);
        
        // Re-trigger the useEffect by creating a micro-task
        setTimeout(() => {
            const fetchAIQuestion = async () => {
                try {
                    const topic = `${block.data.title} - OpenAI API programming`;
                    console.log(`[MCQLesson] Retrying AI question for topic: "${topic}"`);
                    
                    const result = await api.generateLessonMCQ(topic);
                    
                    if (!result || !result.questions || result.questions.length === 0) {
                        throw new Error('AI API returned empty question data');
                    }
                    
                    const aiQ = result.questions[0];
                    const correctIndex = aiQ.options.findIndex(
                        opt => opt === aiQ.correct_answer
                    );
                    
                    setAiQuestion({
                        question: aiQ.question,
                        options: aiQ.options,
                        correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0
                    });
                    
                    console.log(`[MCQLesson] Successfully loaded AI question on retry`);
                } catch (err) {
                    console.error(`[MCQLesson] Retry failed:`, err);
                    setError(err instanceof Error ? err.message : 'Failed to load question');
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchAIQuestion();
        }, 0);
    };

    const handleSubmit = () => {
        if (selectedOption === null || !aiQuestion) return;

        const correct = selectedOption === aiQuestion.correctAnswerIndex;

        setIsCorrect(correct);
        setSubmitted(true);

        // Mark lesson complete ONLY if correct
        if (correct) {
            onComplete(block.id);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <div>
                        <p className="text-lg font-semibold text-gray-900">Generating Question...</p>
                        <p className="text-sm text-gray-500">AI is creating a question about: {block.data.title}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4 max-w-md">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <div>
                        <p className="text-lg font-semibold text-gray-900">Failed to Load Question</p>
                        <p className="text-sm text-gray-500 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!aiQuestion) return null;

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL */}
            <div className="w-1/2 h-full bg-white border-r border-gray-200 p-12 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {block.data.title}
                </h1>
                <p className="text-gray-900 leading-relaxed">
                    {aiQuestion.question}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    AI Generated
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-1/2 h-full bg-gray-50 flex flex-col">
                {/* TABS */}
                <div className="flex bg-white border-b border-gray-200 shrink-0">
                    <button
                        onClick={() => setView("options")}
                        className={`px-6 py-4 text-xs font-bold border-b-2 transition ${view === "options"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-400"
                            }`}
                    >
                        OPTIONS
                    </button>

                    <button
                        onClick={() => setView("slides")}
                        className={`px-6 py-4 text-xs font-bold border-b-2 transition ${view === "slides"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-400"
                            }`}
                    >
                        SLIDES
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-8">
                    {view === "options" ? (
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-900">
                                    Possible answers
                                </h3>
                                <button
                                    onClick={handleRetry}
                                    className="text-xs text-gray-500 hover:text-primary flex items-center gap-1"
                                    title="Generate new question"
                                >
                                    <RefreshCw size={12} />
                                    New Question
                                </button>
                            </div>

                            {aiQuestion.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center p-4 bg-white border rounded-lg cursor-pointer transition
                                        ${submitted && index === aiQuestion.correctAnswerIndex
                                            ? "border-green-500 ring-1 ring-green-500"
                                            : submitted && index === selectedOption
                                                ? "border-red-500 ring-1 ring-red-500"
                                                : selectedOption === index
                                                    ? "border-primary ring-1 ring-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                        }
                                    `}
                                >
                                    <input
                                        type="radio"
                                        checked={selectedOption === index}
                                        disabled={submitted}
                                        onChange={() => setSelectedOption(index)}
                                        className="w-4 h-4 accent-primary"
                                    />

                                    <span className="ml-4 text-sm">
                                        {option}
                                    </span>
                                </label>
                            ))}

                            <div className="pt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null || submitted}
                                    className={`w-full py-3 rounded font-bold text-sm transition ${submitted
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        }`}
                                >
                                    Submit Answer
                                </button>
                            </div>

                            {submitted && (
                                <div
                                    className={`mt-4 p-3 rounded text-sm font-semibold flex items-center justify-center gap-2 ${isCorrect
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle size={18} strokeWidth={2.5} />
                                            Correct Answer!
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={18} strokeWidth={2.5} />
                                            Incorrect Answer
                                        </>
                                    )}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full bg-white rounded shadow-sm flex items-center justify-center text-gray-400">
                            Slide Content
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MCQLesson;