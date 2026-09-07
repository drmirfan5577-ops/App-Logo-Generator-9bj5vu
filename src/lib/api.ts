import { supabase } from './supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';
import type { GenerateLogoParams } from '@/types';

export async function generateLogo(params: GenerateLogoParams) {
  console.log('Generating logo with params:', params);
  
  const { data, error } = await supabase.functions.invoke('generate-logo', {
    body: params,
  });

  if (error) {
    let errorMessage = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const statusCode = error.context?.status ?? 500;
        const textContent = await error.context?.text();
        errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
      } catch {
        errorMessage = `${error.message || 'Failed to read response'}`;
      }
    }
    console.error('Logo generation error:', errorMessage);
    throw new Error(errorMessage);
  }

  console.log('Logo generated successfully:', data);
  return data;
}
