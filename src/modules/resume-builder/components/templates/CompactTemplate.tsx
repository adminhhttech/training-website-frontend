import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";


interface CompactTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  showPhoto: boolean;
  visibleSections: VisibleSections;
  sectionOrder: SectionKey[];
}

export function CompactTemplate({ data, colorScheme, visibleSections, sectionOrder }: CompactTemplateProps) {
  const { personalInfo } = data;

  const SectionTitle = ({ children }: { children: string }) => (
    <h3
      className="text-[11px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b"
      style={{ color: colorScheme.primary, borderColor: `${colorScheme.primary}55` }}
    >
      {children}
    </h3>
  );

  const renderSection = (sectionKey: SectionKey) => {
    if (!visibleSections[sectionKey]) return null;

    switch (sectionKey) {
      case 'summary':
        return personalInfo.summary ? (
          <section key={sectionKey} className="mb-3">
            <p className="text-[10px] leading-relaxed" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length ? (
          <section key={sectionKey} className="mb-3">
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-2">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[10px] truncate" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </div>
                      <div className="text-[9px] truncate" style={{ color: colorScheme.text }}>
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-[8px] whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="text-[9px] mt-0.5 space-y-0.5">
                    {exp.description.slice(0, 2).map((desc, i) => (
                      <li key={i} className="flex gap-1">
                        <span style={{ color: colorScheme.accent }}>•</span>
                        <span style={{ color: colorScheme.text }}>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return data.education.length ? (
          <section key={sectionKey} className="mb-3">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-1.5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[10px] truncate" style={{ color: colorScheme.primary }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
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

      case 'skills':
        return data.skills.length ? (
          <section key={sectionKey} className="mb-3">
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${colorScheme.primary}14`, color: colorScheme.primary }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects.length ? (
          <section key={sectionKey} className="mb-3">
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-1.5">
              {data.projects.slice(0, 2).map((p) => (
                <div key={p.id}>
                  <div className="font-semibold text-[10px]" style={{ color: colorScheme.primary }}>
                    {p.link ? <LinkedText url={p.link}>{p.name}</LinkedText> : p.name}
                  </div>
                  <div className="text-[9px]" style={{ color: colorScheme.text }}>
                    {p.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return data.certificates.length ? (
          <section key={sectionKey} className="mb-3">
            <SectionTitle>Certificates</SectionTitle>
            <div className="space-y-1">
              {data.certificates.slice(0, 3).map((c) => (
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
          <section key={sectionKey} className="mb-3">
            <SectionTitle>Awards</SectionTitle>
            <div className="space-y-1">
              {data.awards.slice(0, 2).map((a) => (
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
    <div className="w-full h-full bg-white p-4 font-sans">
      <header className="text-center mb-3 pb-2 border-b-2" style={{ borderColor: colorScheme.primary }}>
        <h1 className="text-lg font-bold tracking-tight" style={{ color: colorScheme.primary }}>
          {personalInfo.fullName}
        </h1>
        <p className="text-[10px] font-medium" style={{ color: colorScheme.secondary }}>
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[8px]" style={{ color: colorScheme.text }}>
          {personalInfo.email && <LinkedText url={personalInfo.email}>{personalInfo.email}</LinkedText>}
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
        </div>
      </header>

      <main className="text-[10px]">{sectionOrder.map(renderSection)}</main>
    </div>
  );
}
