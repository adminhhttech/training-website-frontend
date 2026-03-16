// Types for AI Resume Generation

export interface AIGenerationInput {
  // Step 1: Basic Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  
  // Step 2: Career Details
  targetJobTitle: string;
  yearsOfExperience: string;
  industry: string;
  
  // Step 3: Skills
  keySkills: string[];
  
  // Step 4: Experience Highlights
  numberOfPositions: number;
  achievements?: string;
  notableCompanies?: string;
  
  // Step 5: Education & Extras
  educationLevel: string;
  certifications?: string;
  languages?: string;
}

export const DEFAULT_AI_INPUT: AIGenerationInput = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  targetJobTitle: '',
  yearsOfExperience: '',
  industry: '',
  keySkills: [],
  numberOfPositions: 2,
  achievements: '',
  notableCompanies: '',
  educationLevel: '',
  certifications: '',
  languages: '',
};

export type GenerationStep = 
  | 'idle'
  | 'generating-summary'
  | 'generating-experience'
  | 'generating-education'
  | 'generating-skills'
  | 'generating-projects'
  | 'complete';

export interface GenerationState {
  step: GenerationStep;
  progress: number;
  currentSection: string;
}
