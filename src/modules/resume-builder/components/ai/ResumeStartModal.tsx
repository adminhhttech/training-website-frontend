// import { Dialog, DialogContent } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Sparkles, FileEdit, Zap, Clock, CheckCircle2 } from 'lucide-react';

// interface ResumeStartModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onChooseAI: () => void;
//   onChooseManual: () => void;
// }

// export function ResumeStartModal({ open, onOpenChange, onChooseAI, onChooseManual }: ResumeStartModalProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-2xl border-0 shadow-heavy overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-br from-primary via-primary to-accent p-6 text-center">
//           <div className="w-16 h-16 mx-auto bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4">
//             <Sparkles className="w-8 h-8 text-primary-foreground" />
//           </div>
//           <h2 className="text-2xl font-heading font-bold text-primary-foreground">
//             Create Your Resume
//           </h2>
//           <p className="text-primary-foreground/80 mt-2 text-sm">
//             Choose how you'd like to build your resume
//           </p>
//         </div>

//         {/* Options */}
//         <div className="p-6 space-y-4">
//           {/* AI Option - Recommended */}
//           <button
//             onClick={onChooseAI}
//             className="w-full p-5 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-200 text-left group relative overflow-hidden"
//           >
//             <div className="absolute top-3 right-3">
//               <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground rounded-full">
//                 Recommended
//               </span>
//             </div>
            
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
//                 <Sparkles className="w-6 h-6 text-primary-foreground" />
//               </div>
//               <div className="flex-1 pr-20">
//                 <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
//                   Generate with AI
//                 </h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Answer a few quick questions and let AI create a professional resume for you
//                 </p>
//                 <div className="flex flex-wrap gap-3 mt-3">
//                   <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
//                     <Zap className="w-3.5 h-3.5" />
//                     2 min setup
//                   </span>
//                   <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
//                     <CheckCircle2 className="w-3.5 h-3.5" />
//                     ATS-optimized
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </button>

//           {/* Manual Option */}
//           <button
//             onClick={onChooseManual}
//             className="w-full p-5 rounded-xl border-2 border-muted hover:border-muted-foreground/30 bg-card hover:bg-muted/30 transition-all duration-200 text-left group"
//           >
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted-foreground/20 transition-colors">
//                 <FileEdit className="w-6 h-6 text-muted-foreground" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-heading font-semibold text-lg text-foreground">
//                   Start from Scratch
//                 </h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Manually fill in your details with full control over every section
//                 </p>
//                 <div className="flex flex-wrap gap-3 mt-3">
//                   <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
//                     <Clock className="w-3.5 h-3.5" />
//                     10-15 min
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="px-6 pb-6">
//           <p className="text-xs text-center text-muted-foreground">
//             You can always edit or regenerate your resume later
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, FileEdit, Zap, Clock, CheckCircle2 } from 'lucide-react';

interface ResumeStartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChooseAI: () => void;
  onChooseManual: () => void;
}

export function ResumeStartModal({ open, onOpenChange, onChooseAI, onChooseManual }: ResumeStartModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-2xl border-0 shadow-heavy overflow-hidden">
        {/* Header - Pure blue background */}
        <div className="bg-primary p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary-foreground">
            Create Your Resume
          </h2>
          <p className="text-primary-foreground/80 mt-2 text-sm">
            Choose how you'd like to build your resume
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {/* AI Option - Recommended */}
          <button
            onClick={onChooseAI}
            className="w-full p-5 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-200 text-left group relative overflow-hidden"
          >
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground rounded-full">
                Recommended
              </span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 pr-20">
                <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                  Generate with AI
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Answer a few quick questions and let AI create a professional resume for you
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    2 min setup
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ATS-optimized
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Manual Option */}
          <button
            onClick={onChooseManual}
            className="w-full p-5 rounded-xl border-2 border-muted hover:border-muted-foreground/30 bg-card hover:bg-muted/30 transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted-foreground/20 transition-colors">
                <FileEdit className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  Start from Scratch
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manually fill in your details with full control over every section
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    10-15 min
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-center text-muted-foreground">
            You can always edit or regenerate your resume later
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}