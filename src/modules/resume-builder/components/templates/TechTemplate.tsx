import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";


interface TechTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  showPhoto: boolean;
  visibleSections: VisibleSections;
  sectionOrder: SectionKey[];
}

export function TechTemplate({ data, colorScheme, visibleSections, sectionOrder }: TechTemplateProps) {
  const { personalInfo } = data;

  const Title = ({ children }: { children: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorScheme.accent }} />
      <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colorScheme.primary }}>
        {children}
      </h3>
    </div>
  );

  const renderSection = (sectionKey: SectionKey) => {
    if (!visibleSections[sectionKey]) return null;

    switch (sectionKey) {
      case 'summary':
        return personalInfo.summary ? (
          <section key={sectionKey} className="mb-4">
            <Title>About</Title>
            <p className="text-[10px] leading-relaxed" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Experience</Title>
            <div className="space-y-3 border-l-2 pl-3" style={{ borderColor: `${colorScheme.accent}AA` }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[11px] truncate" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: colorScheme.secondary }}>
                        {exp.company}
                      </div>
                    </div>
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap"
                      style={{ backgroundColor: `${colorScheme.primary}12`, color: colorScheme.primary }}
                    >
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <ul className="text-[9px] mt-1 space-y-0.5">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span style={{ color: colorScheme.accent }}>›</span>
                        <span style={{ color: colorScheme.text }}>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Tech Stack</Title>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-[9px] px-2 py-1 rounded border"
                  style={{ borderColor: `${colorScheme.primary}33`, color: colorScheme.primary, backgroundColor: `${colorScheme.primary}08` }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Projects</Title>
            <div className="space-y-2">
              {data.projects.map((project) => (
                <div key={project.id} className="rounded border p-2" style={{ borderColor: `${colorScheme.primary}22` }}>
                  <div className="font-semibold text-[10px]" style={{ color: colorScheme.primary }}>
                    {project.link ? <LinkedText url={project.link}>{project.name}</LinkedText> : project.name}
                  </div>
                  <p className="text-[9px] mt-0.5" style={{ color: colorScheme.text }}>
                    {project.description}
                  </p>
                  {project.technologies?.length ? (
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[8px]" style={{ color: colorScheme.accent }}>
                      {project.technologies.map((tech, i) => (
                        <span key={i}>#{tech}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return data.education.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Education</Title>
            <div className="space-y-1.5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[10px] truncate" style={{ color: colorScheme.primary }}>
                      {edu.degree}
                    </div>
                    <div className="text-[9px] truncate" style={{ color: colorScheme.text }}>
                      {edu.institution}
                    </div>
                  </div>
                  <span className="text-[8px] whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return data.certificates.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Certificates</Title>
            <div className="space-y-1">
              {data.certificates.map((c) => (
                <div key={c.id} className="flex justify-between gap-3 text-[9px]">
                  <span className="truncate" style={{ color: colorScheme.text }}>
                    {c.link ? <LinkedText url={c.link}>{c.name}</LinkedText> : c.name}
                  </span>
                  <span className="whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                    {c.date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'awards':
        return data.awards.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Awards</Title>
            <div className="space-y-1">
              {data.awards.map((a) => (
                <div key={a.id} className="flex justify-between gap-3 text-[9px]">
                  <span className="truncate" style={{ color: colorScheme.text }}>
                    {a.title}
                  </span>
                  <span className="whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                    {a.date}
                  </span>
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
    <div className="w-full h-full bg-white p-5 font-mono">
      <header className="mb-4 pb-3 border-b-2" style={{ borderColor: colorScheme.primary }}>
        <div className="flex items-start gap-3">
          <div className="w-2 h-10 rounded" style={{ backgroundColor: colorScheme.accent }} />
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight" style={{ color: colorScheme.primary }}>
              {personalInfo.fullName}
            </h1>
            <p className="text-[11px]" style={{ color: colorScheme.secondary }}>
              {personalInfo.title}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[9px]" style={{ color: colorScheme.text }}>
              {personalInfo.email && <LinkedText url={personalInfo.email}>{personalInfo.email}</LinkedText>}
              {personalInfo.github && <LinkedText url={personalInfo.github}>{formatDisplayUrl(personalInfo.github)}</LinkedText>}
              {personalInfo.linkedin && <LinkedText url={personalInfo.linkedin}>{formatDisplayUrl(personalInfo.linkedin)}</LinkedText>}
              {personalInfo.website && <LinkedText url={personalInfo.website}>{formatDisplayUrl(personalInfo.website)}</LinkedText>}
            </div>
          </div>
        </div>
      </header>

      <main>{sectionOrder.map(renderSection)}</main>
    </div>
  );
}
