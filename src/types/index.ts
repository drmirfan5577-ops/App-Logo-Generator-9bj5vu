export type GenerationMode = 'text' | 'image' | 'hybrid';

export interface GeneratedLogo {
  id: string;
  url: string;
  prompt: string;
  mode: GenerationMode;
  timestamp: number;
  referenceImage?: string;
}

export interface LogoRecord {
  id: string;
  user_id: string | null;
  prompt: string;
  mode: GenerationMode;
  image_url: string;
  reference_image_url: string | null;
  created_at: string;
}

export interface GenerateLogoParams {
  prompt: string;
  mode: GenerationMode;
  referenceImage?: string;
}
