import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { GeneratorForm } from '@/components/GeneratorForm';
import { LogoGallery } from '@/components/LogoGallery';
import { useLogoGeneration } from '@/hooks/useLogoGeneration';

const queryClient = new QueryClient();

function AppContent() {
  const { generate, isGenerating, history, clearHistory } = useLogoGeneration();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gradient mb-3">
                Create Professional App Logos
              </h2>
              <p className="text-gray-400">
                Generate unique 512x512 logo designs in seconds using AI technology
              </p>
            </div>
            
            <GeneratorForm
              onGenerate={(prompt, mode, referenceImage) => {
                generate({ prompt, mode, referenceImage });
              }}
              isGenerating={isGenerating}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card rounded-2xl p-6">
              <LogoGallery logos={history} onClear={clearHistory} />
            </div>
          </div>
        </div>
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
