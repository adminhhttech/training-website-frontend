export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Pattern overlay */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.08]" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="education-pattern" 
            x="0" 
            y="0" 
            width="120" 
            height="120" 
            patternUnits="userSpaceOnUse"
          >
            {/* Graduation Cap */}
            <path 
              d="M15 25 L25 20 L35 25 L25 30 Z M25 30 L25 36 M20 33 L20 38 M30 33 L30 38" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Book */}
            <path 
              d="M80 15 C80 15 87 12 94 15 L94 32 C94 32 87 29 80 32 Z M94 15 C94 15 101 12 108 15 L108 32 C108 32 101 29 94 32 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Pencil */}
            <path 
              d="M12 70 L22 60 L26 64 L16 74 L10 76 Z M22 60 L26 56 L30 60 L26 64" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Document/Resume */}
            <path 
              d="M60 55 L78 55 L78 80 L55 80 L55 60 Z M55 60 L60 60 L60 55 M58 66 L75 66 M58 71 L75 71 M58 76 L68 76" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Briefcase */}
            <path 
              d="M12 95 L35 95 L35 112 L12 112 Z M18 95 L18 92 L29 92 L29 95 M12 100 L35 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Target */}
            <circle 
              cx="95" 
              cy="100" 
              r="10" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <circle 
              cx="95" 
              cy="100" 
              r="4" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <circle cx="95" cy="100" r="1" fill="currentColor" />
            
            {/* Code brackets */}
            <path 
              d="M48 22 L40 32 L48 42 M62 22 L70 32 L62 42" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Star */}
            <path 
              d="M95 50 L98 58 L106 58 L100 63 L102 71 L95 67 L88 71 L90 63 L84 58 L92 58 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            
            {/* Lightbulb */}
            <path 
              d="M55 12 C50 12 47 16 47 20 C47 24 49 27 52 29 L52 34 L58 34 L58 29 C61 27 63 24 63 20 C63 16 60 12 55 12 Z M52 36 L58 36 M53 38 L57 38" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gear/Settings */}
            <path 
              d="M55 95 L55 92 L58 92 L58 95 M55 108 L55 111 L58 111 L58 108 M63 98 L65 96 L67 98 L65 100 M46 98 L48 96 L50 98 L48 100 M63 105 L65 107 L67 105 L65 103 M46 105 L48 107 L50 105 L48 103" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <circle 
              cx="56.5" 
              cy="101.5" 
              r="5" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#education-pattern)" 
          className="text-primary"
        />
      </svg>
    </div>
  );
}