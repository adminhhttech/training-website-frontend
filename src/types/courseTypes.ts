// /src/types/courseTypes.ts

export interface BaseBlock {
    id: string;
    type: 'video' | 'mcq' | 'coding' | 'theory';
    title: string;
    duration?: string;
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    data: { url: string };
}

export interface MCQBlock extends BaseBlock {
    type: 'mcq';
    data: {
        question: string;
        options: string[];
        correctAnswerIndex: number;
    };
}

export interface CodingBlock extends BaseBlock {
    type: 'coding';
    data: {
        question: string;
        snippet: string;
        instructions: string[];
        language: string;
    };
}

export interface TheoryBlock extends BaseBlock {
    type: 'theory';
    data: {
        visualSummaryTitle?: string;
        content?: string;
    };
}

export type Block = VideoBlock | MCQBlock | CodingBlock | TheoryBlock;

// For the course structure
export interface Module {
    id: string;
    title: string;
    description?: string;
    content: Block[];
    completionPercentage?: number;
}

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor?: {
        name: string;
        avatar: string;
        bio: string;
    };
    prerequisites?: string[];
    modules: Module[];
    updatedAt?: string;
    participants?: number;
    duration?: string;
    collaborators?: string[];
    relatedCourses?: string[];
}