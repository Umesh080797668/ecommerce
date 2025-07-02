'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
          >
            <span className="gradient-text">AI-Powered</span>
            <br />
            <span className="text-foreground">Blog Platform</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Experience the future of blogging with cutting-edge animations, 3D effects, 
            AI-powered features, and seamless multilingual support.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="btn btn-primary btn-lg px-8 py-3 text-lg">
              Get Started
            </button>
            <button className="btn btn-outline btn-lg px-8 py-3 text-lg">
              Learn More
            </button>
          </motion.div>
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"
        />
      </div>
    </section>
  );
}