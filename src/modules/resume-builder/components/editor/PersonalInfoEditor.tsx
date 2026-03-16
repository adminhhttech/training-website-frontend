import { useResume } from '../../contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { EditSection } from './EditSection';
import { PhotoUpload } from './PhotoUpload';

export function PersonalInfoEditor() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  return (
    <EditSection 
      title="Basic Details" 
      icon={<User className="w-5 h-5 text-accent" />}
      defaultOpen={true}
    >
      <div className="space-y-3">
        {/* Photo Upload */}
        <PhotoUpload />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fullName" className="text-xs text-muted-foreground">Full Name</Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-xs text-muted-foreground">Job Title</Label>
            <Input
              id="title"
              value={personalInfo.title}
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
              placeholder="Software Developer"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email" className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="john@email.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" /> Phone
            </Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 234 567 890"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location
          </Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="San Francisco, CA"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="linkedin" className="text-xs text-muted-foreground flex items-center gap-1">
              <Linkedin className="w-3 h-3" /> LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/johndoe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="github" className="text-xs text-muted-foreground flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </Label>
            <Input
              id="github"
              value={personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
              placeholder="github.com/johndoe"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="summary" className="text-xs text-muted-foreground">Professional Summary</Label>
          <Textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            placeholder="Brief professional summary..."
            className="mt-1 min-h-[80px]"
          />
        </div>
      </div>
    </EditSection>
  );
}
