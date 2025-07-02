'use client';

import { useEffect, useRef } from 'react';

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load Three.js on client side
    let scene: any, camera: any, renderer: any, geometry: any, material: any, mesh: any;

    const init = async () => {
      // Dynamically import Three.js to avoid SSR issues
      const THREE = await import('three');

      if (!mountRef.current) return;

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      mountRef.current.appendChild(renderer.domElement);

      // Create floating geometric shapes
      const shapes: any[] = [];
      for (let i = 0; i < 10; i++) {
        const geometries = [
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.SphereGeometry(0.5, 32, 32),
          new THREE.ConeGeometry(0.5, 1, 8),
        ];

        geometry = geometries[Math.floor(Math.random() * geometries.length)];
        material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
          transparent: true,
          opacity: 0.1,
          wireframe: true,
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        scene.add(mesh);
        shapes.push(mesh);
      }

      camera.position.z = 10;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate shapes
        shapes.forEach((shape) => {
          shape.rotation.x += 0.002;
          shape.rotation.y += 0.003;
          shape.rotation.z += 0.001;
        });

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    init();
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
}