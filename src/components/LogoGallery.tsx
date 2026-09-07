import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GeneratedLogo } from '@/types';

interface LogoGalleryProps {
  logos: GeneratedLogo[];
  onClear: () => void;
}

const modeLabels = {
  text: 'Text to Logo',
  image: 'Image to Logo',
  hybrid: 'Hybrid Mode',
};

export function LogoGallery({ logos, onClear }: LogoGalleryProps) {
  const downloadLogo = (url: string, id: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `logo-${id}.png`;
    a.click();
  };

  if (logos.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full glass flex items-center justify-center">
          <div className="text-4xl">🎨</div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Logos Yet</h3>
        <p className="text-sm text-gray-500">
          Start creating your first AI logo!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Generation History</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-gray-400 hover:text-white hover:bg-white/5"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="group relative glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5"
          >
            <div className="aspect-square bg-white/5 flex items-center justify-center p-4">
              <img
                src={logo.url}
                alt={logo.prompt}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
            
            <div className="p-4 space-y-2">
              <div className="text-xs text-white/80 font-medium">
                {modeLabels[logo.mode]}
              </div>
              <p className="text-sm text-gray-300 line-clamp-2">
                {logo.prompt}
              </p>
              <div className="text-xs text-gray-500">
                {new Date(logo.timestamp).toLocaleString('en-US')}
              </div>
            </div>

            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glass-strong"
              onClick={() => downloadLogo(logo.url, logo.id)}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
