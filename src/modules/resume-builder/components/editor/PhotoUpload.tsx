import { useRef } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function PhotoUpload() {
  const { resumeData, updatePersonalInfo } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { photo } = resumeData.personalInfo;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 2MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Compress and resize image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        updatePersonalInfo({ photo: compressedDataUrl });
        
        toast({
          title: 'Photo uploaded',
          description: 'Your profile photo has been added',
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updatePersonalInfo({ photo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: 'Photo removed',
      description: 'Your profile photo has been removed',
    });
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="relative">
        {photo ? (
          <div className="relative">
            <img
              src={photo}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-accent"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
            <Camera className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Profile Photo</p>
        <p className="text-xs text-muted-foreground mb-2">JPG or PNG, max 2MB</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 text-xs"
        >
          {photo ? 'Change Photo' : 'Upload Photo'}
        </Button>
      </div>
    </div>
  );
}
