import {
  ResumeData,
  ColorScheme,
  VisibleSections,
  SectionKey,
} from "../../types/resume";

import { LinkedText } from "../LinkedText";


interface ClassicTemplateProps {
  data: ResumeData;
  colorScheme: ColorScheme;
  showPhoto: boolean;
  visibleSections: VisibleSections;
  sectionOrder: SectionKey[];
}

export function ClassicTemplate({ data, colorScheme, showPhoto, visibleSections, sectionOrder }: ClassicTemplateProps) {
  const renderSection = (sectionKey: SectionKey) => {
    if (!visibleSections[sectionKey]) return null;

    switch (sectionKey) {
      case 'summary':
        return data.personalInfo.summary ? (
          <div key={sectionKey} className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colorScheme.primary }}>
              Professional Summary
            </h3>
            <p className="text-[10px] leading-relaxed text-justify" style={{ color: colorScheme.text }}>
              {data.personalInfo.summary}
            </p>
          </div>
        ) : null;

      case 'experience':
        return data.experience.length > 0 ? (
          <div key={sectionKey} className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colorScheme.primary }}>
              Professional Experience
            </h3>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <span className="font-bold text-[11px]" style={{ color: colorScheme.text }}>{exp.position}</span>
                      <span className="text-[10px] mx-1">at</span>
                      <span className="font-medium text-[10px]" style={{ color: colorScheme.secondary }}>{exp.company}</span>
                    </div>
                    <span className="text-[9px] italic" style={{ color: colorScheme.accent }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <ul className="text-[10px] space-y-0.5 ml-3">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="list-disc" style={{ color: colorScheme.text }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return data.education.length > 0 ? (
          <div key={sectionKey} className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colorScheme.primary }}>
              Education
            </h3>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <div className="font-bold text-[10px]" style={{ color: colorScheme.text }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </div>
                    <div className="text-[10px] italic" style={{ color: colorScheme.secondary }}>{edu.institution}</div>
                  </div>
                  <span className="text-[9px]" style={{ color: colorScheme.accent }}>{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return data.skills.length > 0 ? (
          <div key={sectionKey} className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colorScheme.primary }}>
              Skills
            </h3>
            <p className="text-[10px]" style={{ color: colorScheme.text }}>
              {data.skills.map(s => s.name).join(' • ')}
            </p>
          </div>
        ) : null;

      case 'projects':
        return data.projects.length > 0 ? (
          <div key={sectionKey} className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colorScheme.primary }}>
              Projects
            </h3>
            <div className="space-y-2">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <div className="font-bold text-[10px]" style={{ color: colorScheme.text }}>
                    {p.link ? <LinkedText url={p.link}>{p.name}</LinkedText> : p.name}
                  </div>
                  <div className="text-[10px]" style={{ color: colorScheme.secondary }}>{p.description}</div>
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
    <div className="w-full h-full bg-white p-6 font-serif">
      <div className="text-center mb-4">
        <div className="border-t-2 border-b-2 py-3" style={{ borderColor: colorScheme.primary }}>
          <h1 className="text-2xl font-bold uppercase tracking-[0.3em]" style={{ color: colorScheme.primary }}>
            {data.personalInfo.fullName}
          </h1>
          <p className="text-[11px] mt-1 tracking-widest uppercase" style={{ color: colorScheme.secondary }}>{data.personalInfo.title}</p>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[9px]" style={{ color: colorScheme.text }}>
          {data.personalInfo.email && <LinkedText url={data.personalInfo.email}>{data.personalInfo.email}</LinkedText>}
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
          <span>|</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
      {sectionOrder.map(renderSection)}
    </div>
  );
}
