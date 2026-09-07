import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage?: string;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">Reference Image</label>
      
      {selectedImage ? (
        <div className="relative group">
          <img
            src={selectedImage}
            alt="Reference"
            className="w-full h-48 object-cover rounded-2xl border border-white/10"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glass-strong"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
            "hover:border-white/30 hover:bg-white/5",
            isDragging ? "border-white/50 bg-white/10 scale-105" : "border-white/10"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5">
              {isDragging ? (
                <ImageIcon className="w-8 h-8 text-white" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-white">
                {isDragging ? 'Drop to upload' : 'Click or drag to upload image'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PNG, JPG, WEBP formats
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />
        </div>
      )}
    </div>
  );
}
