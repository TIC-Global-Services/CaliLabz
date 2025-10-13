'use client'; 

import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number; // x velocity
  vy: number; // y velocity
  life: number; // 0-1, for fading
  maxLife: number;
  radius: number;
  image?: HTMLImageElement;
  context: CanvasRenderingContext2D | null;
  scale: number;
  swayOffset: number; // For smoother sinusoidal sway
  targetX: number; // Target center X for curving paths
  fromLeft: boolean; // Track spawn side for removal logic
}

const SmokeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Load smoke sprite image for realism (transparent PNG with wispy shape)
    const smokeImage = new Image();
    smokeImage.src = 'https://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png'; // Public smoke puff PNG
    smokeImage.onload = () => {
      smokeImageRef.current = smokeImage;
      animate(0);
    };

    // Set canvas to full viewport and ensure full screen coverage
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Scale for high-DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
      context.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle settings
    const particles: Particle[] = [];
    const maxParticles = 200; // Increased for denser lines
    const spawnRate = 2; // Steady spawn for continuous streams
    const centerX = canvas.width / 2; // Horizontal center
    const driftSpeed = 0.2; // Slow, controlled drift to center
    const riseSpeed = 0.3; // Gentle vertical rise to avoid static lines
    const gravity = -0.005; // Subtle buoyancy
    const targetFPS = 60;
    let time = 0; // Global time for sway

    // Function to spawn a new particle from left or right, targeting center
    const spawnParticle = () => {
      const fromLeft = Math.random() < 0.5;
      const yOffset = Math.random() * canvas.height; // Random y for vertical line coverage
      const particle: Particle = {
        x: fromLeft ? -Math.random() * 30 : canvas.width + Math.random() * 30, // Off sides
        y: yOffset,
        vx: fromLeft ? (driftSpeed + Math.random() * 0.1) : -(driftSpeed + Math.random() * 0.1), // Directed toward center
        vy: -(Math.random() * riseSpeed * 0.5), // Minimal vertical for line flow
        life: 1,
        maxLife: Math.random() * 500 + 300, // 5-12s for smooth, lingering streams
        radius: 30 + Math.random() * 40, // 30-70px for thick, line-like width
        scale: Math.random() * 0.8 + 1.0, // 1.0-1.8 for even wider, fuller wisps
        swayOffset: Math.random() * Math.PI * 2,
        targetX: centerX, // Guide to center
        fromLeft,
        context,
      };
      particles.push(particle);
    };

    // Initial fill: Balanced left/right, positioned to form converging lines
    const initialPerSide = maxParticles / 2;
    for (let i = 0; i < initialPerSide; i++) {
      // Left side initial
      const y = (i / initialPerSide) * canvas.height; // Evenly spaced y for solid lines
      const particleLeft: Particle = {
        x: -Math.random() * 30,
        y,
        vx: driftSpeed + Math.random() * 0.1,
        vy: -(Math.random() * riseSpeed * 0.5),
        life: Math.random() * 0.5 + 0.5, // Staggered start for natural flow
        maxLife: Math.random() * 500 + 300,
        radius: 30 + Math.random() * 40,
        scale: Math.random() * 0.8 + 1.0,
        swayOffset: Math.random() * Math.PI * 2,
        targetX: centerX,
        fromLeft: true,
        context,
      };
      particles.push(particleLeft);

      // Right side initial
      const particleRight: Particle = {
        x: canvas.width + Math.random() * 30,
        y,
        vx: -(driftSpeed + Math.random() * 0.1),
        vy: -(Math.random() * riseSpeed * 0.5),
        life: Math.random() * 0.5 + 0.5,
        maxLife: Math.random() * 500 + 300,
        radius: 30 + Math.random() * 40,
        scale: Math.random() * 0.8 + 1.0,
        swayOffset: Math.random() * Math.PI * 2,
        targetX: centerX,
        fromLeft: false,
        context,
      };
      particles.push(particleRight);
    }

    // Update particles
    const update = () => {
      time += 1 / targetFPS;

      // Continuous balanced spawn
      for (let i = 0; i < spawnRate; i++) {
        spawnParticle();
      }

      // Cap particles
      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }

      particles.forEach((particle, index) => {
        // Curve toward center X with easing
        const dx = particle.targetX - particle.x;
        particle.vx += (dx > 0 ? 0.01 : -0.01) * Math.abs(dx) * 0.001; // Gentle attraction

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += gravity;
        particle.life -= 1 / particle.maxLife;

        // Subtle wave sway, reduced for line cohesion
        const swayIntensity = 0.03; // Lower for straighter lines
        const sway = Math.sin(time * 1.5 + particle.swayOffset) * swayIntensity;
        particle.vx += sway;
        particle.vy += Math.sin(time * 1 + particle.swayOffset) * (swayIntensity * 0.5);

        // Fade/dissipate near center for realism
        if (Math.abs(particle.x - centerX) < 20 && particle.life > 0.3) {
          particle.life -= 0.005; // Accelerate fade at convergence
        }

        // Remove if faded, off-screen, or past center (to prevent overshoot)
        if (particle.y < -100 || particle.life <= 0 || 
            (particle.fromLeft && particle.x > centerX + 50) || 
            (!particle.fromLeft && particle.x < centerX - 50)) {
          particles.splice(index, 1);
          return;
        }
      });
    };

    // Draw particles
    const draw = () => {
      context.fillStyle = 'rgba(255, 255, 255, 0.004)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const alpha = particle.life * 0.3;
        if (alpha <= 0 || !smokeImageRef.current) return;

        context.save();
        context.globalAlpha = alpha;
        context.translate(particle.x, particle.y);
        context.rotate(Math.sin(time * 0.8 + particle.swayOffset) * 0.08); // Softer rotation
        const imgSize = particle.radius * particle.scale * 2;
        context.drawImage(smokeImageRef.current, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        context.restore();
      });
    };

    // Smooth loop
    let lastTime = 0;
    const animate = (currentTime: number = 0) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime > 1000 / targetFPS) {
        update();
        draw();
        lastTime = currentTime;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      particles.length = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-90"  />;
};

export default SmokeCanvas;