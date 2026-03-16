

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Download, Loader2 } from 'lucide-react';

// interface PDFExportProps {
//   targetRef: React.RefObject<HTMLDivElement>;
//   fileName?: string;
// }

// export function PDFExport({ targetRef, fileName = 'resume' }: PDFExportProps) {
//   const [isExporting, setIsExporting] = useState(false);

//   const handleExport = async () => {
//     if (!targetRef.current) {
//       return;
//     }

//     setIsExporting(true);

//     try {
//       const element = targetRef.current;
      
//       // Clone the element to avoid modifying the original
//       const clone = element.cloneNode(true) as HTMLElement;
      
//       // Create a temporary container
//       const container = document.createElement('div');
//       container.style.position = 'absolute';
//       container.style.left = '-9999px';
//       container.style.top = '0';
//       container.style.width = '210mm'; // A4 width
//       container.style.background = 'white';
//       container.style.padding = '0';
//       container.style.margin = '0';
      
//       // Reset any transforms or scaling
//       clone.style.transform = 'none';
//       clone.style.transformOrigin = 'top left';
//       clone.style.width = '100%';
//       clone.style.maxWidth = '210mm';
      
//       container.appendChild(clone);
//       document.body.appendChild(container);

//       // Wait for fonts and images to load
//       await document.fonts.ready;
//       await new Promise(resolve => setTimeout(resolve, 100));

//       // Use browser's native print functionality
//       const printWindow = window.open('', '_blank');
      
//       if (!printWindow) {
//         throw new Error('Please allow popups to download PDF');
//       }

//       // Get all stylesheets
//       const styles = Array.from(document.styleSheets)
//         .map(styleSheet => {
//           try {
//             return Array.from(styleSheet.cssRules)
//               .map(rule => rule.cssText)
//               .join('\n');
//           } catch (e) {
//             return '';
//           }
//         })
//         .join('\n');

//       // Create print document
//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>${fileName}</title>
//             <meta charset="utf-8">
//             <style>
//               * {
//                 margin: 0;
//                 padding: 0;
//                 box-sizing: border-box;
//               }
              
//               @page {
//                 size: A4;
//                 margin: 0;
//               }
              
//               @media print {
//                 html, body {
//                   width: 210mm;
//                   height: 297mm;
//                   margin: 0;
//                   padding: 0;
//                   background: white;
//                   -webkit-print-color-adjust: exact;
//                   print-color-adjust: exact;
//                   color-adjust: exact;
//                 }
                
//                 body {
//                   font-size: 12pt;
//                   line-height: 1.5;
//                 }
                
//                 * {
//                   -webkit-print-color-adjust: exact !important;
//                   print-color-adjust: exact !important;
//                   color-adjust: exact !important;
//                 }
//               }
              
//               body {
//                 width: 210mm;
//                 margin: 0 auto;
//                 background: white;
//                 font-family: system-ui, -apple-system, sans-serif;
//               }
              
//               ${styles}
//             </style>
//           </head>
//           <body>
//             ${clone.innerHTML}
//           </body>
//         </html>
//       `);
      
//       printWindow.document.close();
      
//       // Wait for content to load
//       await new Promise(resolve => {
//         printWindow.onload = resolve;
//         setTimeout(resolve, 500);
//       });
      
//       // Trigger print dialog
//       printWindow.focus();
//       printWindow.print();
      
//       // Close the window after printing (or if user cancels)
//       setTimeout(() => {
//         printWindow.close();
//         document.body.removeChild(container);
//       }, 100);

//     } catch (error) {
//       console.error('PDF export error:', error);
//       alert('There was an error exporting your resume. Please try again.');
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <Button
//       onClick={handleExport}
//       disabled={isExporting}
//       size="sm"
//       className="gap-1.5 sm:gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-2.5 sm:px-4"
//     >
//       {isExporting ? (
//         <Loader2 className="w-4 h-4 animate-spin" />
//       ) : (
//         <Download className="w-4 h-4" />
//       )}
//       <span className="hidden sm:inline">Download as PDF</span>
//       <span className="sm:hidden">PDF</span>
//     </Button>
//   );
// }


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface PDFExportProps {
  targetRef: React.RefObject<HTMLDivElement>;
  fileName?: string;
}

export function PDFExport({ targetRef, fileName = 'resume' }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleDesktopExport = async (element: HTMLElement) => {
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Please allow popups to download PDF');
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
            
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color-adjust: exact;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
            
            body {
              width: 210mm;
              margin: 0 auto;
              background: white;
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            ${styles}
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    await new Promise(resolve => {
      printWindow.onload = resolve;
      setTimeout(resolve, 500);
    });
    
    printWindow.focus();
    printWindow.print();
    
    setTimeout(() => {
      printWindow.close();
    }, 100);
  };

  const handleMobileExport = async (element: HTMLElement) => {
    // Create a print-ready version
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    // Create full HTML document
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 100%;
      background: white;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
    
    ${styles}
  </style>
</head>
<body>
  ${element.innerHTML}
  <script>
    // Auto-trigger print on mobile
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    // Create blob and open in new tab
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new tab - mobile browsers will show print option
    const newWindow = window.open(url, '_blank');
    
    if (!newWindow) {
      // Fallback: create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Cleanup after delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  const handleExport = async () => {
    if (!targetRef.current) {
      return;
    }

    setIsExporting(true);

    try {
      const element = targetRef.current;
      
      // Clone to avoid modifying original
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.transformOrigin = 'top left';
      
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.appendChild(clone);
      document.body.appendChild(container);

      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 100));

      if (isMobile) {
        await handleMobileExport(clone);
      } else {
        await handleDesktopExport(clone);
      }

      document.body.removeChild(container);

    } catch (error) {
      console.error('PDF export error:', error);
      alert('There was an error exporting your resume. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      size="sm"
      className="gap-1.5 sm:gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-2.5 sm:px-4"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">Download as PDF</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  );
}