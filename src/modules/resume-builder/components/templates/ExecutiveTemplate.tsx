import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
  DEFAULT_SECTION_ORDER,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Award,
  BookOpen,
  Briefcase,
} from "lucide-react";


interface ExecutiveTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  visibleSections?: VisibleSections;
  sectionOrder?: SectionKey[];
}

export function ExecutiveTemplate({ data, colorScheme, visibleSections, sectionOrder = DEFAULT_SECTION_ORDER }: ExecutiveTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certificates, awards } = data;
  
  const isVisible = (section: keyof VisibleSections) => visibleSections?.[section] ?? true;

  // Sidebar sections
  const sidebarSections = ['education', 'skills', 'certificates', 'awards'];
  const mainSections = sectionOrder.filter(s => !sidebarSections.includes(s) && s !== 'summary');

  const renderMainSection = (sectionKey: SectionKey): React.ReactNode => {
    switch (sectionKey) {
      case 'experience':
        return isVisible('experience') && experience.length > 0 ? (
          <section key="experience">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              <Briefcase size={14} style={{ color: colorScheme.primary }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: colorScheme.primary }}>
                Professional Experience
              </h2>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm" style={{ color: colorScheme.primary }}>
                      {exp.position}
                    </h3>
                    <span className="text-xs font-medium" style={{ color: colorScheme.accent }}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mb-2" style={{ color: colorScheme.secondary }}>
                    {exp.company}{exp.location && ` | ${exp.location}`}
                  </p>
                  <ul className="text-gray-600 space-y-1 text-xs">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorScheme.accent }} />
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return isVisible('projects') && projects.length > 0 ? (
          <section key="projects">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
              <BookOpen size={14} style={{ color: colorScheme.primary }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: colorScheme.primary }}>
                Key Projects
              </h2>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id}>
                  <h3 className="font-bold text-xs" style={{ color: colorScheme.primary }}>
                    {project.link ? (
                      <LinkedText url={project.link}>{project.name}</LinkedText>
                    ) : project.name}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs border rounded"
                          style={{ borderColor: colorScheme.accent, color: colorScheme.secondary }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-gray-800 font-sans text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Elegant Header with Gold Accent Line */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: colorScheme.accent }} />
        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold tracking-wide mb-2" style={{ color: colorScheme.primary, letterSpacing: '0.1em' }}>
              {(typeof personalInfo.fullName === 'string' && personalInfo.fullName) 
                ? personalInfo.fullName.toUpperCase() 
                : ''}
            </h1>
            <p className="text-lg font-medium tracking-wider" style={{ color: colorScheme.secondary }}>
              {personalInfo.title || ''}
            </p>
          </div>
          
          {/* Contact Info - Elegant Horizontal Layout */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 pt-3 border-t" style={{ borderColor: `${colorScheme.accent}40` }}>
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={11} style={{ color: colorScheme.accent }} />
                <LinkedText url={personalInfo.email} className="text-gray-600">
                  {personalInfo.email}
                </LinkedText>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={11} style={{ color: colorScheme.accent }} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} style={{ color: colorScheme.accent }} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin size={11} style={{ color: colorScheme.accent }} />
                <LinkedText url={personalInfo.linkedin} className="text-gray-600">
                  {formatDisplayUrl(personalInfo.linkedin)}
                </LinkedText>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1.5">
                <Github size={11} style={{ color: colorScheme.accent }} />
                <LinkedText url={personalInfo.github} className="text-gray-600">
                  {formatDisplayUrl(personalInfo.github)}
                </LinkedText>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 pb-6">
        {/* Professional Summary with Decorative Border */}
        {isVisible('summary') && personalInfo.summary && (
          <section className="mb-6">
            <div className="relative py-4 px-6 border-l-4" style={{ borderColor: colorScheme.accent, backgroundColor: `${colorScheme.primary}05` }}>
              <p className="text-gray-700 text-xs leading-relaxed italic">
                {personalInfo.summary}
              </p>
            </div>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-5">
            {mainSections.map(sectionKey => renderMainSection(sectionKey))}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Education */}
            {isVisible('education') && education.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-xs" style={{ color: colorScheme.primary }}>
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-gray-600">{edu.field}</p>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && (
                        <p className="text-xs mt-1" style={{ color: colorScheme.accent }}>GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Core Competencies */}
            {isVisible('skills') && skills.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
                  Core Competencies
                </h2>
                <div className="space-y-1.5">
                  {skills.slice(0, 10).map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colorScheme.accent }} />
                      <span className="text-xs text-gray-700">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {isVisible('certificates') && certificates.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="text-xs">
                      <p className="font-medium" style={{ color: colorScheme.primary }}>
                        {cert.link ? (
                          <LinkedText url={cert.link}>{cert.name}</LinkedText>
                        ) : cert.name}
                      </p>
                      <p className="text-gray-500">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards */}
            {isVisible('awards') && awards.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
                  Achievements
                </h2>
                <div className="space-y-2">
                  {awards.map((award) => (
                    <div key={award.id} className="flex items-start gap-2 text-xs">
                      <Award size={10} className="mt-0.5 flex-shrink-0" style={{ color: colorScheme.accent }} />
                      <div>
                        <p className="font-medium" style={{ color: colorScheme.primary }}>{award.title}</p>
                        <p className="text-gray-500">{award.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Footer Accent */}
      <div className="h-1" style={{ backgroundColor: colorScheme.accent }} />
    </div>
  );
}
