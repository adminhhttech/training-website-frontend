import React from 'react';
import {
    ArrowLeft,
    Menu,
    ChevronLeft,
    ChevronRight,
    Globe,
    Smartphone,
    Bell,
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import MCQLesson from '../components/MCQLesson';
import TheoryLesson from '../components/TheoryLesson';
import CodingLesson from '../components/CodingLesson';

/* ================= TYPES ================= */

interface BaseBlock {
    id: string;
    type: 'video' | 'mcq' | 'coding' | 'theory';
}

interface VideoBlock extends BaseBlock {
    type: 'video';
    title?: string;
    data: { url: string };
}

interface MCQBlock extends BaseBlock {
    type: 'mcq';
    data: {
        title: string;
        question: string;
        options: string[];
        correctAnswerIndex: number;
    };
}

interface CodingBlock extends BaseBlock {
    type: 'coding';
    data: {
        title: string;
        question: string;
        snippet: string;
        instructions: string[];
        language: string;
        pdfPath?: string;
    };
}

interface TheoryBlock extends BaseBlock {
    type: 'theory';
    title?: string;
    data: {
        text: string;
        visualSummaryTitle?: string;
        items?: Array<{
            label: string;
            color: string;
            text: string;
            border: string;
        }>;
    };
}

type Block = VideoBlock | MCQBlock | CodingBlock | TheoryBlock;

/* ================= PROPS ================= */

interface LessonOverlayProps {
    block: Block | null;
    onClose: () => void;
    onComplete: (blockId: string) => void;
    onPrev?: () => void;
    onNext?: () => void;
}

/* ================= COMPONENT ================= */

const LessonOverlay: React.FC<LessonOverlayProps> = ({
    block,
    onClose,
    onComplete,
    onPrev,
    onNext,
}) => {
    if (!block) return null;

    const handleComplete = () => {
        onComplete(block.id);
    };

    const renderContent = (): React.ReactNode => {
        switch (block.type) {
            case 'video': {
                const videoBlock = block as VideoBlock;
                return (
                    <VideoPlayer
                        block={videoBlock}
                        onComplete={handleComplete}
                    />
                );
            }
            case 'mcq': {
                const mcqBlock = block as MCQBlock;
                return (
                    <MCQLesson
                        block={mcqBlock}
                        onComplete={handleComplete}
                    />
                );
            }
            case 'theory': {
                const theoryBlock = block as TheoryBlock;
                return (
                    <TheoryLesson
                        block={theoryBlock}
                        onComplete={handleComplete}
                    />
                );
            }
            case 'coding': {
                const codingBlock = block as CodingBlock;
                return (
                    <CodingLesson
                        block={codingBlock}
                        onComplete={handleComplete}
                    />
                );
            }
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200">
                <button
                    onClick={onClose}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </button>
                <div className="hidden md:flex border border-gray-200 rounded overflow-hidden">
                    <button
                        onClick={onPrev}
                        disabled={!onPrev}
                        aria-label="Previous lesson"
                        className={`px-3 py-2 border-r border-gray-200 ${onPrev ? "text-gray-400 hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"}`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-gray-50"
                    >
                        <Menu size={16} />
                        Course Outline
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!onNext}
                        aria-label="Next lesson"
                        className={`px-3 py-2 border-l border-gray-200 ${onNext ? "text-gray-400 hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-6 text-gray-400">
                    <Globe size={18} />
                    <Smartphone size={18} />
                    <Bell size={18} />
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                {renderContent()}
            </main>
        </div>
    );
};

export default LessonOverlay;
