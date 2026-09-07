import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-white/5 glass backdrop-blur-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl glass-strong">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">AI Logo Generator</h1>
            <p className="text-xs text-muted-foreground">Powered by nanobanana pro</p>
          </div>
        </div>
      </div>
    </header>
  );
}
