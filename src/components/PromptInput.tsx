import { Textarea } from '@/components/ui/textarea';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">Describe Your Logo</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-none glass border-white/10 focus:border-white/30 text-white placeholder:text-gray-600 rounded-2xl"
      />
      <p className="text-xs text-gray-500">
        Tip: Describe style, colors, elements and details for best results
      </p>
    </div>
  );
}
