import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
  DEFAULT_SECTION_ORDER,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";
import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from "lucide-react";


interface CreativeTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  visibleSections?: VisibleSections;
  sectionOrder?: SectionKey[];
}

export function CreativeTemplate({ data, colorScheme, visibleSections, sectionOrder = DEFAULT_SECTION_ORDER }: CreativeTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certificates, awards } = data;
  
  const isVisible = (section: keyof VisibleSections) => visibleSections?.[section] ?? true;

  // Sidebar sections
  const sidebarSections = ['education', 'skills'];
  const mainSections = sectionOrder.filter(s => !sidebarSections.includes(s) && s !== 'summary');

  const renderMainSection = (sectionKey: SectionKey): React.ReactNode => {
    switch (sectionKey) {
      case 'experience':
        return isVisible('experience') && experience.length > 0 ? (
          <section key="experience">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.primary }}>
                💼
              </span>
              <span style={{ color: colorScheme.primary }}>Experience</span>
            </h2>
            <div className="space-y-4 ml-10">
              {experience.map((exp) => (
                <div key={exp.id} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-xs" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </h3>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${colorScheme.accent}20`, color: colorScheme.secondary }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="text-gray-600 space-y-0.5 text-xs mt-2">
                    {exp.description.slice(0, 3).map((desc, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span style={{ color: colorScheme.accent }}>•</span>
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
            <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.primary }}>
                🚀
              </span>
              <span style={{ color: colorScheme.primary }}>Projects</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 ml-10">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="p-3 rounded-lg border" style={{ borderColor: `${colorScheme.accent}30` }}>
                  <h3 className="font-semibold text-xs mb-1" style={{ color: colorScheme.primary }}>
                    {project.link ? (
                      <LinkedText url={project.link} className="flex items-center gap-1">
                        {project.name}
                        <ExternalLink size={10} />
                      </LinkedText>
                    ) : project.name}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-xs rounded"
                          style={{ backgroundColor: colorScheme.primary, color: 'white' }}
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

      case 'certificates':
        return isVisible('certificates') && certificates.length > 0 ? (
          <section key="certificates">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.primary }}>
                📜
              </span>
              <span style={{ color: colorScheme.primary }}>Certifications</span>
            </h2>
            <div className="space-y-2 ml-10">
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
        ) : null;

      case 'awards':
        return isVisible('awards') && awards.length > 0 ? (
          <section key="awards">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.primary }}>
                🏆
              </span>
              <span style={{ color: colorScheme.primary }}>Awards</span>
            </h2>
            <div className="space-y-2 ml-10">
              {awards.map((award) => (
                <div key={award.id} className="text-xs">
                  <p className="font-medium" style={{ color: colorScheme.primary }}>{award.title}</p>
                  <p className="text-gray-500">{award.issuer} • {award.date}</p>
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
    <div className="w-full bg-white text-gray-800 font-sans text-sm" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colorScheme.primary }} />
        <div className="relative px-6 py-8 flex gap-6">
          {/* Photo/Initials */}
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <span className="text-2xl font-bold text-white">
              {(typeof personalInfo.fullName === 'string' && personalInfo.fullName) 
                ? personalInfo.fullName.split(' ').map(n => n[0] || '').join('').toUpperCase()
                : '?'}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1 font-heading" style={{ color: colorScheme.primary, fontFamily: 'IBM Plex Serif, serif' }}>
              {personalInfo.fullName}
            </h1>
            <p className="text-base font-medium mb-3" style={{ color: colorScheme.accent }}>
              {personalInfo.title}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                  <Mail size={10} style={{ color: colorScheme.accent }} />
                  <LinkedText url={personalInfo.email} className="text-gray-600">
                    {personalInfo.email}
                  </LinkedText>
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                  <Phone size={10} style={{ color: colorScheme.accent }} />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                  <MapPin size={10} style={{ color: colorScheme.accent }} />
                  {personalInfo.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: `${colorScheme.accent}10` }}>
            <p className="text-gray-700 text-xs leading-relaxed italic">
              "{personalInfo.summary}"
            </p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-5">
            {mainSections.map(sectionKey => renderMainSection(sectionKey))}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-5">
            {/* Education */}
            {isVisible('education') && education.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.accent }}>
                    🎓
                  </span>
                  <span style={{ color: colorScheme.primary }}>Education</span>
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-2 rounded-lg bg-gray-50">
                      <h3 className="font-semibold text-xs" style={{ color: colorScheme.primary }}>
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-gray-600">{edu.field}</p>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {isVisible('skills') && skills.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.accent }}>
                    ⚡
                  </span>
                  <span style={{ color: colorScheme.primary }}>Skills</span>
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 text-xs rounded-full font-medium"
                      style={{ 
                        backgroundColor: `${colorScheme.primary}15`, 
                        color: colorScheme.primary,
                        border: `1px solid ${colorScheme.primary}30`
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Links */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: colorScheme.accent }}>
                  🔗
                </span>
                <span style={{ color: colorScheme.primary }}>Links</span>
              </h2>
              <div className="space-y-1.5 text-xs">
                {personalInfo.linkedin && (
                  <p className="flex items-center gap-1.5">
                    <Linkedin size={10} style={{ color: colorScheme.accent }} />
                    <LinkedText url={personalInfo.linkedin} className="text-gray-600 break-all">
                      {formatDisplayUrl(personalInfo.linkedin)}
                    </LinkedText>
                  </p>
                )}
                {personalInfo.github && (
                  <p className="flex items-center gap-1.5">
                    <Github size={10} style={{ color: colorScheme.accent }} />
                    <LinkedText url={personalInfo.github} className="text-gray-600 break-all">
                      {formatDisplayUrl(personalInfo.github)}
                    </LinkedText>
                  </p>
                )}
                {personalInfo.website && (
                  <p className="flex items-center gap-1.5">
                    <ExternalLink size={10} style={{ color: colorScheme.accent }} />
                    <LinkedText url={personalInfo.website} className="text-gray-600 break-all">
                      {formatDisplayUrl(personalInfo.website)}
                    </LinkedText>
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
