import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeSelector } from './ModeSelector';
import { PromptInput } from './PromptInput';
import { ImageUploader } from './ImageUploader';
import type { GenerationMode } from '@/types';

interface GeneratorFormProps {
  onGenerate: (prompt: string, mode: GenerationMode, referenceImage?: string) => void;
  isGenerating: boolean;
}

export function GeneratorForm({ onGenerate, isGenerating }: GeneratorFormProps) {
  const [mode, setMode] = useState<GenerationMode>('text');
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string>();

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    if ((mode === 'image' || mode === 'hybrid') && !referenceImage) return;
    
    onGenerate(prompt, mode, referenceImage);
  };

  const canGenerate = prompt.trim() && 
    (mode === 'text' || (mode === 'image' && referenceImage) || (mode === 'hybrid' && referenceImage));

  const getPlaceholder = () => {
    switch (mode) {
      case 'text':
        return 'e.g., Minimalist tech company logo with blue gradient, modern style';
      case 'image':
        return 'e.g., Optimize the uploaded image style into a professional app logo';
      case 'hybrid':
        return 'e.g., Combine reference image colors to create an e-commerce app logo';
    }
  };

  return (
    <div className="space-y-6">
      <ModeSelector selectedMode={mode} onModeChange={setMode} />
      
      <div className="space-y-6 p-6 rounded-2xl glass-card">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          placeholder={getPlaceholder()}
        />
        
        {(mode === 'image' || mode === 'hybrid') && (
          <ImageUploader
            selectedImage={referenceImage}
            onImageSelect={setReferenceImage}
            onClear={() => setReferenceImage(undefined)}
          />
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={!canGenerate || isGenerating}
          className="w-full h-12 text-base font-semibold glass-strong hover:bg-white/20 transition-all text-white"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Logo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
