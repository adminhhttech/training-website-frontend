import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
} from "../../types/resume";

import { LinkedText, formatDisplayUrl } from "../LinkedText";

interface AcademicTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  showPhoto: boolean;
  visibleSections: VisibleSections;
  sectionOrder: SectionKey[];
}

export function AcademicTemplate({ data, colorScheme, visibleSections, sectionOrder }: AcademicTemplateProps) {
  const { personalInfo } = data;

  const Title = ({ children }: { children: string }) => (
    <h3
      className="text-[11px] font-semibold uppercase tracking-wider mb-2 pb-1 border-b"
      style={{ color: colorScheme.primary, borderColor: `${colorScheme.secondary}88` }}
    >
      {children}
    </h3>
  );

  const renderSection = (sectionKey: SectionKey) => {
    if (!visibleSections[sectionKey]) return null;

    switch (sectionKey) {
      case 'summary':
        return personalInfo.summary ? (
          <section key={sectionKey} className="mb-4">
            <Title>Profile</Title>
            <p className="text-[10px] leading-relaxed text-justify" style={{ color: colorScheme.text }}>
              {personalInfo.summary}
            </p>
          </section>
        ) : null;

      case 'education':
        return data.education.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Education</Title>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[10px] truncate" style={{ color: colorScheme.primary }}>
                        {edu.degree} in {edu.field}
                      </div>
                      <div className="text-[10px] italic truncate" style={{ color: colorScheme.text }}>
                        {edu.institution}
                      </div>
                    </div>
                    <span className="text-[9px] whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  {edu.gpa ? (
                    <div className="text-[9px] mt-0.5" style={{ color: colorScheme.accent }}>
                      GPA: {edu.gpa}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'experience':
        return data.experience.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Experience</Title>
            <div className="space-y-2">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[10px] truncate" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </div>
                      <div className="text-[10px] italic truncate" style={{ color: colorScheme.text }}>
                        {exp.company}
                      </div>
                    </div>
                    <span className="text-[9px] whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                      {exp.startDate} – {exp.endDate}
                    </span>
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

      case 'projects':
        return data.projects.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Publications & Projects</Title>
            <div className="space-y-1.5">
              {data.projects.map((p) => (
                <div key={p.id} className="text-[9px]" style={{ color: colorScheme.text }}>
                  <span className="font-semibold" style={{ color: colorScheme.primary }}>
                    {p.link ? (
                      <LinkedText url={p.link} color={colorScheme.primary}>
                        {p.name}
                      </LinkedText>
                    ) : (
                      p.name
                    )}
                  </span>
                  <span> — {p.description}</span>
                  {p.technologies && p.technologies.length > 0 && (
                    <span className="italic" style={{ color: colorScheme.secondary }}>
                      {' '}({p.technologies.join(', ')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return data.certificates.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Certifications</Title>
            <div className="space-y-1">
              {data.certificates.map((c) => (
                <div key={c.id} className="flex justify-between gap-3 text-[9px]">
                  <span className="truncate" style={{ color: colorScheme.text }}>
                    {c.name}, <span className="italic">{c.issuer}</span>
                  </span>
                  <span className="whitespace-nowrap" style={{ color: colorScheme.secondary }}>
                    {c.date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return data.skills.length ? (
          <section key={sectionKey} className="mb-4">
            <Title>Skills</Title>
            <p className="text-[9px]" style={{ color: colorScheme.text }}>
              {data.skills.map((s) => s.name).join(', ')}
            </p>
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
    <div className="w-full h-full bg-white p-6 font-serif">
      <header className="mb-4 pb-3 border-b-2" style={{ borderColor: colorScheme.primary }}>
        <h1 className="text-xl font-bold" style={{ color: colorScheme.primary }}>
          {personalInfo.fullName}
        </h1>
        <p className="text-[11px] mt-0.5" style={{ color: colorScheme.secondary }}>
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[9px]" style={{ color: colorScheme.text }}>
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
      </header>

      <main>{sectionOrder.map(renderSection)}</main>
    </div>
  );
}
