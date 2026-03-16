import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
  DEFAULT_SECTION_ORDER,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";
import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";


interface ModernTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  visibleSections?: VisibleSections;
  sectionOrder?: SectionKey[];
}

export function ModernTemplate({ data, colorScheme, visibleSections, sectionOrder = DEFAULT_SECTION_ORDER }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certificates, awards } = data;
  
  const isVisible = (section: keyof VisibleSections) => visibleSections?.[section] ?? true;

  // Sidebar sections (skills, certificates shown in left sidebar)
  const sidebarSections = ['skills', 'certificates'];
  // Main content sections
  const mainSections = sectionOrder.filter(s => !sidebarSections.includes(s) && s !== 'summary');

  const renderMainSection = (sectionKey: SectionKey): React.ReactNode => {
    switch (sectionKey) {
      case 'summary':
        return isVisible('summary') && personalInfo.summary ? (
          <div key="summary" className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme.primary }}>
              About Me
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        ) : null;

      case 'experience':
        return isVisible('experience') && experience.length > 0 ? (
          <div key="experience" className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colorScheme.primary }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4" style={{ borderLeft: `2px solid ${colorScheme.accent}` }}>
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: colorScheme.accent }} />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-xs" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </h3>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5 text-xs">
                    {exp.description.slice(0, 3).map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return isVisible('education') && education.length > 0 ? (
          <div key="education" className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colorScheme.primary }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="pl-4" style={{ borderLeft: `2px solid ${colorScheme.accent}` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xs" style={{ color: colorScheme.primary }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>
                        {edu.institution}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return isVisible('projects') && projects.length > 0 ? (
          <div key="projects">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colorScheme.primary }}>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.slice(0, 2).map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-xs" style={{ color: colorScheme.primary }}>
                    {project.link ? (
                      <LinkedText url={project.link}>
                        {project.name}
                      </LinkedText>
                    ) : project.name}
                  </h3>
                  <p className="text-gray-600 text-xs">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-xs rounded"
                          style={{ backgroundColor: `${colorScheme.accent}20`, color: colorScheme.secondary }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'awards':
        return isVisible('awards') && awards.length > 0 ? (
          <div key="awards" className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: colorScheme.primary }}>
              Awards
            </h2>
            <div className="space-y-2">
              {awards.map((award) => (
                <div key={award.id}>
                  <p className="font-medium text-xs" style={{ color: colorScheme.primary }}>{award.title}</p>
                  <p className="text-xs text-gray-500">{award.issuer} • {award.date}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-gray-800 font-sans text-sm" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 p-5" style={{ backgroundColor: colorScheme.primary }}>
          {/* Profile Photo */}
        {personalInfo.photo ? (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName || 'Profile'}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 object-cover"
            style={{ borderColor: colorScheme.accent }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 flex items-center justify-center" style={{ borderColor: colorScheme.accent, backgroundColor: `${colorScheme.accent}30` }}>
            <span className="text-2xl font-bold text-white">
              {(typeof personalInfo.fullName === 'string' && personalInfo.fullName) 
                ? personalInfo.fullName.split(' ').map(n => n[0] || '').join('').toUpperCase()
                : '?'}
            </span>
          </div>
        )}

          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b text-white" style={{ borderColor: `${colorScheme.accent}50` }}>
              Contact
            </h3>
            <div className="space-y-2 text-xs text-white/80">
              {personalInfo.email && (
                <p className="flex items-center gap-2">
                  <Mail size={11} style={{ color: colorScheme.accent }} />
                  <LinkedText url={personalInfo.email} className="break-all text-white/80">
                    {personalInfo.email}
                  </LinkedText>
                </p>
              )}
              {personalInfo.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={11} style={{ color: colorScheme.accent }} />
                  {personalInfo.phone}
                </p>
              )}
              {personalInfo.location && (
                <p className="flex items-center gap-2">
                  <MapPin size={11} style={{ color: colorScheme.accent }} />
                  {personalInfo.location}
                </p>
              )}
              {personalInfo.linkedin && (
                <p className="flex items-center gap-2">
                  <Linkedin size={11} style={{ color: colorScheme.accent }} />
                  <LinkedText url={personalInfo.linkedin} className="break-all text-white/80">
                    {formatDisplayUrl(personalInfo.linkedin)}
                  </LinkedText>
                </p>
              )}
              {personalInfo.github && (
                <p className="flex items-center gap-2">
                  <Github size={11} style={{ color: colorScheme.accent }} />
                  <LinkedText url={personalInfo.github} className="break-all text-white/80">
                    {formatDisplayUrl(personalInfo.github)}
                  </LinkedText>
                </p>
              )}
              {personalInfo.website && (
                <p className="flex items-center gap-2">
                  <Globe size={11} style={{ color: colorScheme.accent }} />
                  <LinkedText url={personalInfo.website} className="break-all text-white/80">
                    {formatDisplayUrl(personalInfo.website)}
                  </LinkedText>
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          {isVisible('skills') && skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b text-white" style={{ borderColor: `${colorScheme.accent}50` }}>
                Skills
              </h3>
              <div className="space-y-2">
                {skills.slice(0, 8).map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs text-white/90 mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${skill.level}%`, backgroundColor: colorScheme.accent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {isVisible('certificates') && certificates.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b text-white" style={{ borderColor: `${colorScheme.accent}50` }}>
                Certifications
              </h3>
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-xs text-white/80">
                    <p className="font-medium text-white">
                      {cert.link ? (
                        <LinkedText url={cert.link} className="text-white">
                          {cert.name}
                        </LinkedText>
                      ) : cert.name}
                    </p>
                    <p>{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-5">
          {/* Header */}
          <div className="mb-5 pb-4 border-b" style={{ borderColor: colorScheme.accent }}>
            <h1 className="text-2xl font-bold mb-1 font-heading" style={{ color: colorScheme.primary, fontFamily: 'IBM Plex Serif, serif' }}>
              {personalInfo.fullName}
            </h1>
            <p className="text-base font-medium" style={{ color: colorScheme.secondary }}>
              {personalInfo.title}
            </p>
          </div>

          {/* Render sections in order, but summary first, then other main sections */}
          {renderMainSection('summary')}
          {mainSections.map(sectionKey => renderMainSection(sectionKey))}
        </div>
      </div>
    </div>
  );
}
