import React from 'react';
import { Layers } from 'lucide-react';

interface TheoryItem {
    label: string;
    color: string;
    text: string;
    border: string;
}

interface TheoryBlock {
    id: string;
    type: 'theory';
    title?: string;
    data: {
        text: string;
        visualSummaryTitle?: string;
        items?: TheoryItem[];
    };
}

interface TheoryLessonProps {
    block: TheoryBlock;
    onComplete: () => void;
}

const TheoryLesson: React.FC<TheoryLessonProps> = ({ block, onComplete }) => {
    return (
        <div className="flex-1 flex overflow-hidden">
            {/* LEFT SIDE: TEXT CONTENT */}
            <div className="w-1/2 h-full bg-white border-r border-gray-200 p-12 overflow-y-auto">
                <div className="max-w-xl mx-auto flex flex-col h-full">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-8 leading-tight">
                            {block.title ?? 'Lesson'}
                        </h1>

                        <div className="prose prose-slate">
                            <p className="text-lg text-gray-900 leading-relaxed whitespace-pre-wrap">
                                {block.data.text}
                            </p>
                        </div>
                    </div>

                    {/* COMPLETE BUTTON */}
                    <div className="mt-10 pt-6">
                        <button
                            onClick={onComplete}
                            className="bg-[#0080ff] hover:bg-[#006be6] text-white font-bold text-sm px-10 py-3 rounded transition"
                        >
                            Got It!
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: VISUAL SUMMARY */}
            <div className="w-1/2 h-full bg-gray-50 flex flex-col relative">
                <div className="flex bg-white border-b border-gray-200 shrink-0">
                    <div className="px-6 py-4 text-xs font-bold text-[#0080ff] border-b-2 border-[#0080ff] flex items-center gap-2 uppercase tracking-wider">
                        <Layers size={14} />
                        {block.data.visualSummaryTitle || 'Visual Summary'}
                    </div>
                </div>

                <div className="flex-1 p-12 flex items-center justify-center">
                    <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 p-8 flex flex-col space-y-6">
                        <div className="space-y-2 text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {block.data.visualSummaryTitle || 'Overview'}
                            </div>
                            <div className="h-1 w-12 bg-[#0080ff] mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {block.data.items ? (
                                block.data.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-lg text-sm font-mono border ${item.color} ${item.text} ${item.border} transition-transform hover:scale-[1.02]`}
                                    >
                                        {item.label}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center text-gray-400 italic text-sm">
                                    Visual elements will be displayed here.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheoryLesson;