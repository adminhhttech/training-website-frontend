import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  ResumeData,
  ResumeSettings,
  ColorScheme,
  TemplateId,
  SectionKey,
  DEFAULT_RESUME_DATA,
  DEFAULT_COLOR_SCHEMES,
  DEFAULT_VISIBLE_SECTIONS,
  DEFAULT_SECTION_ORDER,
  Experience,
  Education,
  Skill,
  Project,
  Certificate,
  Award,
  PersonalInfo,
} from '../types/resume';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'resume-builder-data';
const SETTINGS_KEY = 'resume-builder-settings';

interface ResumeContextType {
  resumeData: ResumeData;
  settings: ResumeSettings;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setResumeData: (data: ResumeData) => void;
  updateResumeSection: (section: keyof ResumeData, data: Partial<ResumeData>) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (items: Experience[]) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (items: Education[]) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (items: Skill[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (items: Project[]) => void;
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;
  reorderCertificates: (items: Certificate[]) => void;
  addAward: (award: Award) => void;
  updateAward: (id: string, award: Partial<Award>) => void;
  removeAward: (id: string) => void;
  reorderAwards: (items: Award[]) => void;
  setTemplate: (template: TemplateId) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleSectionVisibility: (section: SectionKey) => void;
  setSectionVisibility: (sections: Partial<Record<SectionKey, boolean>>) => void;
  reorderSections: (sectionOrder: SectionKey[]) => void;
  resetResume: () => void;
  exportResume: () => void;
  importResume: (file: File) => void;
  colorSchemes: ColorScheme[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const DEFAULT_SETTINGS: ResumeSettings = {
  template: 'professional',
  colorScheme: DEFAULT_COLOR_SCHEMES[0],
  fontSize: 'medium',
  showPhoto: true,
  visibleSections: DEFAULT_VISIBLE_SECTIONS,
  sectionOrder: DEFAULT_SECTION_ORDER,
};

// Load from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return fallback;
}

// Save to localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// History management
interface HistoryState {
  past: ResumeData[];
  future: ResumeData[];
}

const MAX_HISTORY = 50;

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => 
    loadFromStorage(STORAGE_KEY, DEFAULT_RESUME_DATA)
  );
  const [settings, setSettings] = useState<ResumeSettings>(() => 
    loadFromStorage(SETTINGS_KEY, DEFAULT_SETTINGS)
  );
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEY, resumeData);
  }, [resumeData]);

  useEffect(() => {
    saveToStorage(SETTINGS_KEY, settings);
  }, [settings]);

  // Record history when resume data changes (but not during undo/redo)
  const recordHistory = useCallback((prevData: ResumeData) => {
    if (isUndoRedo) return;
    setHistory(prev => ({
      past: [...prev.past.slice(-MAX_HISTORY + 1), prevData],
      future: [],
    }));
  }, [isUndoRedo]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      
      setIsUndoRedo(true);
      setResumeData(currentData => {
        setTimeout(() => setIsUndoRedo(false), 0);
        return previous;
      });
      
      return {
        past: newPast,
        future: [resumeData, ...prev.future],
      };
    });
  }, [resumeData]);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      setIsUndoRedo(true);
      setResumeData(currentData => {
        setTimeout(() => setIsUndoRedo(false), 0);
        return next;
      });
      
      return {
        past: [...prev.past, resumeData],
        future: newFuture,
      };
    });
  }, [resumeData]);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
      };
    });
  }, [recordHistory]);

  // Set entire resume data (for AI generation)
  const setFullResumeData = useCallback((data: ResumeData) => {
    setResumeData(prev => {
      recordHistory(prev);
      return data;
    });
  }, [recordHistory]);

  // Update a specific section of the resume (for streaming AI generation)
  const updateResumeSection = useCallback((section: keyof ResumeData, data: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  // Experience CRUD
  const addExperience = useCallback((exp: Experience) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        experience: [...prev.experience, exp],
      };
    });
  }, [recordHistory]);

  const updateExperience = useCallback((id: string, exp: Partial<Experience>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        experience: prev.experience.map(e => e.id === id ? { ...e, ...exp } : e),
      };
    });
  }, [recordHistory]);

  const removeExperience = useCallback((id: string) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        experience: prev.experience.filter(e => e.id !== id),
      };
    });
  }, [recordHistory]);

  // Education CRUD
  const addEducation = useCallback((edu: Education) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        education: [...prev.education, edu],
      };
    });
  }, [recordHistory]);

  const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        education: prev.education.map(e => e.id === id ? { ...e, ...edu } : e),
      };
    });
  }, [recordHistory]);

  const removeEducation = useCallback((id: string) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        education: prev.education.filter(e => e.id !== id),
      };
    });
  }, [recordHistory]);

  // Skills CRUD
  const addSkill = useCallback((skill: Skill) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        skills: [...prev.skills, skill],
      };
    });
  }, [recordHistory]);

  const updateSkill = useCallback((id: string, skill: Partial<Skill>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        skills: prev.skills.map(s => s.id === id ? { ...s, ...skill } : s),
      };
    });
  }, [recordHistory]);

  const removeSkill = useCallback((id: string) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        skills: prev.skills.filter(s => s.id !== id),
      };
    });
  }, [recordHistory]);

  // Projects CRUD
  const addProject = useCallback((project: Project) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        projects: [...prev.projects, project],
      };
    });
  }, [recordHistory]);

  const updateProject = useCallback((id: string, project: Partial<Project>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p),
      };
    });
  }, [recordHistory]);

  const removeProject = useCallback((id: string) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
      };
    });
  }, [recordHistory]);

  // Certificates CRUD
  const addCertificate = useCallback((cert: Certificate) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        certificates: [...prev.certificates, cert],
      };
    });
  }, [recordHistory]);

  const updateCertificate = useCallback((id: string, cert: Partial<Certificate>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        certificates: prev.certificates.map(c => c.id === id ? { ...c, ...cert } : c),
      };
    });
  }, [recordHistory]);

  const removeCertificate = useCallback((id: string) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        certificates: prev.certificates.filter(c => c.id !== id),
      };
    });
  }, [recordHistory]);

  // Awards CRUD
  const addAward = useCallback((award: Award) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        awards: [...prev.awards, award],
      };
    });
  }, [recordHistory]);

  const updateAward = useCallback((id: string, award: Partial<Award>) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        awards: prev.awards.map(a => a.id === id ? { ...a, ...award } : a),
      };
    });
  }, [recordHistory]);

  const removeAward = useCallback((id: string) => {
    setResumeData(prev => {
      recordHistory(prev);
      return {
        ...prev,
        awards: prev.awards.filter(a => a.id !== id),
      };
    });
  }, [recordHistory]);

  // Reorder functions for drag and drop
  const reorderExperience = useCallback((items: Experience[]) => {
    setResumeData(prev => {
      recordHistory(prev);
      return { ...prev, experience: items };
    });
  }, [recordHistory]);

  const reorderEducation = useCallback((items: Education[]) => {
    setResumeData(prev => {
      recordHistory(prev);
      return { ...prev, education: items };
    });
  }, [recordHistory]);

  const reorderSkills = useCallback((items: Skill[]) => {
    setResumeData(prev => {
      recordHistory(prev);
      return { ...prev, skills: items };
    });
  }, [recordHistory]);

  const reorderProjects = useCallback((items: Project[]) => {
    setResumeData(prev => {
      recordHistory(prev);
      return { ...prev, projects: items };
    });
  }, [recordHistory]);

  const reorderCertificates = useCallback((items: Certificate[]) => {
    setResumeData(prev => {
      recordHistory(prev);
      return { ...prev, certificates: items };
    });
  }, [recordHistory]);

  const reorderAwards = useCallback((items: Award[]) => {
    setResumeData(prev => {
      recordHistory(prev);
      return { ...prev, awards: items };
    });
  }, [recordHistory]);

  // Settings
  const setTemplate = useCallback((template: TemplateId) => {
    setSettings(prev => ({ ...prev, template }));
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setSettings(prev => ({ ...prev, colorScheme: scheme }));
  }, []);

  const toggleSectionVisibility = useCallback((section: SectionKey) => {
    setSettings(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [section]: !prev.visibleSections[section],
      },
    }));
  }, []);

  // Set multiple section visibility flags at once (for AI generation)
  const setSectionVisibility = useCallback((sections: Partial<Record<SectionKey, boolean>>) => {
    setSettings(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        ...sections,
      },
    }));
  }, []);

  const reorderSections = useCallback((sectionOrder: SectionKey[]) => {
    setSettings(prev => ({ ...prev, sectionOrder }));
  }, []);

  const resetResume = useCallback(() => {
    recordHistory(resumeData);
    setResumeData(DEFAULT_RESUME_DATA);
    setSettings(DEFAULT_SETTINGS);
    setHistory({ past: [], future: [] });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    toast({
      title: 'Resume Reset',
      description: 'All data has been reset to default',
    });
  }, [resumeData, recordHistory]);

  // Export resume as JSON
  const exportResume = useCallback(() => {
    const exportData = {
      resumeData,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase() || 'data'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Resume Exported',
      description: 'Your resume data has been downloaded as JSON',
    });
  }, [resumeData, settings]);

  // Import resume from JSON
  const importResume = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.resumeData) {
          recordHistory(resumeData);
          setResumeData(importedData.resumeData);
        }
        if (importedData.settings) {
          // Make sure colorScheme exists in our schemes
          const matchingScheme = DEFAULT_COLOR_SCHEMES.find(
            s => s.id === importedData.settings.colorScheme?.id
          );
          setSettings({
            ...importedData.settings,
            colorScheme: matchingScheme || DEFAULT_COLOR_SCHEMES[0],
          });
        }
        toast({
          title: 'Resume Imported',
          description: 'Your resume data has been loaded successfully',
        });
      } catch (error) {
        console.error('Error importing resume:', error);
        toast({
          title: 'Import Failed',
          description: 'Invalid file format. Please select a valid resume JSON file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  }, [resumeData, recordHistory]);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        settings,
        updatePersonalInfo,
        setResumeData: setFullResumeData,
        updateResumeSection,
        addExperience,
        updateExperience,
        removeExperience,
        reorderExperience,
        addEducation,
        updateEducation,
        removeEducation,
        reorderEducation,
        addSkill,
        updateSkill,
        removeSkill,
        reorderSkills,
        addProject,
        updateProject,
        removeProject,
        reorderProjects,
        addCertificate,
        updateCertificate,
        removeCertificate,
        reorderCertificates,
        addAward,
        updateAward,
        removeAward,
        reorderAwards,
        setTemplate,
        setColorScheme,
        toggleSectionVisibility,
        setSectionVisibility,
        reorderSections,
        resetResume,
        exportResume,
        importResume,
        colorSchemes: DEFAULT_COLOR_SCHEMES,
        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
