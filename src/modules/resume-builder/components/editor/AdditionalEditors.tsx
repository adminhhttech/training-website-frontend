import { Award, Medal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useResume } from "../../contexts/ResumeContext";
import { Certificate, Award as AwardType } from "../../types/resume";
import { SortableList } from "../../hooks/useDragAndDrop";

import { EditSection, AddButton } from "./EditSection";


export function CertificatesEditor() {
  const { resumeData, addCertificate, updateCertificate, removeCertificate, reorderCertificates } = useResume();
  const { certificates } = resumeData;

  const handleAddCertificate = () => {
    const newCert: Certificate = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
    };
    addCertificate(newCert);
  };

  return (
    <EditSection 
      title="Certifications" 
      icon={<Award className="w-5 h-5 text-accent" />}
    >
      <div className="space-y-2">
        <SortableList 
          items={certificates} 
          onReorder={reorderCertificates}
          onDelete={removeCertificate}
          renderItem={(cert) => (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Certificate Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertificate(cert.id, { name: e.target.value })}
                  placeholder="AWS Solutions Architect"
                  className="mt-1 h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Issuer</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertificate(cert.id, { issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    value={cert.date}
                    onChange={(e) => updateCertificate(cert.id, { date: e.target.value })}
                    placeholder="2023"
                    className="mt-1 h-8"
                  />
                </div>
              </div>
            </div>
          )}
        />
        <AddButton onClick={handleAddCertificate} label="Add Certificate" />
      </div>
    </EditSection>
  );
}

export function AwardsEditor() {
  const { resumeData, addAward, updateAward, removeAward, reorderAwards } = useResume();
  const { awards } = resumeData;

  const handleAddAward = () => {
    const newAward: AwardType = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    addAward(newAward);
  };

  return (
    <EditSection 
      title="Awards" 
      icon={<Medal className="w-5 h-5 text-accent" />}
    >
      <div className="space-y-2">
        <SortableList 
          items={awards} 
          onReorder={reorderAwards}
          onDelete={removeAward}
          renderItem={(award) => (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Award Title</Label>
                <Input
                  value={award.title}
                  onChange={(e) => updateAward(award.id, { title: e.target.value })}
                  placeholder="Best Innovation Award"
                  className="mt-1 h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Issuer</Label>
                  <Input
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                    placeholder="Company or Organization"
                    className="mt-1 h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    value={award.date}
                    onChange={(e) => updateAward(award.id, { date: e.target.value })}
                    placeholder="2023"
                    className="mt-1 h-8"
                  />
                </div>
              </div>
            </div>
          )}
        />
        <AddButton onClick={handleAddAward} label="Add Award" />
      </div>
    </EditSection>
  );
}
