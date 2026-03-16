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


interface ProfessionalTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  visibleSections?: VisibleSections;
  sectionOrder?: SectionKey[];
}

export function ProfessionalTemplate({ data, colorScheme, visibleSections, sectionOrder = DEFAULT_SECTION_ORDER }: ProfessionalTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certificates, awards } = data;
  
  const isVisible = (section: keyof VisibleSections) => visibleSections?.[section] ?? true;

  // Section renderers
  const renderSection = (sectionKey: SectionKey): React.ReactNode => {
    switch (sectionKey) {
      case 'summary':
        return isVisible('summary') && personalInfo.summary ? (
          <section key="summary">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Professional Summary
            </h2>
            <p className="text-gray-600 leading-relaxed text-xs">
              {personalInfo.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return isVisible('experience') && experience.length > 0 ? (
          <section key="experience">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </h3>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>
                        {exp.company}{exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5 text-xs ml-2">
                    {exp.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return isVisible('education') && education.length > 0 ? (
          <section key="education">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold" style={{ color: colorScheme.primary }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p className="text-xs" style={{ color: colorScheme.secondary }}>
                        {edu.institution}{edu.location && ` • ${edu.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return isVisible('skills') && skills.length > 0 ? (
          <section key="skills">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: colorScheme.primary }}>
                    {skill.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${skill.level}%`, backgroundColor: colorScheme.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return isVisible('projects') && projects.length > 0 ? (
          <section key="projects">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((project) => (
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
                          className="px-2 py-0.5 text-xs rounded"
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
          </section>
        ) : null;

      case 'certificates':
        return isVisible('certificates') && certificates.length > 0 ? (
          <section key="certificates">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Certifications
            </h2>
            <div className="space-y-1.5">
              {certificates.map((cert) => (
                <div key={cert.id}>
                  <p className="font-medium text-xs" style={{ color: colorScheme.primary }}>
                    {cert.link ? (
                      <LinkedText url={cert.link}>{cert.name}</LinkedText>
                    ) : cert.name}
                  </p>
                  <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return isVisible('awards') && awards.length > 0 ? (
          <section key="awards">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}>
              Awards
            </h2>
            <div className="space-y-1.5">
              {awards.map((award) => (
                <div key={award.id}>
                  <p className="font-medium text-xs" style={{ color: colorScheme.primary }}>{award.title}</p>
                  <p className="text-xs text-gray-500">{award.issuer} • {award.date}</p>
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
      {/* Header */}
      <div className="px-8 py-6 flex items-center gap-6" style={{ backgroundColor: colorScheme.primary }}>
        {/* Profile Photo */}
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className="w-20 h-20 rounded-full object-cover border-4 flex-shrink-0"
            style={{ borderColor: colorScheme.accent }}
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1 font-heading" style={{ fontFamily: 'IBM Plex Serif, serif' }}>
            {personalInfo.fullName}
          </h1>
          <p className="text-lg text-white/90 mb-3" style={{ color: colorScheme.accent }}>
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap gap-4 text-white/80 text-xs">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} />
                <LinkedText url={personalInfo.email} className="text-white/80">
                  {personalInfo.email}
                </LinkedText>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin size={12} />
                <LinkedText url={personalInfo.linkedin} className="text-white/80">
                  {formatDisplayUrl(personalInfo.linkedin)}
                </LinkedText>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github size={12} />
                <LinkedText url={personalInfo.github} className="text-white/80">
                  {formatDisplayUrl(personalInfo.github)}
                </LinkedText>
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe size={12} />
                <LinkedText url={personalInfo.website} className="text-white/80">
                  {formatDisplayUrl(personalInfo.website)}
                </LinkedText>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {sectionOrder.map(sectionKey => renderSection(sectionKey))}
      </div>
    </div>
  );
}
