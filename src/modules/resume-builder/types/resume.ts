export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  photo?: string;
  summary: string;
  objective?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5 or percentage
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}


export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  awards: Award[];
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export type TemplateId =
  | 'professional'
  | 'modern'
  | 'creative'
  | 'executive'
  | 'minimalist'
  | 'compact'
  | 'classic'
  | 'tech'
  | 'academic'
  | 'elegant';

export const RESUME_TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: 'professional', name: 'Professional', description: 'Clean, traditional layout for corporate roles' },
  { id: 'modern', name: 'Modern', description: 'Two-column design with sidebar' },
  { id: 'creative', name: 'Creative', description: 'Bold design for standing out' },
  { id: 'executive', name: 'Executive', description: 'Elegant design for senior positions' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean layout with refined typography' },
  { id: 'compact', name: 'Compact', description: 'Space-efficient single page layout' },
  { id: 'classic', name: 'Classic', description: 'Traditional formal resume style' },
  { id: 'tech', name: 'Tech', description: 'Developer-focused with mono fonts' },
  { id: 'academic', name: 'Academic', description: 'Research and education focused' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated centered layout' },
];

export type SectionKey = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates' | 'awards';

export type VisibleSections = Record<SectionKey, boolean>;

export const DEFAULT_VISIBLE_SECTIONS: VisibleSections = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certificates: true,
  awards: true,
};

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certificates',
  'awards',
];

export interface ResumeSettings {
  template: TemplateId;
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  showPhoto: boolean;
  visibleSections: VisibleSections;
  sectionOrder: SectionKey[];
}

export const DEFAULT_COLOR_SCHEMES: ColorScheme[] = [
  // Minimal & Clean Color Schemes
  {
    id: 'black-white',
    name: 'Classic Black',
    primary: '#000000',
    secondary: '#374151',
    accent: '#6B7280',
    text: '#111827',
  },
  {
    id: 'slate',
    name: 'Slate Gray',
    primary: '#334155',
    secondary: '#475569',
    accent: '#64748B',
    text: '#1E293B',
  },
  {
    id: 'navy',
    name: 'Navy Blue',
    primary: '#1E3A5F',
    secondary: '#2C5282',
    accent: '#3B82F6',
    text: '#1E3A8A',
  },
  {
    id: 'brown',
    name: 'Warm Brown',
    primary: '#5D4037',
    secondary: '#795548',
    accent: '#8D6E63',
    text: '#3E2723',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primary: '#1A472A',
    secondary: '#2D5A3C',
    accent: '#22C55E',
    text: '#14532D',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primary: '#6B2138',
    secondary: '#8B3A52',
    accent: '#BE123C',
    text: '#4C0519',
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    primary: '#0F766E',
    secondary: '#14B8A6',
    accent: '#2DD4BF',
    text: '#134E4A',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primary: '#27272A',
    secondary: '#3F3F46',
    accent: '#52525B',
    text: '#18181B',
  },
];

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    title: 'Full Stack Developer',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    summary: 'Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about creating efficient, user-friendly solutions and leading development teams.',
    objective: 'Seeking a challenging role where I can leverage my technical expertise to drive innovation and deliver impactful products.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Corp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      current: true,
      description: [
        'Led development of microservices architecture serving 1M+ daily users',
        'Mentored team of 5 junior developers and conducted code reviews',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Collaborated with product team to define technical requirements',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Software Developer',
      location: 'New York, NY',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      current: false,
      description: [
        'Built responsive web applications using React and TypeScript',
        'Designed RESTful APIs with Node.js and Express',
        'Optimized database queries improving performance by 40%',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Boston, MA',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.8',
      achievements: ['Dean\'s List', 'Computer Science Excellence Award'],
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 95, category: 'Languages' },
    { id: '2', name: 'TypeScript', level: 90, category: 'Languages' },
    { id: '3', name: 'React', level: 92, category: 'Frameworks' },
    { id: '4', name: 'Node.js', level: 88, category: 'Frameworks' },
    { id: '5', name: 'Python', level: 75, category: 'Languages' },
    { id: '6', name: 'PostgreSQL', level: 80, category: 'Databases' },
    { id: '7', name: 'AWS', level: 70, category: 'Cloud' },
    { id: '8', name: 'Docker', level: 75, category: 'DevOps' },
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Built a full-featured e-commerce platform with real-time inventory management, payment processing, and analytics dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      link: 'github.com/johndoe/ecommerce',
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates and team features.',
      technologies: ['React', 'Firebase', 'Material-UI'],
    },
  ],
  certificates: [
    {
      id: '1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
    {
      id: '2',
      name: 'React Advanced Certification',
      issuer: 'Meta',
      date: '2022',
    },
  ],
  awards: [
    {
      id: '1',
      title: 'Best Innovation Award',
      issuer: 'Tech Corp Inc.',
      date: '2023',
      description: 'Recognized for developing automated testing framework',
    },
  ],
};
