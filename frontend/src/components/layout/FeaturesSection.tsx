'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: '🚀',
    title: 'Next.js 14',
    description: 'Built with the latest Next.js App Router for optimal performance and SEO',
  },
  {
    icon: '🎨',
    title: '3D Animations',
    description: 'Stunning Three.js animations and GSAP transitions for immersive experiences',
  },
  {
    icon: '🌐',
    title: 'Multilingual',
    description: 'Full support for English, Sinhala, and Tamil with automatic detection',
  },
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Integrated AI features for content generation and intelligent recommendations',
  },
  {
    icon: '⚡',
    title: 'Real-time',
    description: 'Live comments, notifications, and collaborative features with Socket.io',
  },
  {
    icon: '📱',
    title: 'Responsive',
    description: 'Perfect experience across all devices with mobile-first design',
  },
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and best practices for a superior blogging experience
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}