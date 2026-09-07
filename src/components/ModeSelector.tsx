import { Type, Image, Combine } from 'lucide-react';
import type { GenerationMode } from '@/types';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  selectedMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

const modes = [
  { value: 'text' as const, label: 'Text to Logo', icon: Type, description: 'Describe with words' },
  { value: 'image' as const, label: 'Image to Logo', icon: Image, description: 'Upload reference' },
  { value: 'hybrid' as const, label: 'Hybrid Mode', icon: Combine, description: 'Combine both' },
];

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.value;
        
        return (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-300",
              "hover:scale-105",
              isSelected
                ? "glass-strong shadow-lg shadow-white/5"
                : "glass hover:border-white/20"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={cn(
                "p-3 rounded-2xl",
                isSelected ? "glass-strong" : "bg-white/5"
              )}>
                <Icon className={cn(
                  "w-6 h-6",
                  isSelected ? "text-white" : "text-gray-400"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold",
                  isSelected ? "text-white" : "text-gray-300"
                )}>
                  {mode.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {mode.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
