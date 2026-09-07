import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { generateLogo } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { GeneratedLogo, GenerateLogoParams } from '@/types';
import { toast } from 'sonner';

export function useLogoGeneration() {
  const [history, setHistory] = useState<GeneratedLogo[]>([]);

  // Fetch history from database
  const { data: dbHistory, refetch } = useQuery({
    queryKey: ['logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Failed to fetch logos:', error);
        return [];
      }
      
      return data.map(logo => ({
        id: logo.id,
        url: logo.image_url,
        prompt: logo.prompt,
        mode: logo.mode as GeneratedLogo['mode'],
        timestamp: new Date(logo.created_at).getTime(),
        referenceImage: logo.reference_image_url || undefined,
      }));
    },
  });

  // Update local state when DB data changes
  useEffect(() => {
    if (dbHistory) {
      setHistory(dbHistory);
    }
  }, [dbHistory]);

  const mutation = useMutation({
    mutationFn: generateLogo,
    onSuccess: () => {
      // Refetch from database to get the latest record
      refetch();
      toast.success('Logo generated successfully!');
    },
    onError: (error) => {
      console.error('Generation failed:', error);
      toast.error(`Generation failed: ${error.message}`);
    },
  });

  const clearHistory = async () => {
    // Clear database records
    const { error } = await supabase
      .from('logos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (error) {
      console.error('Failed to clear history:', error);
      toast.error('Failed to clear history, please try again');
      return;
    }
    
    setHistory([]);
    toast.info('History cleared successfully');
  };

  return {
    generate: mutation.mutate,
    isGenerating: mutation.isPending,
    history,
    clearHistory,
  };
}
