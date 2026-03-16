// components/ExplanationToggle.tsx

import React from 'react';
import { HelpCircle, MessageCircle } from 'lucide-react';

interface ExplanationToggleProps {
  showDuringTest: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const ExplanationToggle: React.FC<ExplanationToggleProps> = ({
  showDuringTest,
  onToggle,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 text-gray-700">
        <HelpCircle size={18} className="text-[#0080ff]" />
        <span className="text-sm font-medium">Show explanations</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => !disabled && onToggle(false)}
          disabled={disabled}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            !showDuringTest
              ? 'bg-[#0080ff] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          After submission
        </button>
        <button
          onClick={() => !disabled && onToggle(true)}
          disabled={disabled}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            showDuringTest
              ? 'bg-[#0080ff] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Real-time
        </button>
      </div>
      
      {showDuringTest && (
        <div className="flex items-center gap-1 text-xs text-[#0080ff]">
          <MessageCircle size={12} />
          <span>AI explains after each answer</span>
        </div>
      )}
    </div>
  );
};

export default ExplanationToggle;
