import { useTranslations } from 'next-intl';
import { HeroSection } from '@/components/layout/HeroSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';
import { ThreeBackground } from '@/components/animations/ThreeBackground';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="relative">
      {/* Animated Background Elements */}
      <ParticlesBackground />
      <ThreeBackground />
      
      {/* Page Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        
        {/* Temporary development message */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold mb-6 gradient-text">
                {t('title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="card p-6">
                  <h3 className="font-semibold mb-2">🎨 Modern UI</h3>
                  <p className="text-sm text-muted-foreground">
                    Built with Next.js 14, Tailwind CSS, and Framer Motion for smooth animations
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="font-semibold mb-2">🌐 Multilingual</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for English, Sinhala, and Tamil with next-intl
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="font-semibold mb-2">⚡ Real-time</h3>
                  <p className="text-sm text-muted-foreground">
                    Socket.io integration for live comments and notifications
                  </p>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-4">🔧 Development Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <h4 className="font-medium text-green-600 mb-2">✅ Completed</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Project structure setup</li>
                      <li>• Next.js 14 with App Router</li>
                      <li>• Tailwind CSS configuration</li>
                      <li>• Express.js backend foundation</li>
                      <li>• MongoDB schema design</li>
                      <li>• Internationalization setup</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-yellow-600 mb-2">🚧 In Progress</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Authentication system</li>
                      <li>• Blog CRUD operations</li>
                      <li>• 3D animations (Three.js)</li>
                      <li>• Real-time features</li>
                      <li>• AI integration</li>
                      <li>• Advanced components</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}