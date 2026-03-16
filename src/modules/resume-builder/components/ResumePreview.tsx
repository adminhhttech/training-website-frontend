import { useResume } from '../contexts/ResumeContext';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { ExecutiveTemplate } from '../components/templates/ExecutiveTemplate';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { CompactTemplate } from '../components/templates/CompactTemplate';
import { ClassicTemplate } from '../components/templates/ClassicTemplate';
import { TechTemplate } from '../components/templates/TechTemplate';
import { AcademicTemplate } from '../components/templates/AcademicTemplate';
import { ElegantTemplate } from '../components/templates/ElegantTemplate';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface ResumePreviewProps {
  scale?: number;
}

export function ResumePreview({ scale = 1 }: ResumePreviewProps) {
  const { resumeData, settings, resetResume } = useResume();

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

  return (
    <div 
      className="resume-preview bg-white resume-shadow"
      style={{ 
        width: '210mm',
        minHeight: '297mm',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <ErrorBoundary onReset={resetResume}>
        <TemplateComponent 
          data={resumeData} 
          colorScheme={settings.colorScheme}
          showPhoto={settings.showPhoto}
          visibleSections={settings.visibleSections}
          sectionOrder={settings.sectionOrder}
        />
      </ErrorBoundary>
    </div>
  );
}
