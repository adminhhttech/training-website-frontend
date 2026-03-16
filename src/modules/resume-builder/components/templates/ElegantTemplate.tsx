import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";

interface ElegantTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  showPhoto: boolean;
  visibleSections: VisibleSections;
  sectionOrder: SectionKey[];
}

export function ElegantTemplate({ data, colorScheme, visibleSections, sectionOrder }: ElegantTemplateProps) {
  const { personalInfo } = data;

  const Title = ({ children }: { children: string }) => (
    <div className="flex items-center gap-3 mb-2">
      <div className="h-px flex-1" style={{ backgroundColor: `${colorScheme.secondary}66` }} />
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: colorScheme.primary }}>
        {children}
      </h3>
      <div className="h-px flex-1" style={{ backgroundColor: `${colorScheme.secondary}66` }} />
    </div>
  );

  const renderSection = (sectionKey: SectionKey) => {
    if (!visibleSections[sectionKey]) return null;

    switch (sectionKey) {
      case 'summary':
        return personalInfo.summary ? (
          <section key={sectionKey} className="mb-5">
            <p className="text-[10px] leading-relaxed" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length ? (
          <section key={sectionKey} className="mb-5">
            <Title>Experience</Title>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[11px] truncate" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: colorScheme.secondary }}>
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-[9px] whitespace-nowrap" style={{ color: colorScheme.accent }}>
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="text-[9px] mt-1 space-y-0.5">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex gap-1.5">
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
          <section key={sectionKey} className="mb-5">
            <Title>Education</Title>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[10px] truncate" style={{ color: colorScheme.primary }}>
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="text-[9px] truncate" style={{ color: colorScheme.text }}>
                      {edu.institution}
                    </div>
                  </div>
                  <span className="text-[9px] whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length ? (
          <section key={sectionKey} className="mb-5">
            <Title>Expertise</Title>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-[9px] px-3 py-1 rounded-full border"
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
          <section key={sectionKey} className="mb-5">
            <Title>Projects</Title>
            <div className="space-y-2">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <div className="font-semibold text-[10px]" style={{ color: colorScheme.primary }}>
                    {p.link ? (
                      <LinkedText url={p.link} color={colorScheme.primary}>
                        {p.name}
                      </LinkedText>
                    ) : (
                      p.name
                    )}
                  </div>
                  <div className="text-[9px]" style={{ color: colorScheme.text }}>
                    {p.description}
                  </div>
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="text-[8px] mt-0.5" style={{ color: colorScheme.secondary }}>
                      {p.technologies.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return data.certificates.length ? (
          <section key={sectionKey} className="mb-5">
            <Title>Certificates</Title>
            <div className="space-y-1">
              {data.certificates.map((c) => (
                <div key={c.id} className="flex justify-between gap-3 text-[9px]">
                  <span className="truncate" style={{ color: colorScheme.text }}>
                    {c.name}
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
          <section key={sectionKey} className="mb-5">
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
    <div className="w-full h-full bg-white p-6 font-serif">
      <header className="mb-5">
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase" style={{ color: colorScheme.primary }}>
            {personalInfo.fullName}
          </h1>
          <div className="h-0.5 w-16 mx-auto mt-2" style={{ backgroundColor: colorScheme.accent }} />
          <p className="text-[11px] mt-2 tracking-wider" style={{ color: colorScheme.secondary }}>
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 mt-2 text-[9px]" style={{ color: colorScheme.text }}>
            <LinkedText url={`mailto:${personalInfo.email}`} color={colorScheme.text}>
              {personalInfo.email}
            </LinkedText>
            <LinkedText url={`tel:${personalInfo.phone}`} color={colorScheme.text}>
              {personalInfo.phone}
            </LinkedText>
            <span>{personalInfo.location}</span>
            {personalInfo.linkedin && (
              <LinkedText url={personalInfo.linkedin} color={colorScheme.primary}>
                LinkedIn
              </LinkedText>
            )}
            {personalInfo.github && (
              <LinkedText url={personalInfo.github} color={colorScheme.primary}>
                GitHub
              </LinkedText>
            )}
            {personalInfo.website && (
              <LinkedText url={personalInfo.website} color={colorScheme.primary}>
                {formatDisplayUrl(personalInfo.website)}
              </LinkedText>
            )}
          </div>
        </div>
      </header>

      <main>{sectionOrder.map(renderSection)}</main>
    </div>
  );
}
