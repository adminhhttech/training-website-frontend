import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  ChevronDown,
  Edit3,
  Download,
  Upload,
  MoreVertical,
  ArrowLeft,
  Undo2,
  Redo2,
  Sparkles,
} from "lucide-react";

/* =======================
   RESUME BUILDER (LOCAL MODULE)
======================= */
import { useResume } from "../contexts/ResumeContext";

import { TemplateSelector } from "./TemplateSelector";
import { ColorSchemeSelector } from "./ColorSchemeSelector";
import { PDFExport } from "./PDFExport";

import { PersonalInfoEditor } from "./editor/PersonalInfoEditor";
import { ExperienceEditor } from "./editor/ExperienceEditor";
import { EducationEditor } from "./editor/EducationEditor";
import { SkillsEditor } from "./editor/SkillsEditor";
import { ProjectsEditor } from "./editor/ProjectsEditor";
import {
  CertificatesEditor,
  AwardsEditor,
} from "./editor/AdditionalEditors";

import { ResumeScore } from "./ResumeScore";
import { SectionVisibility } from "./SectionVisibility";
import { BackgroundPattern } from "./BackgroundPattern";
import { AIGenerationModal } from "./ai/AIGenerationModal";
import { GeneratingBlurOverlay } from "./GeneratingBlurOverlay";

import { useAIGeneration } from "../hooks/useAIGeneration";

import { AIGenerationInput } from "../types/ai-generation";
import {
  RESUME_TEMPLATES,
  SectionKey,
  DEFAULT_SECTION_ORDER,
  ResumeData,
} from "../types/resume";

import { DndSectionList } from "./dnd/DndSectionList";

/* =======================
   SHARED (TRAINING APP)
======================= */
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "@/hooks/use-toast";

/* =======================
   RESUME TEMPLATES (LOCAL)
======================= */
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { CompactTemplate } from "./templates/CompactTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { AcademicTemplate } from "./templates/AcademicTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";


// Component mapping for sections
const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType> = {
  summary: PersonalInfoEditor, // Summary is part of PersonalInfo
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certificates: CertificatesEditor,
  awards: AwardsEditor,
};

export default function ResumeBuilder() {
  const { resumeData, settings, resetResume, exportResume, importResume, reorderSections, undo, redo, canUndo, canRedo, updateResumeSection, setResumeData, setSectionVisibility } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [zoom, setZoom] = useState(0.6);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const pdfExportRef = useRef(null);


  // Auto-open AI modal if startWithAI query param is present
  useEffect(() => {
    if (searchParams.get('startWithAI') === 'true') {
      setAiModalOpen(true);
      // Remove the query param after opening
      searchParams.delete('startWithAI');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  // AI Generation hook
  const { generate, isGenerating, currentStep } = useAIGeneration({
    onSectionGenerated: useCallback((section: string, data: Partial<ResumeData>) => {
      updateResumeSection(section as keyof ResumeData, data);
    }, [updateResumeSection]),
    onComplete: useCallback((data: ResumeData) => {
      setResumeData(data);
      toast({
        title: 'Resume Generated!',
        description: 'Your AI-generated resume is ready. Feel free to edit any section.',
      });
    }, [setResumeData]),
  });

  const handleAIGenerate = useCallback((generatedData: ResumeData) => {
    // Set the resume data from the API response
    setResumeData(generatedData);
    
    // Auto-hide sections that have no content
    const visibilityUpdates: Partial<Record<SectionKey, boolean>> = {
      summary: !!generatedData.personalInfo.summary?.trim(),
      experience: generatedData.experience.length > 0,
      education: generatedData.education.length > 0,
      skills: generatedData.skills.length > 0,
      projects: generatedData.projects.length > 0,
      certificates: generatedData.certificates.length > 0,
      awards: generatedData.awards.length > 0,
    };
    
    setSectionVisibility(visibilityUpdates);
    setAiModalOpen(false);
  }, [setResumeData, setSectionVisibility]);

  // Auto-calculate zoom based on container width
  useEffect(() => {
    const calculateZoom = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        const a4WidthPx = 210 * 3.7795; // 210mm in pixels (approximately)
        const padding = 32; // Account for padding
        const availableWidth = containerWidth - padding;
        const calculatedZoom = Math.min(availableWidth / a4WidthPx, 0.8);
        setZoom(Math.max(0.3, Math.min(calculatedZoom, 0.8)));
      }
    };

    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    return () => window.removeEventListener('resize', calculateZoom);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2));

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importResume(file);
      e.target.value = ''; // Reset input
    }
  };

  const TemplateComponent = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    minimalist: MinimalistTemplate,
    compact: CompactTemplate,
    classic: ClassicTemplate,
    tech: TechTemplate,
    academic: AcademicTemplate,
    elegant: ElegantTemplate,
  }[settings.template];

  // Get the current section order, defaulting to the standard order
  const sectionOrder = settings.sectionOrder || DEFAULT_SECTION_ORDER;

  // Build sections array for drag-and-drop, excluding summary since it's in PersonalInfo
  // Also filter out any invalid sections (like 'languages' which was removed)
  const validSectionKeys = Object.keys(SECTION_COMPONENTS) as SectionKey[];
  const draggableSections = useMemo(() => {
    return sectionOrder
      .filter(key => key !== 'summary' && validSectionKeys.includes(key))
      .map(key => ({
        id: key,
        component: (() => {
          const Component = SECTION_COMPONENTS[key];
          return <Component key={key} />;
        })(),
      }));
  }, [sectionOrder, validSectionKeys]);

  const handleSectionReorder = (newOrder: (SectionKey | 'personalInfo')[]) => {
    // Filter out 'personalInfo' and ensure 'summary' is at the start
    const filteredOrder = newOrder.filter((id): id is SectionKey => id !== 'personalInfo');
    // Add summary at the beginning if it's not there
    if (!filteredOrder.includes('summary')) {
      filteredOrder.unshift('summary');
    }
    reorderSections(filteredOrder);
  };

  const editorContent = (
    <>
      <div className="p-4 space-y-4">
        <ResumeScore />
        <SectionVisibility />
      </div>
      <PersonalInfoEditor />
      <DndSectionList 
        sections={draggableSections}
        onReorder={handleSectionReorder}
      />
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <BackgroundPattern />
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="bg-header text-header-foreground px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-4">
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-2"
          >
            {/* Logo Clickable */}
            <Link to="/resume-builder" aria-label="Go to Resume Builder">
              <img
                src="/hht-resume-logo.png"
                alt="AI Resume Lab Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-sm object-contain hover:shadow-md transition"
              />
            </Link>

            {/* Text Clickable */}
            <Link to="/resume-builder">
              <span className="font-heading font-semibold text-base sm:text-lg hidden">
                AI Resume Lab
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-2 ml-2 sm:ml-4">
            <Button 
              onClick={() => setAiModalOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
            <TemplateSelector>
              <Button variant="ghost" className="gap-2 text-header-foreground hover:bg-white/10">
                Templates ({RESUME_TEMPLATES.length})
                <ChevronDown className="w-4 h-4" />
              </Button>
            </TemplateSelector>
            <ColorSchemeSelector>
              <Button variant="ghost" className="gap-2 text-header-foreground hover:bg-white/10">
                Colours
                <ChevronDown className="w-4 h-4" />
              </Button>
            </ColorSchemeSelector>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="text-header-foreground hover:bg-white/10 disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="text-header-foreground hover:bg-white/10 disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportResume}
              className="text-header-foreground hover:bg-white/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImportClick}
              className="text-header-foreground hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetResume}
              className="text-header-foreground hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {/* Desktop PDF Export */}
            <div className="ml-2">
                <PDFExport
                  targetRef={resumeRef}
                  fileName={
                    resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "resume"
                  }
                />
            </div>
          </div>
          
          {/* ===== MOBILE ACTIONS ===== */}
          {/* 3 Dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-header-foreground hover:bg-white/10 touch-target"
                aria-label="Open menu"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-background border shadow-xl"
            >
              <DropdownMenuItem onClick={() => setAiModalOpen(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </DropdownMenuItem>

              <TemplateSelector>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Templates ({RESUME_TEMPLATES.length})
                </DropdownMenuItem>
              </TemplateSelector>

              <ColorSchemeSelector>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Colours</DropdownMenuItem>
              </ColorSchemeSelector>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={undo} disabled={!canUndo}>
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
              </DropdownMenuItem>

              <DropdownMenuItem onClick={redo} disabled={!canRedo}>
                <Redo2 className="w-4 h-4 mr-2" />
                Redo
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={exportResume}>
                <Upload className="w-4 h-4 mr-2" />
                Export JSON
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleImportClick}>
                <Download className="w-4 h-4 mr-2" />
                Import JSON
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={resetResume}
                className="text-destructive focus:text-destructive"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile PDF Export - Right of 3 dots */}
          <div className="md:hidden">
            <PDFExport
              targetRef={resumeRef}
              fileName={
                resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "resume"
              }
            />
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Resume Preview */}
        <div ref={previewContainerRef} className="flex-1 bg-muted/50 overflow-auto p-2 sm:p-4 md:p-6 relative">
          {/* AI Generation Blur Overlay */}
          <GeneratingBlurOverlay isVisible={isAIGenerating} />
          
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg md:text-xl text-foreground font-medium">
              {settings.template.charAt(0).toUpperCase() + settings.template.slice(1)} Resume
            </h2>
            <div className="flex items-center gap-2 bg-card rounded-lg border p-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-14 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center pb-24 lg:pb-8">
            <div
              ref={resumeRef}
              style={{
                width: '210mm',
                minHeight: '297mm',
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                marginBottom: `calc(297mm * ${zoom - 1})`,
              }}
              className="resume-shadow bg-white"
            >
              <TemplateComponent data={resumeData} colorScheme={settings.colorScheme} showPhoto={settings.showPhoto} visibleSections={settings.visibleSections} sectionOrder={sectionOrder} />
            </div>
          </div>
        </div>

        {/* Editor Sidebar - Desktop */}
        <aside className="w-[380px] bg-card border-l border-border hidden lg:flex lg:flex-col group/scroll overflow-hidden">
          <div className="p-4 border-b border-border bg-card flex-shrink-0">
            <h2 className="font-heading font-semibold text-foreground">Edit Resume</h2>
            <p className="text-xs text-muted-foreground mt-1">Click sections to expand and edit</p>
          </div>
          <ScrollArea className="flex-1 h-full">
            <div className="pb-4">
              {editorContent}
            </div>
          </ScrollArea>
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 sm:p-3 flex gap-1.5 sm:gap-2 z-40">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAiModalOpen(true)}
          className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 border-accent text-accent"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">AI</span>
        </Button>
        <TemplateSelector>
          <Button variant="outline" size="sm" className="flex-1 gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <span className="hidden xs:inline">Templates</span>
            <span className="xs:hidden">Style</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </TemplateSelector>
        <ColorSchemeSelector>
          <Button variant="outline" size="sm" className="flex-1 gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <span className="hidden xs:inline">Colours</span>
            <span className="xs:hidden">Color</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </ColorSchemeSelector>
        <Sheet open={mobileEditorOpen} onOpenChange={setMobileEditorOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="flex-1 gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle>Edit Resume</SheetTitle>
            </SheetHeader>
            <div className="pb-6">
              {editorContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* AI Generation Modal */}
      <AIGenerationModal 
        open={aiModalOpen} 
        onOpenChange={setAiModalOpen}
        onGenerate={handleAIGenerate}
        isGenerating={isAIGenerating}
        setIsGenerating={setIsAIGenerating}
      />
    </div>
  );
}