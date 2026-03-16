

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Loader2, Sparkles, CheckCircle2, XCircle, Lightbulb, RotateCcw, Play } from "lucide-react"

import api, { type AIGeneratedTest } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

export function PracticeSection() {
    const { user } = useAuth()
    const userId = user?.id || ""

    // -- Form State --
    const [topic, setTopic] = useState("")
    const [numQuestions, setNumQuestions] = useState(5)

    // -- Test State --
    const [testData, setTestData] = useState<AIGeneratedTest | null>(null)
    const [isLoadingTest, setIsLoadingTest] = useState(false)
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    // -- Explanation State --
    const [explanations, setExplanations] = useState<Record<number, string>>({})
    const [isLoadingExplanations, setIsLoadingExplanations] = useState(false)
    
    // -- Video Explanation State --
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<Record<number, boolean>>({})
    const [videoData, setVideoData] = useState<Record<number, any>>({})

    const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number.parseInt(e.target.value)
        if (isNaN(val)) val = 1
        if (val > 30) val = 30
        if (val < 1) val = 1
        setNumQuestions(val)
    }

    const handleGenerateTest = async () => {
        if (!topic.trim()) {
            toast({
                variant: "destructive",
                title: "Topic Required",
                description: "Please enter a topic to generate questions.",
            })
            return
        }

        setIsLoadingTest(true)
        setTestData(null)
        setUserAnswers({})
        setIsSubmitted(false)
        setExplanations({})

        try {
            const data = await api.generateMockTest(topic, numQuestions)
            setTestData(data)
            toast({
                title: "Test Generated Successfully",
                description: `Generated ${data.questions.length} questions on ${topic}.`,
            })
        } catch (error: any) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: error.message || "Could not generate questions. Please try again.",
            })
        } finally {
            setIsLoadingTest(false)
        }
    }

    const handleOptionSelect = (questionId: number, value: string) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }))
    }

    const handleSubmit = async () => {
        if (!testData) return

        const unanswered = testData.questions.filter((q) => !userAnswers[q.id])
        if (unanswered.length > 0) {
            toast({
                variant: "destructive",
                title: "Incomplete Test",
                description: `Please answer all ${unanswered.length} remaining questions.`,
            })
            return
        }

        setIsSubmitted(true)

        // Calculate correct answers
        let correctCount = 0
        testData.questions.forEach((q) => {
            if (userAnswers[q.id] === q.correct_answer) {
                correctCount++
            }
        })

        if (userId) {
            try {
                const success = await api.addActivity({
                    userId: userId,
                    testsCompleted: 1,
                    questionsAttempted: testData.questions.length,
                    correctAnswers: correctCount,
                    topic: topic.trim(),
                })

                if (success) {
                    toast({
                        title: "Activity Recorded",
                        description: `Your practice session has been saved. ${correctCount}/${testData.questions.length} correct!`,
                    })
                }
            } catch (error) {
                console.error("Failed to save activity:", error)
            }
        }
    }

    const handleGenerateExplanations = async () => {
        if (!testData) return

        setIsLoadingExplanations(true)
        setExplanations({})

        for (const question of testData.questions) {
            const userAnswer = userAnswers[question.id]
            if (!userAnswer) continue

            try {
                const response = await api.explainWrongAnswer(question.question, userAnswer, question.correct_answer)
                setExplanations((prev) => ({
                    ...prev,
                    [question.id]: response.explanation.explanation,
                }))
            } catch (error) {
                console.error(`Failed to explain Q${question.id}:`, error)
            }

            await new Promise((resolve) => setTimeout(resolve, 500))
        }

        setIsLoadingExplanations(false)
        toast({
            title: "Explanations Ready",
            description: "AI explanations have been generated for your review.",
        })
    }
    
    const generateVideoExplanation = async (questionId: number, question: string, userAnswer: string, correctAnswer: string, explanation: string) => {
        setIsGeneratingVideo(prev => ({ ...prev, [questionId]: true }))
        
        try {
            // Create a comprehensive topic for video generation
            const videoTopic = `Question: ${question}\n\nYour Answer: ${userAnswer}\nCorrect Answer: ${correctAnswer}\n\nExplanation: ${explanation}`
            
            const response = await fetch('https://hht-training-backend.space/mock-test-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: videoTopic
                })
            })



            const result = await response.json()
            
            console.log('Video generation response:', result);
            
            if (result.status === 'success') {
                const videoUrl = `https://hht-training-backend.space${result.video_url}`
                console.log('Setting video URL:', videoUrl);
                setVideoData(prev => ({ 
                    ...prev, 
                    [questionId]: { 
                        videoUrl,
                        hasVideo: true
                    } 
                }))
                
                toast({
                    title: "Video Generated!",
                    description: "Your video explanation is ready to watch.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Generation Failed",
                    description: result.message || "Failed to generate video",
                })
            }
        } catch (error) {
            console.error('Video generation error:', error)
            toast({
                variant: "destructive",
                title: "Connection Error",
                description: "Make sure the NewVidGen backend is running on port 8000",
            })
        } finally {
            setIsGeneratingVideo(prev => ({ ...prev, [questionId]: false }))
        }
    }

    const handleReset = () => {
        setTestData(null)
        setUserAnswers({})
        setIsSubmitted(false)
        setExplanations({})
        setTopic("")
    }

    const calculateScore = () => {
        if (!testData) return 0
        let correct = 0
        testData.questions.forEach((q) => {
            if (userAnswers[q.id] === q.correct_answer) {
                correct++
            }
        })
        return correct
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* --- INPUT PHASE --- */}
            {!testData && (
                <Card className="shadow-lg border-[#0080ff]/20">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Sparkles className="text-[#0080ff]" /> AI Mock Test Generator
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Enter a topic and the number of questions (max 30) to create a custom quiz instantly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                placeholder="e.g., React Hooks, World History, Organic Chemistry"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={isLoadingTest}
                                className="focus-visible:ring-[#0080ff]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numQuestions">Number of Questions</Label>
                            <Input
                                id="numQuestions"
                                type="number"
                                min="1"
                                max="30"
                                value={numQuestions}
                                onChange={handleNumQuestionsChange}
                                disabled={isLoadingTest}
                                className="focus-visible:ring-[#0080ff]"
                            />
                        </div>

                        <Button
                            onClick={handleGenerateTest}
                            disabled={isLoadingTest || !topic}
                            className="w-full md:w-auto bg-[#0080ff] hover:bg-[#0066cc] text-white"
                            size="lg"
                        >
                            {isLoadingTest ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" /> Generate Test
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* --- QUIZ & RESULTS PHASE --- */}
            {testData && (
                <div className="space-y-6 pb-24">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{testData.test_name || "AI Generated Test"}</h2>
                            <p className="text-muted-foreground">
                                Topic: {testData.topics.join(", ")} | {testData.total_questions} Questions
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {!isSubmitted && (
                                <Button variant="outline" onClick={handleReset}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {isSubmitted && (
                        <Card className="bg-[#0080ff]/5 border-[#0080ff]/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="text-2xl font-bold">
                                        Your Score:{" "}
                                        <span className="text-[#0080ff]">
                                            {calculateScore()} / {testData.total_questions}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleGenerateExplanations}
                                            disabled={isLoadingExplanations}
                                            className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                                        >
                                            {isLoadingExplanations ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Lightbulb className="mr-2 h-4 w-4" />
                                            )}
                                            {isLoadingExplanations ? "Analyzing..." : "Get Explanations"}
                                        </Button>
                                        <Button onClick={handleReset} variant="outline">
                                            Start New Test
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-4">
                        {testData.questions.map((q, index) => {
                            const isCorrect = userAnswers[q.id] === q.correct_answer
                            const hasExplanation = !!explanations[q.id]

                            return (
                                <Card key={q.id} className="overflow-hidden">
                                    <CardHeader className="pb-3 bg-muted/30">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0080ff]/10 text-[#0080ff] text-xs font-bold">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg leading-relaxed">{q.question}</CardTitle>
                                            </div>
                                            {isSubmitted && (
                                                <Badge
                                                    variant={isCorrect ? "default" : "destructive"}
                                                    className={isCorrect ? "bg-[#3dd223] text-white shrink-0" : "bg-red-500 text-white shrink-0"}
                                                >
                                                    {isCorrect ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                                    {isCorrect ? "Correct" : "Incorrect"}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-4">
                                        <RadioGroup
                                            value={userAnswers[q.id]}
                                            onValueChange={(val) => !isSubmitted && handleOptionSelect(q.id, val)}
                                            disabled={isSubmitted}
                                        >
                                            {q.options.map((option, optIndex) => {
                                                let optionClass = ""
                                                if (isSubmitted) {
                                                    if (option === q.correct_answer)
                                                        optionClass = "text-green-600 font-semibold border-green-200 bg-green-50/50"
                                                    else if (option === userAnswers[q.id] && !isCorrect)
                                                        optionClass = "text-red-600 font-semibold border-red-200 bg-red-50/50"
                                                    else optionClass = "text-muted-foreground opacity-60"
                                                }

                                                return (
                                                    <div key={optIndex} className="flex items-center space-x-2 mb-2">
                                                        <RadioGroupItem value={option} id={`q${q.id}-opt${optIndex}`} />
                                                        <Label
                                                            htmlFor={`q${q.id}-opt${optIndex}`}
                                                            className={`flex-1 cursor-pointer p-2 rounded-md border border-transparent hover:bg-accent transition-colors ${optionClass}`}
                                                        >
                                                            {option}
                                                        </Label>
                                                    </div>
                                                )
                                            })}
                                        </RadioGroup>

                                        {isSubmitted && hasExplanation && (
                                            <div className="mt-4 p-4 bg-[#0080ff]/5 border border-[#0080ff]/20 rounded-md">
                                                <div className="flex items-center gap-2 mb-1 text-[#0080ff] font-semibold">
                                                    <Lightbulb className="h-4 w-4" /> Explanation
                                                </div>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                    {explanations[q.id]}
                                                </p>
                                                
                                                {/* Video Explanation Button - For all questions */}
                                                <div className="mt-4">
                                                    <Button 
                                                        onClick={() => generateVideoExplanation(
                                                            q.id, 
                                                            q.question, 
                                                            userAnswers[q.id] || '', 
                                                            q.correct_answer, 
                                                            explanations[q.id] || ''
                                                        )}
                                                        disabled={isGeneratingVideo[q.id]}
                                                        className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                                                        size="sm"
                                                    >
                                                        {isGeneratingVideo[q.id] ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play className="mr-2 h-4 w-4" />
                                                                Video Explanation
                                                            </>
                                                        )}
                                                    </Button>

                                                    {/* Video Player for Generated Explanation */}
                                                    {videoData[q.id]?.hasVideo && (
                                                        <div className="mt-4">
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                                <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                                                    📹 Video Explanation
                                                                </h4>
                                                                <video 
                                                                    src={videoData[q.id].videoUrl}
                                                                    controls 
                                                                    className="w-full rounded-lg"
                                                                    style={{maxHeight: '400px'}}
                                                                >
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {!isSubmitted && (
                        <div className="mt-6 flex justify-center">
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                className="min-w-[200px] bg-[#0080ff] hover:bg-[#0066cc] text-white"
                            >
                                Submit Test
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


