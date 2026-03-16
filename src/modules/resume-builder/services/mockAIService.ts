// Mock AI Service for Resume Generation
// This will be replaced with actual backend calls later

import { AIGenerationInput } from '../types/ai-generation';
import { ResumeData, Experience, Education, Skill, Project, Certificate } from '../types/resume';

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock data generators based on user input
function generateSummary(input: AIGenerationInput): string {
  const experienceText = input.yearsOfExperience 
    ? `with ${input.yearsOfExperience}+ years of experience` 
    : '';
  
  const skillsText = input.keySkills.length > 0 
    ? `Proficient in ${input.keySkills.slice(0, 3).join(', ')}` 
    : '';
  
  return `Results-driven ${input.targetJobTitle} ${experienceText} in the ${input.industry} industry. ${skillsText}. Passionate about delivering high-quality solutions and driving business growth through innovative approaches and collaborative teamwork.`;
}

function generateExperience(input: AIGenerationInput): Experience[] {
  const companies = input.notableCompanies?.split(',').map(c => c.trim()).filter(Boolean) || [
    'Tech Solutions Inc.',
    'Digital Innovations Corp.',
    'Global Systems Ltd.',
  ];
  
  const experiences: Experience[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < input.numberOfPositions; i++) {
    const isFirst = i === 0;
    const yearsAgo = i * 2 + 1;
    
    experiences.push({
      id: generateId(),
      company: companies[i] || `Company ${i + 1}`,
      position: isFirst ? `Senior ${input.targetJobTitle}` : input.targetJobTitle,
      location: input.location || 'Remote',
      startDate: `Jan ${currentYear - yearsAgo - 1}`,
      endDate: isFirst ? 'Present' : `Dec ${currentYear - yearsAgo}`,
      current: isFirst,
      description: [
        `Led key initiatives and projects in the ${input.industry} sector`,
        `Utilized ${input.keySkills.slice(0, 2).join(' and ') || 'technical skills'} to deliver impactful solutions`,
        `Collaborated with cross-functional teams to achieve business objectives`,
        isFirst ? 'Mentored junior team members and conducted code reviews' : 'Contributed to team success through collaborative problem-solving',
      ],
    });
  }
  
  return experiences;
}

function generateEducation(input: AIGenerationInput): Education[] {
  const degreeMap: Record<string, { degree: string; field: string }> = {
    'high_school': { degree: 'High School Diploma', field: 'General Studies' },
    'associate': { degree: 'Associate Degree', field: 'Computer Science' },
    'bachelor': { degree: 'Bachelor of Science', field: 'Computer Science' },
    'master': { degree: 'Master of Science', field: 'Computer Science' },
    'phd': { degree: 'Doctor of Philosophy', field: 'Computer Science' },
  };
  
  const eduLevel = degreeMap[input.educationLevel] || degreeMap['bachelor'];
  
  return [{
    id: generateId(),
    institution: 'State University',
    degree: eduLevel.degree,
    field: eduLevel.field,
    location: 'New York, NY',
    startDate: '2014',
    endDate: '2018',
    gpa: '3.7',
    achievements: ['Dean\'s List', 'Academic Excellence Award'],
  }];
}

function generateSkills(input: AIGenerationInput): Skill[] {
  const userSkills = input.keySkills.map((skill, index) => ({
    id: generateId(),
    name: skill,
    level: Math.max(70, 95 - index * 5),
    category: 'Technical',
  }));
  
  // Add some default soft skills if we don't have many
  if (userSkills.length < 5) {
    const softSkills = ['Problem Solving', 'Team Leadership', 'Communication', 'Project Management'];
    softSkills.slice(0, 5 - userSkills.length).forEach(skill => {
      userSkills.push({
        id: generateId(),
        name: skill,
        level: Math.floor(Math.random() * 20) + 75,
        category: 'Soft Skills',
      });
    });
  }
  
  return userSkills;
}

function generateProjects(input: AIGenerationInput): Project[] {
  const technologies = input.keySkills.slice(0, 4);
  
  return [
    {
      id: generateId(),
      name: `${input.industry} Management Platform`,
      description: `Developed a comprehensive management solution for the ${input.industry} industry with real-time analytics and reporting capabilities.`,
      technologies,
      link: '',
    },
    {
      id: generateId(),
      name: 'Process Automation Tool',
      description: `Created an automation tool that streamlined workflows and increased team productivity by 40%.`,
      technologies: technologies.slice(0, 2),
      link: '',
    },
  ];
}

function generateCertificates(input: AIGenerationInput): Certificate[] {
  if (!input.certifications) return [];
  
  const certs = input.certifications.split(',').map(c => c.trim()).filter(Boolean);
  
  return certs.map(cert => ({
    id: generateId(),
    name: cert,
    issuer: 'Professional Certification Board',
    date: '2023',
    link: '',
  }));
}

// Main generation function with streaming simulation
export async function generateResumeWithAI(
  input: AIGenerationInput,
  onProgress: (section: string, data: Partial<ResumeData>) => void
): Promise<ResumeData> {
  const resumeData: Partial<ResumeData> = {
    personalInfo: {
      fullName: input.fullName,
      title: input.targetJobTitle,
      email: input.email,
      phone: input.phone,
      location: input.location,
      linkedin: input.linkedin || '',
      github: '',
      website: '',
      photo: '',
      summary: '',
      objective: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    awards: [],
  };
  
  // Step 1: Generate Summary (with typing effect simulation)
  await delay(800);
  const summary = generateSummary(input);
  resumeData.personalInfo!.summary = summary;
  onProgress('summary', { personalInfo: resumeData.personalInfo });
  
  // Step 2: Generate Experience
  await delay(1200);
  resumeData.experience = generateExperience(input);
  onProgress('experience', { experience: resumeData.experience });
  
  // Step 3: Generate Education
  await delay(800);
  resumeData.education = generateEducation(input);
  onProgress('education', { education: resumeData.education });
  
  // Step 4: Generate Skills
  await delay(600);
  resumeData.skills = generateSkills(input);
  onProgress('skills', { skills: resumeData.skills });
  
  // Step 5: Generate Projects
  await delay(1000);
  resumeData.projects = generateProjects(input);
  onProgress('projects', { projects: resumeData.projects });
  
  // Step 6: Generate Certificates
  await delay(400);
  resumeData.certificates = generateCertificates(input);
  onProgress('certificates', { certificates: resumeData.certificates });
  
  return resumeData as ResumeData;
}

// Streaming text simulation for typing effect
export async function* streamText(text: string, charDelay: number = 20): AsyncGenerator<string> {
  let result = '';
  for (const char of text) {
    result += char;
    yield result;
    await delay(charDelay);
  }
}
