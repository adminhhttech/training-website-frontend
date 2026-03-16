
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIGenerationInput, DEFAULT_AI_INPUT } from '../../types/ai-generation';
import { ResumeData, Experience, Education, Skill, Project, Award, Certificate } from '../../types/resume';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Plus,
  User,
  Briefcase,
  Code,
  GraduationCap,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Target,
  Clock,
  Building2,
  Award as AwardIcon,
  Languages,
  CheckCircle2,
  Trash2,
  FolderOpen,
  Link
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface APIResumeResponse {
  success: boolean;
  provider: string;
  resume: {
    name: string;
    contact: {
      email: string;
      phone: string;
    };
    summary: string;
    skills: (string | { name: string })[];
    experience: Array<{
      title: string;
      company: string;
      dates: string;
      description: string | string[];
    }>;
    projects: Array<{
      title?: string;
      name?: string;
      description: string;
      technologies?: string | string[];
      link?: string;
    }>;
    achievements: (string | { title: string })[];
    education: Array<{
      degree: string | { name: string };
      institution: string;
      dates: string;
    }>;
  };
}

interface AIGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: ResumeData) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

import { Trophy } from 'lucide-react';

// Interface for the AI payload
interface AIResumePayload {
  name: string;
  email: string;
  phone: string;
  jobDescription: string;
  education?: string;
  certifications?: string;
  experience?: string;
  skills?: string[];
  projects?: string;
  achievements?: string;
  instructions?: string;
  targetRole?: string;
  yearsExperience?: string;
  industry?: string;
}

const STEPS = [
  { id: 1, title: 'About You', icon: User, description: 'Basic information' },
  { id: 2, title: 'Career Goal', icon: Target, description: 'Your target role' },
  { id: 3, title: 'Skills', icon: Code, description: 'Key competencies' },
  { id: 4, title: 'Experience', icon: Briefcase, description: 'Work history' },
  { id: 5, title: 'Education', icon: GraduationCap, description: 'Qualifications' },
  { id: 6, title: 'Projects', icon: FolderOpen, description: 'Portfolio work' },
  { id: 7, title: 'Awards', icon: Trophy, description: 'Achievements' },
];

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Consulting',
  'E-commerce',
  'Manufacturing',
  'Real Estate',
  'Other',
];

const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
];

const SUGGESTED_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS',
  'Project Management', 'Data Analysis', 'Communication', 'Leadership',
  'Problem Solving', 'Agile/Scrum', 'UI/UX Design', 'Marketing',
];

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to parse date range like "May 2023 - August 2023" or "2024-2028"
const parseDateRange = (dates: string): { startDate: string; endDate: string } => {
  const parts = dates.split(/\s*[-–]\s*/);
  return {
    startDate: parts[0]?.trim() || '',
    endDate: parts[1]?.trim() || 'Present'
  };
};

// Structured Education Entry
interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

// Structured Experience Entry
interface ExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  achievements: string;
}

// Structured Certification Entry
interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

// Structured Project Entry
interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

// Structured Award Entry
interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

// Map API response to ResumeData format with defensive checks
// ONLY include sections that user actually provided data for
const mapAPIResponseToResumeData = (
  apiResponse: APIResumeResponse,
  collectedData: CollectedDataType
): ResumeData => {
  const resume = apiResponse.resume;

  // Map experience ONLY if user provided experience entries
  const experience: Experience[] = collectedData.experiences.length > 0
    ? (resume.experience || []).map(exp => {
      const { startDate, endDate } = parseDateRange(exp.dates || '');
      const rawDescription = exp.description;

      let descriptionArray: string[] = [];
      if (Array.isArray(rawDescription)) {
        descriptionArray = rawDescription.filter(s => typeof s === 'string' && s.trim());
      } else if (typeof rawDescription === 'string' && rawDescription.trim()) {
        descriptionArray = rawDescription.split('. ').filter(s => s.trim());
      }

      return {
        id: generateId(),
        company: exp.company || '',
        position: exp.title || '',
        startDate,
        endDate,
        current: endDate.toLowerCase() === 'present',
        description: descriptionArray
      };
    })
    : [];

  // Map education ONLY if user provided education entries
  const education: Education[] = collectedData.educationEntries.length > 0
    ? (resume.education || []).map(edu => {
      const { startDate, endDate } = parseDateRange(edu.dates || '');
      const degreeText = typeof edu.degree === 'string' ? edu.degree : String(edu.degree || '');
      const degreeParts = degreeText.includes(' in ') ? degreeText.split(' in ') : [degreeText, ''];
      return {
        id: generateId(),
        institution: edu.institution || '',
        degree: degreeParts[0] || degreeText,
        field: degreeParts[1] || '',
        startDate,
        endDate,
        gpa: '',
        achievements: []
      };
    })
    : [];

  // Map skills ONLY if user provided skills
  const skills: Skill[] = collectedData.keySkills.length > 0
    ? (resume.skills || []).map(skill => ({
      id: generateId(),
      name: typeof skill === 'string' ? skill : (skill?.name || String(skill)),
      level: 4,
      category: 'Technical'
    }))
    : [];

  // Map projects ONLY if user provided project entries
  const projects: Project[] = collectedData.projectEntries.length > 0
    ? (resume.projects || []).map(proj => {
      const rawTech = proj.technologies;
      let techArray: string[] = [];
      if (Array.isArray(rawTech)) {
        techArray = rawTech.filter(t => typeof t === 'string');
      } else if (typeof rawTech === 'string' && rawTech.trim()) {
        techArray = rawTech.split(',').map(t => t.trim()).filter(Boolean);
      }

      return {
        id: generateId(),
        name: proj.title || proj.name || '',
        description: typeof proj.description === 'string' ? proj.description : String(proj.description || ''),
        technologies: techArray,
        link: proj.link || ''
      };
    })
    : [];

  // Map awards ONLY if user provided award entries
  const awards: Award[] = collectedData.awardEntries.length > 0
    ? (resume.achievements || []).map(achievement => ({
      id: generateId(),
      title: typeof achievement === 'string' ? achievement : String(achievement),
      issuer: '',
      date: '',
      description: ''
    }))
    : [];

  // ✅ CRITICAL FIX: Map certifications FROM USER INPUT
  const certificates: Certificate[] = collectedData.certifications
    .filter(cert => cert.name.trim() && cert.issuer.trim())
    .map(cert => ({
      id: generateId(),
      name: cert.name,
      issuer: cert.issuer,
      date: cert.year || '',
      url: ''
    }));

  return {
    personalInfo: {
      fullName: resume.name || collectedData.fullName || '',
      title: collectedData.targetJobTitle || '',
      email: resume.contact?.email || collectedData.email || '',
      phone: resume.contact?.phone || collectedData.phone || '',
      location: collectedData.location || '',
      website: '',
      linkedin: collectedData.linkedin || '',
      github: '',
      summary: resume.summary || '',
      objective: ''
    },
    experience,
    education,
    skills,
    projects,
    certificates,
    awards
  };
};

interface CollectedDataType {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  targetJobTitle: string;
  yearsOfExperience: string;
  industry: string;
  keySkills: string[];
  experiences: ExperienceEntry[];
  educationEntries: EducationEntry[];
  certifications: CertificationEntry[];
  projectEntries: ProjectEntry[];
  awardEntries: AwardEntry[];
  languages: string;
}

export function AIGenerationModal({ open, onOpenChange, onGenerate, isGenerating, setIsGenerating }: AIGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(DEFAULT_AI_INPUT);
  const [skillInput, setSkillInput] = useState('');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  const [collectedData, setCollectedData] = useState<CollectedDataType>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    targetJobTitle: '',
    yearsOfExperience: '',
    industry: '',
    keySkills: [],
    experiences: [],
    educationEntries: [],
    certifications: [],
    projectEntries: [],
    awardEntries: [],
    languages: ''
  });

  const [formattedResumeData, setFormattedResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    certifications: '', // ✅ NEW: Separate certifications field
    experience: '',
    skills: [] as string[],
    projects: '',
    achievements: '',
    jobDescription: ''
  });

  const updateField = <K extends keyof CollectedDataType>(field: K, value: CollectedDataType[K]) => {
    setCollectedData(prev => {
      const updated = { ...prev, [field]: value };
      updateFormattedData(updated);
      return updated;
    });
  };

  // ✅ UPDATED: Separate certifications from education
  const updateFormattedData = (data: CollectedDataType) => {
    // Format education entries ONLY (no certifications/languages)
    const educationString = data.educationEntries.length > 0
      ? data.educationEntries.map(edu =>
        `${edu.degree}${edu.field ? ` in ${edu.field}` : ''} from ${edu.institution} (${edu.graduationYear})`
      ).join('; ')
      : '';

    // Format certifications SEPARATELY
    const certificationsString = data.certifications.length > 0
      ? data.certifications.map(c => `${c.name} from ${c.issuer} (${c.year})`).join(', ')
      : '';

    const experienceString = data.experiences.length > 0
      ? data.experiences.map(exp =>
        `${exp.jobTitle} at ${exp.company} (${exp.startYear}-${exp.isCurrent ? 'Present' : exp.endYear}): ${exp.achievements || 'Various responsibilities'}`
      ).join('; ')
      : '';

    const projectsString = data.projectEntries.length > 0
      ? data.projectEntries.map(proj =>
        `${proj.name}: ${proj.description}${proj.technologies ? ` (Technologies: ${proj.technologies})` : ''}${proj.link ? ` [${proj.link}]` : ''}`
      ).join('; ')
      : '';

    const experienceAchievements = data.experiences.length > 0
      ? data.experiences
        .filter(exp => exp.achievements)
        .map(exp => exp.achievements)
        .join('. ')
      : '';

    const awardsString = data.awardEntries.length > 0
      ? data.awardEntries.map(award =>
        `${award.title}${award.issuer ? ` from ${award.issuer}` : ''}${award.date ? ` (${award.date})` : ''}${award.description ? `: ${award.description}` : ''}`
      ).join('; ')
      : '';

    const allAchievements = [experienceAchievements, awardsString].filter(Boolean).join('. ');

    setFormattedResumeData({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      education: educationString,
      certifications: certificationsString, // ✅ Separate field
      experience: experienceString,
      skills: data.keySkills,
      projects: projectsString,
      achievements: allAchievements,
      jobDescription: `${data.targetJobTitle || 'Professional role'} in ${data.industry || 'the'} industry` +
        (data.yearsOfExperience ? ` with ${data.yearsOfExperience} years of experience` : '') +
        (data.languages ? `. Languages: ${data.languages}` : '')
    });
  };

  const addExperience = () => {
    const newExp: ExperienceEntry = {
      id: generateId(),
      company: '',
      jobTitle: '',
      startYear: '',
      endYear: '',
      isCurrent: false,
      achievements: ''
    };
    updateField('experiences', [...collectedData.experiences, newExp]);
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | boolean) => {
    const updated = collectedData.experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField('experiences', updated);
  };

  const removeExperience = (id: string) => {
    updateField('experiences', collectedData.experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: EducationEntry = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      graduationYear: ''
    };
    updateField('educationEntries', [...collectedData.educationEntries, newEdu]);
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    const updated = collectedData.educationEntries.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateField('educationEntries', updated);
  };

  const removeEducation = (id: string) => {
    updateField('educationEntries', collectedData.educationEntries.filter(edu => edu.id !== id));
  };

  const addCertification = () => {
    const newCert: CertificationEntry = {
      id: generateId(),
      name: '',
      issuer: '',
      year: ''
    };
    updateField('certifications', [...collectedData.certifications, newCert]);
  };

  const updateCertification = (id: string, field: keyof CertificationEntry, value: string) => {
    const updated = collectedData.certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    updateField('certifications', updated);
  };

  const removeCertification = (id: string) => {
    updateField('certifications', collectedData.certifications.filter(cert => cert.id !== id));
  };

  const addProject = () => {
    const newProj: ProjectEntry = {
      id: generateId(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    updateField('projectEntries', [...collectedData.projectEntries, newProj]);
  };

  const updateProject = (id: string, field: keyof ProjectEntry, value: string) => {
    const updated = collectedData.projectEntries.map(proj =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    updateField('projectEntries', updated);
  };

  const removeProject = (id: string) => {
    updateField('projectEntries', collectedData.projectEntries.filter(proj => proj.id !== id));
  };

  const addAward = () => {
    const newAward: AwardEntry = {
      id: generateId(),
      title: '',
      issuer: '',
      date: '',
      description: ''
    };
    updateField('awardEntries', [...collectedData.awardEntries, newAward]);
  };

  const updateAwardEntry = (id: string, field: keyof AwardEntry, value: string) => {
    const updated = collectedData.awardEntries.map(award =>
      award.id === id ? { ...award, [field]: value } : award
    );
    updateField('awardEntries', updated);
  };

  const removeAward = (id: string) => {
    updateField('awardEntries', collectedData.awardEntries.filter(award => award.id !== id));
  };

  const addSkill = (skill?: string) => {
    const skillToAdd = skill || skillInput.trim();
    if (skillToAdd && !collectedData.keySkills.includes(skillToAdd)) {
      const newSkills = [...collectedData.keySkills, skillToAdd];
      updateField('keySkills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = collectedData.keySkills.filter(s => s !== skill);
    updateField('keySkills', newSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleGenerate = async () => {
    const API_URL = 'https://training-backend-wine.vercel.app/api/resume/generate-resume';
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

    // Build typed payload with separate certifications field
    const payload: AIResumePayload = {
      name: formattedResumeData.name,
      email: formattedResumeData.email,
      phone: formattedResumeData.phone,
      jobDescription: formattedResumeData.jobDescription,
    };

    // Only include education if user provided it
    if (collectedData.educationEntries.length > 0) {
      payload.education = formattedResumeData.education;
    }

    // ✅ ADD CERTIFICATIONS SEPARATELY
    if (collectedData.certifications.length > 0) {
      payload.certifications = formattedResumeData.certifications;
    }

    if (collectedData.experiences.length > 0) {
      payload.experience = formattedResumeData.experience;
    }

    if (collectedData.keySkills.length > 0) {
      payload.skills = formattedResumeData.skills;
    }

    if (collectedData.projectEntries.length > 0) {
      payload.projects = formattedResumeData.projects;
    }

    if (collectedData.awardEntries.length > 0 ||
      collectedData.experiences.some(exp => exp.achievements)) {
      payload.achievements = formattedResumeData.achievements;
    }

    const includedSections = [];
    if (payload.education) includedSections.push('education');
    if (payload.certifications) includedSections.push('certifications'); // ✅ ADDED
    if (payload.experience) includedSections.push('experience');
    if (payload.skills) includedSections.push('skills');
    if (payload.projects) includedSections.push('projects');
    if (payload.achievements) includedSections.push('achievements');

    payload.instructions = `Generate a professional, ATS-optimized resume for a ${collectedData.targetJobTitle || 'professional'}.

INCLUDE ONLY THESE SECTIONS (DO NOT CREATE SECTIONS NOT LISTED HERE):
${includedSections.map(section => `- ${section.charAt(0).toUpperCase() + section.slice(1)}`).join('\n')}

CRITICAL IMPORTANT RULES:
1. DO NOT generate content for sections that are not listed above
2. Certifications should be SEPARATE from Education section
3. If certifications are provided, create a separate "Certifications" section
4. Education section should ONLY contain formal education (degrees, diplomas)
5. Certifications section should contain professional certifications, licenses, and training
6. DO NOT mix certifications with education
7. If no certifications provided, DO NOT mention certifications at all
8. If no education provided, DO NOT create education section

REQUIREMENTS:
- Education and Certifications must be in SEPARATE sections
- Use strong action verbs
- Include quantifiable metrics and achievements
- Keep the summary concise (2-3 sentences)
- Each experience bullet should demonstrate IMPACT and RESULTS
- Skills should be specific and relevant
- Use professional, industry-standard terminology

TONE: Professional, confident, and results-oriented.`;

    payload.targetRole = collectedData.targetJobTitle;
    payload.yearsExperience = collectedData.yearsOfExperience;
    payload.industry = collectedData.industry;

    const attemptFetch = async (url: string, useProxy: boolean = false): Promise<Response> => {
      const targetUrl = useProxy ? `${CORS_PROXY}${encodeURIComponent(url)}` : url;

      return fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    };

    try {
      setIsGeneratingResume(true);
      setIsGenerating(true);

      console.log('[Resume AI] Starting generation with payload:', payload);

      let response: Response;
      let usedProxy = false;

      try {
        response = await attemptFetch(API_URL, false);
        console.log('[Resume AI] Direct request succeeded, status:', response.status);
      } catch (directError) {
        console.log('[Resume AI] Direct request failed, trying CORS proxy...', directError);
        usedProxy = true;
        response = await attemptFetch(API_URL, true);
        console.log('[Resume AI] Proxy request succeeded, status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Resume AI] API Error Response:', errorText);

        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 402) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again in a few moments.');
        }

        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      let result: APIResumeResponse;

      try {
        const responseText = await response.text();
        console.log('[Resume AI] Raw response:', responseText.substring(0, 500));
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Resume AI] JSON parse error:', parseError);
        throw new Error('Invalid response format from API. Please try again.');
      }

      console.log('[Resume AI] Parsed response:', result);

      if (!result.resume) {
        console.error('[Resume AI] No resume in response:', result);
        throw new Error('No resume data received from API');
      }

      const resumeData = mapAPIResponseToResumeData(result, collectedData);

      console.log('[Resume AI] Mapped Resume Data:', resumeData);

      try {
        onGenerate(resumeData);
        console.log('[Resume AI] Resume data applied successfully');
      } catch (applyError) {
        console.error('[Resume AI] Failed to apply resume data:', applyError);
        toast.error('Resume generated but failed to apply. Please try again.');
        return;
      }

      const includedCount = includedSections.length;
      toast.success(`🎉 Resume generated with ${includedCount} section${includedCount !== 1 ? 's' : ''}!` + (usedProxy ? ' (via proxy)' : ''));

      resetAndClose();
      console.log('[Resume AI] Generation completed successfully');

    } catch (error) {
      console.error('[Resume AI] Generation error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to generate resume. Please try again.');
      }
    } finally {
      setIsGeneratingResume(false);
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: {
        const phoneRegex = /^[0-9+\-\s]{8,15}$/;
        return (
          collectedData.fullName.trim() !== '' &&
          collectedData.email.trim() !== '' &&
          phoneRegex.test(collectedData.phone.trim()) &&
          collectedData.location.trim() !== '' &&          // ✅ new
          collectedData.linkedin.trim() !== ''             // ✅ new
        );
      }
      case 2:
        return (
          collectedData.targetJobTitle.trim() !== '' &&
          collectedData.industry.trim() !== '' &&
          collectedData.yearsOfExperience.trim() !== ''    // ✅ new
        );
      case 3:
        return collectedData.keySkills.length > 0;
      case 4:
        return (
          collectedData.experiences.length > 0 &&
          collectedData.experiences.every(exp => {
            // Company and job title are mandatory
            if (exp.company.trim() === '' || exp.jobTitle.trim() === '') return false;
            // Start year must be filled
            if (exp.startYear.trim() === '') return false;
            // If not current, end year must be filled
            if (!exp.isCurrent && exp.endYear.trim() === '') return false;
            // Achievements must be filled
            if (exp.achievements.trim() === '') return false;
            return true;
          })
        );
      case 5: {
        // Education must exist and all fields filled
        const educationValid =
          collectedData.educationEntries.length > 0 &&
          collectedData.educationEntries.every(edu =>
            edu.institution.trim() !== '' &&
            edu.degree.trim() !== '' &&
            edu.field.trim() !== '' &&
            edu.graduationYear.trim() !== ''
          );

        // Certifications must exist and all fields filled
        const certificationsValid =
          collectedData.certifications.length > 0 &&
          collectedData.certifications.every(cert =>
            cert.name.trim() !== '' &&
            cert.issuer.trim() !== '' &&
            cert.year.trim() !== ''
          );

        // Languages must be filled
        const languagesValid = collectedData.languages.trim() !== '';

        return educationValid && certificationsValid && languagesValid;
      }
      case 6:
        return (
          collectedData.projectEntries.length > 0 &&
          collectedData.projectEntries.every(proj =>
            proj.name.trim() !== '' &&
            proj.description.trim() !== '' &&
            proj.technologies.trim() !== '' &&
            proj.link.trim() !== ''
          )
        );
      case 7:
        return (
          collectedData.awardEntries.length > 0 &&
          collectedData.awardEntries.every(award =>
            award.title.trim() !== '' &&
            award.issuer.trim() !== '' &&
            award.date.trim() !== '' &&
            award.description.trim() !== ''
          )
        );
      default:
        return true;
    }
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setFormData(DEFAULT_AI_INPUT);
    setCollectedData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      targetJobTitle: '',
      yearsOfExperience: '',
      industry: '',
      keySkills: [],
      experiences: [],
      educationEntries: [],
      certifications: [],
      projectEntries: [],
      awardEntries: [],
      languages: ''
    });
    setFormattedResumeData({
      name: '',
      email: '',
      phone: '',
      education: '',
      certifications: '', // Reset
      experience: '',
      skills: [],
      projects: '',
      achievements: '',
      jobDescription: ''
    });
    setIsGeneratingResume(false);
    onOpenChange(false);
  };

  const completedSteps = STEPS.filter(step => step.id < currentStep).length;
  const progress = (completedSteps / STEPS.length) * 100;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetAndClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent
        className="max-w-2xl p-0 gap-0 flex flex-col max-h-[90vh] overflow-hidden top-[5vh] translate-y-0"
      >
        {/* Header with solid color */}
        <div className="bg-primary px-6 pt-6 pb-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex items-start gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-heading font-bold text-white">
                AI Resume Generator
              </h2>
              <p className="text-sm text-white/80 leading-[1]">
                Complete your details and get a beautifully crafted resume in seconds.
              </p>


            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 mt-6 relative z-10">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-5">
            <div className="h-2 bg-blue-100 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-[#0080ff] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    disabled={!isCompleted}
                    className="flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                        isActive &&
                        'bg-[#0080ff] text-white ring-4 ring-blue-100 scale-110',
                        isCompleted &&
                        !isActive &&
                        'bg-[#0080ff] text-white',
                        !isActive &&
                        !isCompleted &&
                        'bg-blue-100 text-blue-400'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <span
                      className={cn(
                        'text-[11px] font-medium hidden sm:block',
                        isActive
                          ? 'text-[#0080ff]'
                          : isCompleted
                            ? 'text-blue-600'
                            : 'text-blue-300'
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">Tell us about yourself</h3>
                <p className="text-sm text-muted-foreground mt-1">We'll use this to personalize your resume</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name *
                </Label>
                <Input
                  placeholder="John Doe"
                  value={collectedData.fullName}
                  onChange={e => updateField('fullName', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email *
                  </Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={collectedData.email}
                    onChange={e => updateField('email', e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={collectedData.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Location *
                  </Label>
                  <Input
                    placeholder="New York, NY"
                    value={collectedData.location}
                    onChange={e => updateField('location', e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    LinkedIn *
                  </Label>
                  <Input
                    placeholder="linkedin.com/in/johndoe"
                    value={collectedData.linkedin}
                    onChange={e => updateField('linkedin', e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Career Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">What's your career goal?</h3>
                <p className="text-sm text-muted-foreground mt-1">Help us tailor your resume to your target role</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Target Job Title *
                </Label>
                <Input
                  placeholder="Senior Software Engineer"
                  value={collectedData.targetJobTitle}
                  onChange={e => updateField('targetJobTitle', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Years of Experience *
                  </Label>
                  <Input
                    type="text"
                    placeholder="5"
                    value={collectedData.yearsOfExperience}
                    onChange={e => updateField('yearsOfExperience', e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Industry *
                  </Label>
                  <Select value={collectedData.industry} onValueChange={v => updateField('industry', v)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground">
                      {INDUSTRIES.map(industry => (
                        <SelectItem
                          key={industry}
                          value={industry}
                          className="text-foreground focus:bg-accent focus:text-accent-foreground data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                        >
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">What are your key skills?</h3>
                <p className="text-sm text-muted-foreground mt-1">Add skills that highlight your expertise</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  Add Skills *
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-12"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addSkill()}
                    className="shrink-0 h-12 w-12"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Quick add suggestions
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.filter(s => !collectedData.keySkills.includes(s)).slice(0, 8).map(skill => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Your skills ({collectedData.keySkills.length})
                </span>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/30 rounded-lg border border-dashed">
                  {collectedData.keySkills.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">
                      No skills added yet. Add at least one skill to continue.
                    </span>
                  )}
                  {collectedData.keySkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1.5 pr-1.5 py-1">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 p-0.5 hover:bg-destructive/20 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Experience - STRUCTURED */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">Tell us about your experience *</h3>
                <p className="text-sm text-muted-foreground mt-1">Add your work history with specific achievements</p>
              </div>

              <div className="space-y-4">
                {collectedData.experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Position {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Company Name *</Label>
                        <Input
                          placeholder="Google, Microsoft, etc."
                          value={exp.company}
                          onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Job Title *</Label>
                        <Input
                          placeholder="Software Engineer"
                          value={exp.jobTitle}
                          onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Start Year *</Label>
                        <Input
                          placeholder="2020"
                          value={exp.startYear}
                          onChange={e => updateExperience(exp.id, 'startYear', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">End Year *</Label>
                        <Input
                          placeholder="2023"
                          value={exp.endYear}
                          onChange={e => updateExperience(exp.id, 'endYear', e.target.value)}
                          disabled={exp.isCurrent}
                          className="h-10"
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={e => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                            className="rounded border-muted-foreground"
                          />
                          Current Role
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Key Achievements & Responsibilities *
                        <span className="text-muted-foreground/60 ml-1">(Use action verbs: Led, Built, Designed...)</span>
                      </Label>
                      <Textarea
                        placeholder="Led a team of 5 engineers, increased revenue by 30%, built scalable APIs serving 1M+ users..."
                        value={exp.achievements}
                        onChange={e => updateExperience(exp.id, 'achievements', e.target.value)}
                        rows={3}
                        className="resize-none text-sm"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  className="w-full h-12 border-dashed gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Work Experience
                </Button>

                {collectedData.experiences.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Please add at least one work experience to continue.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Education & Certifications - STRUCTURED */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">Education & Qualifications</h3>
                <p className="text-sm text-muted-foreground mt-1">Add your educational background and certifications (kept separate)</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    Education *
                  </Label>
                </div>

                {collectedData.educationEntries.map((edu, index) => (
                  <div key={edu.id} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Education {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Institution Name *</Label>
                        <Input
                          placeholder="MIT, Stanford, etc."
                          value={edu.institution}
                          onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Degree *</Label>
                        <Select
                          value={edu.degree}
                          onValueChange={v => updateEducation(edu.id, 'degree', v)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent className="bg-background text-foreground border border-border shadow-md">
                            {EDUCATION_LEVELS.map(level => (
                              <SelectItem
                                key={level.value}
                                value={level.value}
                                className="text-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                              >
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Field of Study / Major *</Label>
                        <Input
                          placeholder="Computer Science"
                          value={edu.field}
                          onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Graduation Year *</Label>
                        <Input
                          placeholder="2020"
                          value={edu.graduationYear}
                          onChange={e => updateEducation(edu.id, 'graduationYear', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  className="w-full h-10 border-dashed gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </Button>

                {collectedData.educationEntries.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                  Please add at least one education entry.
                  </p>
                )}
              </div>

              {/* Certifications */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <AwardIcon className="w-4 h-4 text-muted-foreground" />
                    Certifications *
                    
                  </Label>
                </div>

                {collectedData.certifications.map((cert, index) => (
                  <div key={cert.id} className="p-3 border rounded-lg bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Certification {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(cert.id)}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Name *</Label>
                        <Input
                          placeholder="AWS Solutions Architect"
                          value={cert.name}
                          onChange={e => updateCertification(cert.id, 'name', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Issuing Org *</Label>
                        <Input
                          placeholder="Amazon"
                          value={cert.issuer}
                          onChange={e => updateCertification(cert.id, 'issuer', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Year *</Label>
                        <Input
                          placeholder="2023"
                          value={cert.year}
                          onChange={e => updateCertification(cert.id, 'year', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={addCertification}
                  className="w-full h-9 border-dashed border gap-2 text-xs"
                >
                  <Plus className="w-3 h-3" />
                  Add Certification
                </Button>
              </div>

              {/* Languages */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="languages" className="flex items-center gap-2 text-sm font-medium">
                  <Languages className="w-4 h-4 text-muted-foreground" />
                  Languages *
                  
                </Label>
                <Input
                  id="languages"
                  placeholder="English, Spanish, Mandarin"
                  value={collectedData.languages}
                  onChange={e => updateField('languages', e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          )}

          {/* Step 6: Projects - STRUCTURED */}
{currentStep === 6 && (
  <div className="space-y-5 animate-fade-in">
    <div className="text-center mb-6">
      <h3 className="text-lg font-heading font-semibold text-foreground">Showcase your projects *</h3>
      <p className="text-sm text-muted-foreground mt-1">Add projects that demonstrate your skills</p>
    </div>

    <div className="space-y-4">
      {collectedData.projectEntries.map((proj, index) => (
        <div key={proj.id} className="p-4 border rounded-lg bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Project {index + 1}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProject(proj.id)}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Project Name *</Label>
              <Input
                placeholder="E-commerce Platform"
                value={proj.name}
                onChange={e => updateProject(proj.id, 'name', e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Link className="w-3 h-3" />
                Project Link *
              </Label>
              <Input
                placeholder="github.com/username/project"
                value={proj.link}
                onChange={e => updateProject(proj.id, 'link', e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Description *
              <span className="text-muted-foreground/60 ml-1">(What does it do? What problem does it solve?)</span>
            </Label>
            <Textarea
              placeholder="Built a full-stack e-commerce platform with real-time inventory management, payment processing, and analytics dashboard..."
              value={proj.description}
              onChange={e => updateProject(proj.id, 'description', e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Technologies Used *</Label>
            <Input
              placeholder="React, Node.js, MongoDB, AWS"
              value={proj.technologies}
              onChange={e => updateProject(proj.id, 'technologies', e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full h-12 border-dashed gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </Button>

      {collectedData.projectEntries.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Please add at least one project.
        </p>
      )}
    </div>
  </div>
)}

          {/* Step 7: Awards - STRUCTURED */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">Highlight your achievements</h3>
                <p className="text-sm text-muted-foreground mt-1">Add awards, honors, or recognition you've received *</p>
              </div>

              <div className="space-y-4">
                {collectedData.awardEntries.map((award, index) => (
                  <div key={award.id} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Award {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAward(award.id)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Award Title *</Label>
                        <Input
                          placeholder="Best Employee of the Year"
                          value={award.title}
                          onChange={e => updateAwardEntry(award.id, 'title', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1">
<Label className="text-xs text-muted-foreground">Issuing Organization *</Label>                        <Input
                          placeholder="Company or Institution"
                          value={award.issuer}
                          onChange={e => updateAwardEntry(award.id, 'issuer', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Date / Year *</Label>
                        <Input
                          placeholder="2023"
                          value={award.date}
                          onChange={e => updateAwardEntry(award.id, 'date', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Description *</Label>
                        <Input
                          placeholder="Brief description of the award"
                          value={award.description}
                          onChange={e => updateAwardEntry(award.id, 'description', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addAward}
                  className="w-full h-12 border-dashed gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Award
                </Button>

                {collectedData.awardEntries.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
Please add at least one award.                  </p>
                )}
              </div>

              <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Ready to generate
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  We'll generate separate sections for:
                  {collectedData.experiences.length > 0 && ` ${collectedData.experiences.length} work experience${collectedData.experiences.length !== 1 ? 's' : ''}`}
                  {collectedData.educationEntries.length > 0 && `, ${collectedData.educationEntries.length} education entr${collectedData.educationEntries.length !== 1 ? 'ies' : 'y'}`}
                  {collectedData.certifications.length > 0 && `, ${collectedData.certifications.length} certification${collectedData.certifications.length !== 1 ? 's' : ''} (SEPARATE from Education)`}
                  {collectedData.projectEntries.length > 0 && `, ${collectedData.projectEntries.length} project${collectedData.projectEntries.length !== 1 ? 's' : ''}`}
                  {collectedData.awardEntries.length > 0 && `, ${collectedData.awardEntries.length} award${collectedData.awardEntries.length !== 1 ? 's' : ''}`}
                  {collectedData.keySkills.length > 0 && `, ${collectedData.keySkills.length} skill${collectedData.keySkills.length !== 1 ? 's' : ''}`}.
                  {collectedData.experiences.length === 0 && collectedData.educationEntries.length === 0 && collectedData.projectEntries.length === 0 && collectedData.awardEntries.length === 0 && collectedData.certifications.length === 0 && ' Only basic info will be generated.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1 || isGenerating || isGeneratingResume}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  currentStep === step.id ? 'w-6 bg-primary' :
                    currentStep > step.id ? 'bg-blue-500' : 'bg-muted-foreground/30'
                )}
              />
            ))}
          </div>

          {currentStep < 7 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="gap-2 min-w-[100px]"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={!canProceed() || isGenerating || isGeneratingResume}
              className="gap-2 min-w-[140px]"
            >
              {isGenerating || isGeneratingResume ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIGenerationModal;