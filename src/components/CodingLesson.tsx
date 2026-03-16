import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import { Code, Layers, RotateCcw, Play, CheckCircle, XCircle } from "lucide-react";

/* PDFJS WORKER */
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

/* ---------------- TYPES ---------------- */

interface CodingBlockData {
    title: string;
    question: string;
    snippet: string;
    instructions: string[];
    language: string;
    pdfPath?: string;
}

interface CodingBlock {
    data: CodingBlockData;
}

/* ---------------- JUDGE0 CONFIG ---------------- */

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_HEADERS = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "0625303a5amshf825dcf9c4c336dp1054edjsnc29e52e1a0f4",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

const languageMap: Record<string, number> = {
    javascript: 63,
    python: 71,
    cpp: 54,
    c: 50,
    java: 62,
};

/* ---------------- COMPONENT ---------------- */

interface CodingLessonProps {
    block: CodingBlock;
    onComplete: () => void;
}

const CodingLesson: React.FC<CodingLessonProps> = ({ block, onComplete }) => {
    const [view, setView] = useState<"editor" | "slides">("editor");
    const [code, setCode] = useState(block.data.snippet);

    /* TERMINAL STATE */
    const [output, setOutput] = useState("");
    const [running, setRunning] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [showResult, setShowResult] = useState<null | "success" | "error">(null);


    /* PDF STATE */
    const [rawPdfBytes, setRawPdfBytes] = useState<Uint8Array | null>(null);
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasError = (text: string) => {
        const t = text.toLowerCase();
        return (
            t.includes("error") ||
            t.includes("exception") ||
            t.includes("traceback") ||
            t.includes("compile") ||
            t.includes("failed") ||
            t.includes("runtime")
        );
    };

    const isErrorOutput = output && hasError(output);


    const submitCode = async () => {
        if (running) return;

        // Always run code first
        const resultOutput = await runCode();

        if (hasError(resultOutput)) {
            setShowResult("error");
        } else {
            setShowResult("success");
            onComplete();
        }

        setTimeout(() => setShowResult(null), 2000);
    };




    /* LOAD PDF */
    useEffect(() => {
        if (!block.data.pdfPath) return;

        setLoading(true);
        fetch(block.data.pdfPath)
            .then(res => res.arrayBuffer())
            .then(buf => {
                setRawPdfBytes(new Uint8Array(buf));
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load PDF");
                setLoading(false);
            });
    }, [block.data.pdfPath]);

    const pdfFile = useMemo(() => {
        if (!rawPdfBytes) return null;
        return { data: rawPdfBytes.slice().buffer };
    }, [rawPdfBytes]);

    const resetCode = () => {
        setCode(block.data.snippet);
        setOutput("");
    };

    /* ---------------- RUN CODE (JUDGE0) ---------------- */

    const runCode = async (): Promise<string> => {
        setRunning(true);
        setOutput("Running...\n");

        try {
            const res = await fetch(
                `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
                {
                    method: "POST",
                    headers: JUDGE0_HEADERS,
                    body: JSON.stringify({
                        language_id: languageMap[block.data.language] || 63,
                        source_code: btoa(code),
                    }),
                }
            );

            const { token } = await res.json();

            let result;
            while (true) {
                const check = await fetch(
                    `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
                    { headers: JUDGE0_HEADERS }
                );

                result = await check.json();
                if (result.status.id >= 3) break;
                await new Promise(r => setTimeout(r, 800));
            }

            const decode = (str?: string) => (str ? atob(str) : "");

            const finalOutput =
                decode(result.stdout) ||
                decode(result.stderr) ||
                decode(result.compile_output) ||
                "No output";

            setOutput(finalOutput);
            return finalOutput;
        } catch (err) {
            const msg = "Execution failed.";
            setOutput(msg);
            return msg;
        } finally {
            setRunning(false);
        }
    };


    /* AUTO SCROLL TERMINAL */
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    /* ---------------- UI ---------------- */

    return (
        <div className="flex h-full overflow-hidden">
            {/* LEFT PANEL */}
            <div className="w-1/2 p-8 overflow-y-auto bg-white border-r">
                <h1 className="text-2xl font-bold mb-4">{block.data.title}</h1>
                <p className="mb-6">{block.data.question}</p>

                <h3 className="font-bold mb-2">Instructions</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                    {block.data.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ul>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-1/2 flex flex-col bg-[#011627] text-white relative">
                {/* TABS */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setView("editor")}
                        className={`px-6 py-4 text-xs font-bold border-b-2 ${view === "editor" ? "border-white" : "border-transparent text-gray-400"
                            }`}
                    >
                        <Code size={14} className="inline mr-2" />
                        SOLUTION
                    </button>

                    <button
                        onClick={() => setView("slides")}
                        className={`px-6 py-4 text-xs font-bold border-b-2 ${view === "slides" ? "border-white" : "border-transparent text-gray-400"
                            }`}
                    >
                        <Layers size={14} className="inline mr-2" />
                        SLIDES
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-hidden">
                    {view === "editor" ? (
                        <div className="flex flex-col h-full">
                            {/* EDITOR */}
                            <div className="flex-1">
                                <Editor
                                    height="100%"
                                    language={block.data.language}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(v) => setCode(v || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        automaticLayout: true,
                                    }}
                                />
                            </div>

                            <div className="flex items-center gap-3 px-3 py-2 bg-[#0b253a] border-t border-white/10">
                                <button
                                    onClick={resetCode}
                                    className="p-2 bg-white/10 rounded hover:bg-white/20 transition"
                                >
                                    <RotateCcw size={16} />
                                </button>

                                <button
                                    onClick={runCode}
                                    disabled={running}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 transition"
                                >
                                    <Play size={14} />
                                    {running ? "Running..." : "Run"}
                                </button>

                                <button
                                    onClick={submitCode}
                                    disabled={running}
                                    className="px-4 py-1.5 bg-[#0080ff] rounded font-semibold hover:bg-[#006be0] transition"
                                >
                                    Submit
                                </button>
                            </div>

                            {/* TERMINAL */}
                            {/* TERMINAL HEADER */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#071b2c] border-t border-white/10 text-xs text-gray-400">
                                <span className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                </span>
                                <span className="ml-2 tracking-widest">TERMINAL</span>
                            </div>

                            {/* TERMINAL BODY */}
                            <div
                                ref={terminalRef}
                                className={`h-40 bg-black font-mono text-sm p-3 overflow-y-auto border-t border-white/10 ${isErrorOutput ? "text-red-400" : "text-green-400"
                                    }`}
                            >
                                <pre className="whitespace-pre-wrap leading-relaxed">
                                    {output || "› Ready"}
                                </pre>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            {loading && (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    Loading PDF…
                                </div>
                            )}

                            {pdfFile && (
                                <div className="flex-1 overflow-auto p-4 flex justify-center">
                                    <Document
                                        file={pdfFile}
                                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {Array.from({ length: numPages }, (_, i) => (
                                                <Page
                                                    key={i}
                                                    pageNumber={i + 1}
                                                    width={560}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                />
                                            ))}
                                        </div>
                                    </Document>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                {showResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                        <div
                            className={`px-10 py-8 rounded-2xl flex flex-col items-center gap-3
                                        animate-scaleIn
                                        ${showResult === "success"
                                    ? "bg-green-500/90"
                                    : "bg-red-500/90"
                                }`}
                        >
                            {showResult === "success" ? (
                                <CheckCircle size={64} strokeWidth={2.5} className="text-white" />
                            ) : (
                                <XCircle size={64} strokeWidth={2.5} className="text-white" />
                            )}

                            <div className="text-lg font-bold">
                                {showResult === "success"
                                    ? "Correct Code!"
                                    : "Wrong Code"}
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default CodingLesson;
