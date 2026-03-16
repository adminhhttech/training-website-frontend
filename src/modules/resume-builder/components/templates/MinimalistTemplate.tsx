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


interface MinimalistTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  visibleSections?: VisibleSections;
  sectionOrder?: SectionKey[];
}

export function MinimalistTemplate({ data, colorScheme, visibleSections, sectionOrder = DEFAULT_SECTION_ORDER }: MinimalistTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certificates, awards } = data;
  
  const isVisible = (section: keyof VisibleSections) => visibleSections?.[section] ?? true;

  const renderSection = (sectionKey: SectionKey): React.ReactNode => {
    switch (sectionKey) {
      case 'summary':
        return isVisible('summary') && personalInfo.summary ? (
          <section key="summary" className="mb-6">
            <p className="text-gray-600 text-xs leading-relaxed">
              {personalInfo.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return isVisible('experience') && experience.length > 0 ? (
          <section key="experience" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: colorScheme.primary }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500">
                      {exp.startDate}
                    </p>
                    <p className="text-xs text-gray-500">
                      {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-semibold text-sm" style={{ color: colorScheme.primary }}>
                      {exp.position}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: colorScheme.secondary }}>
                      {exp.company}{exp.location && ` — ${exp.location}`}
                    </p>
                    <ul className="text-gray-600 space-y-1 text-xs">
                      {exp.description.map((desc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gray-300 mt-0.5">—</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return isVisible('education') && education.length > 0 ? (
          <section key="education" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: colorScheme.primary }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-semibold text-sm" style={{ color: colorScheme.primary }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <p className="text-xs" style={{ color: colorScheme.secondary }}>
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500 mt-0.5">GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return isVisible('skills') && skills.length > 0 ? (
          <section key="skills" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: colorScheme.primary }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 text-xs border"
                  style={{ borderColor: `${colorScheme.accent}50`, color: colorScheme.text }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return isVisible('projects') && projects.length > 0 ? (
          <section key="projects" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: colorScheme.primary }}>
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-xs" style={{ color: colorScheme.primary }}>
                    {project.link ? (
                      <LinkedText url={project.link}>{project.name}</LinkedText>
                    ) : project.name}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">{project.description}</p>
                  {project.technologies && (
                    <p className="text-xs mt-1" style={{ color: colorScheme.accent }}>
                      {project.technologies.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return isVisible('certificates') && certificates.length > 0 ? (
          <section key="certificates">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: colorScheme.primary }}>
              Certifications
            </h2>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <p className="font-medium text-gray-700">
                    {cert.link ? (
                      <LinkedText url={cert.link}>{cert.name}</LinkedText>
                    ) : cert.name}
                  </p>
                  <p className="text-gray-500">{cert.issuer} · {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return isVisible('awards') && awards.length > 0 ? (
          <section key="awards">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: colorScheme.primary }}>
              Awards
            </h2>
            <div className="space-y-2">
              {awards.map((award) => (
                <div key={award.id} className="text-xs">
                  <p className="font-medium text-gray-700">{award.title}</p>
                  <p className="text-gray-500">{award.issuer} · {award.date}</p>
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
    <div className="w-full bg-white text-gray-800 font-sans text-sm" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      {/* Clean Header */}
      <div className="px-8 py-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-1" style={{ color: colorScheme.primary }}>
              {personalInfo.fullName}
            </h1>
            <p className="text-base font-medium" style={{ color: colorScheme.accent }}>
              {personalInfo.title}
            </p>
          </div>
          
          {/* Contact - Right Aligned */}
          <div className="text-right text-xs text-gray-600 space-y-1">
            {personalInfo.email && (
              <p className="flex items-center justify-end gap-1.5">
                <LinkedText url={personalInfo.email} className="text-gray-600">
                  {personalInfo.email}
                </LinkedText>
                <Mail size={10} style={{ color: colorScheme.secondary }} />
              </p>
            )}
            {personalInfo.phone && (
              <p className="flex items-center justify-end gap-1.5">
                {personalInfo.phone}
                <Phone size={10} style={{ color: colorScheme.secondary }} />
              </p>
            )}
            {personalInfo.location && (
              <p className="flex items-center justify-end gap-1.5">
                {personalInfo.location}
                <MapPin size={10} style={{ color: colorScheme.secondary }} />
              </p>
            )}
            {personalInfo.linkedin && (
              <p className="flex items-center justify-end gap-1.5">
                <LinkedText url={personalInfo.linkedin} className="text-gray-600">
                  {formatDisplayUrl(personalInfo.linkedin)}
                </LinkedText>
                <Linkedin size={10} style={{ color: colorScheme.secondary }} />
              </p>
            )}
            {personalInfo.github && (
              <p className="flex items-center justify-end gap-1.5">
                <LinkedText url={personalInfo.github} className="text-gray-600">
                  {formatDisplayUrl(personalInfo.github)}
                </LinkedText>
                <Github size={10} style={{ color: colorScheme.secondary }} />
              </p>
            )}
            {personalInfo.website && (
              <p className="flex items-center justify-end gap-1.5">
                <LinkedText url={personalInfo.website} className="text-gray-600">
                  {formatDisplayUrl(personalInfo.website)}
                </LinkedText>
                <Globe size={10} style={{ color: colorScheme.secondary }} />
              </p>
            )}
          </div>
        </div>

        {/* Thin Divider */}
        <div className="mt-6 h-px" style={{ backgroundColor: colorScheme.accent }} />
      </div>

      <div className="px-8 pb-8">
        {sectionOrder.map(sectionKey => renderSection(sectionKey))}
      </div>
    </div>
  );
}
