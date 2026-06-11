'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';

interface RacingScreenProps {
  onGameOver: (score: number, distance: number) => void;
}

export default function RacingScreen({ onGameOver }: RacingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const distanceRef = useRef<HTMLDivElement>(null);
  const comboRef = useRef<HTMLDivElement>(null);
  const [echoes, setEchoes] = useState(3);
  const requestRef = useRef<number>(0);
  const isGameOver = useRef(false);

  // Game state
  const state = useRef({
    speed: 10,
    racerY: 0, // 0 is ground
    velocity: 0,
    isJumping: false,
    obstacles: [] as { x: number, y: number, width: number, height: number, type: 'block' | 'orb' }[],
    particles: [] as { x: number, y: number, vx: number, vy: number, life: number, maxLife: number, color: string }[],
    echoWaves: [] as { x: number, y: number, radius: number, maxRadius: number, strength: number }[],
    distance: 0,
    combo: 0
  });

  const jump = useCallback(() => {
    if (!state.current.isJumping) {
      state.current.velocity = -15; // Jump strength
      state.current.isJumping = true;
    }
  }, []);

  const fireEcho = useCallback(() => {
    if (echoes > 0) {
      setEchoes(prev => prev - 1);
      state.current.echoWaves.push({
        x: 100, // Player Xish
        y: canvasRef.current!.height - 50 - state.current.racerY,
        radius: 10,
        maxRadius: 500,
        strength: 1.0
      });
      // Haptic feedback if available
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  }, [echoes]);

  // Unified Pointer handling for desktop + mobile
  const touchStart = useRef({ x: 0, y: 0 });
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - touchStart.current.x;
    const dy = e.clientY - touchStart.current.y;

    if (Math.abs(dy) > 50 && dy < 0) {
      // Swipe up
      jump();
    } else if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      // Tap / Click
      fireEcho();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        fireEcho();
      } else if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fireEcho, jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth > 672 ? 672 : window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let lastTime = performance.now();

    const spawnObstacle = () => {
      const type = Math.random() > 0.8 ? 'orb' : 'block';
      state.current.obstacles.push({
        x: canvas.width,
        y: type === 'orb' ? 100 + Math.random() * 150 : canvas.height - 50,
        width: type === 'orb' ? 20 : 30 + Math.random() * 20,
        height: type === 'orb' ? 20 : 30 + Math.random() * 50,
        type
      });
    };

    const spawnParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        state.current.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1.0,
          maxLife: 0.5 + Math.random() * 0.5,
          color
        });
      }
    };

    const update = (time: number) => {
      if (isGameOver.current) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const s = state.current;
      s.distance += s.speed * dt * 10;
      
      // Update DOM directly to avoid React re-renders at 60fps
      if (distanceRef.current) distanceRef.current.innerText = `${Math.floor(s.distance)}m`;
      
      // Speed up slightly over time
      s.speed += dt * 0.1;

      // Physics
      if (s.isJumping) {
        s.racerY -= s.velocity;
        s.velocity += 0.8; // Gravity
        if (s.racerY <= 0) {
          s.racerY = 0;
          s.isJumping = false;
          s.velocity = 0;
        }
      }

      // Obstacles
      if (Math.random() < 0.02) spawnObstacle();

      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= s.speed;

        // Player collision rect
        const px = 100;
        const py = canvas.height - 50 - s.racerY;
        const pw = 40;
        const ph = 20;

        // Simple AABB
        if (px < obs.x + obs.width && px + pw > obs.x &&
            py < obs.y && py + ph > obs.y - obs.height) { 
            
            if (obs.type === 'orb') {
              s.combo += 10;
              if (comboRef.current) comboRef.current.innerText = `${s.combo}`;
              setEchoes(prev => Math.min(prev + 1, 3));
              spawnParticles(obs.x, obs.y, '#ff00ff', 20);
              s.obstacles.splice(i, 1);
            } else {
              // Hit block -> Game Over
              isGameOver.current = true;
              onGameOver(s.combo, s.distance);
              return;
            }
        } else if (obs.x + obs.width < 0) {
          s.obstacles.splice(i, 1);
        }
      }

      // Echo waves
      for (let i = s.echoWaves.length - 1; i >= 0; i--) {
        const wave = s.echoWaves[i];
        wave.radius += 15;
        wave.strength -= 0.02;

        // Destroy obstacles in wave
        for (let j = s.obstacles.length - 1; j >= 0; j--) {
          const obs = s.obstacles[j];
          if (obs.type === 'block') {
            const dist = Math.hypot(obs.x - wave.x, (obs.y - obs.height/2) - wave.y);
            // Thick wave band
            if (dist < wave.radius && dist > wave.radius - 30) {
               spawnParticles(obs.x, obs.y, '#00ffcc', 30);
               s.obstacles.splice(j, 1);
               s.combo += 25;
               if (comboRef.current) comboRef.current.innerText = `${s.combo}`;
            }
          }
        }

        if (wave.strength <= 0 || wave.radius > wave.maxRadius) {
          s.echoWaves.splice(i, 1);
        }
      }

      // Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt;
        if (p.life <= 0) s.particles.splice(i, 1);
      }
    };

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const s = state.current;

      // Draw Grid/Floor (Retro wave style)
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      const floorY = canvas.height - 30;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(canvas.width, floorY);
      ctx.stroke();

      // Draw Obstacles
      s.obstacles.forEach(obs => {
        if (obs.type === 'block') {
          ctx.fillStyle = '#ff3333';
          ctx.shadowColor = '#ff3333';
          ctx.shadowBlur = 15;
          ctx.fillRect(obs.x, obs.y - obs.height, obs.width, obs.height);
        } else {
          ctx.fillStyle = '#ff00ff';
          ctx.shadowColor = '#ff00ff';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(obs.x + obs.width/2, obs.y - obs.height/2, obs.width/2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // Draw Echo Waves
      s.echoWaves.forEach(wave => {
        // Safe check for valid stroke style values
        const alpha = Math.max(0, Math.min(1, wave.strength));
        ctx.strokeStyle = `rgba(0, 255, 204, ${alpha})`;
        ctx.lineWidth = Math.max(1, 10 * alpha);
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Player
      const py = floorY - 20 - s.racerY;
      ctx.fillStyle = '#00ffcc';
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 20;
      ctx.fillRect(100, py, 40, 20);
      
      // Trail
      ctx.fillStyle = 'rgba(0, 255, 204, 0.3)';
      ctx.fillRect(60, py + 5, 40, 10);
      ctx.fillStyle = 'rgba(0, 255, 204, 0.1)';
      ctx.fillRect(20, py + 8, 40, 4);

      ctx.shadowBlur = 0;
    };

    const loop = (time: number) => {
      update(time);
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onGameOver]);

  return (
    <div 
      className="absolute inset-0 z-10 w-full h-full cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* HUD overlay */}
      <div className="absolute top-20 left-0 w-full px-4 flex justify-between items-start pointer-events-none">
        <div>
          <div className="text-[#00ffcc] font-mono text-sm tracking-wider">DISTANCE</div>
          <div ref={distanceRef} className="text-white font-['Cinzel'] text-3xl font-bold">0m</div>
        </div>
        
        <div className="text-right">
          <div className="text-[#ff00ff] font-mono text-sm tracking-wider">COMBO</div>
          <div ref={comboRef} className="text-white font-['Cinzel'] text-3xl font-bold">0</div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              i < echoes 
                ? 'border-[#00ffcc] text-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.5)] bg-[#00ffcc]/10' 
                : 'border-[#333] text-[#333]'
            }`}
          >
            <Volume2 size={18} />
          </div>
        ))}
      </div>

      <div className="absolute bottom-32 left-0 w-full text-center text-[#444] font-mono text-xs pointer-events-none">
        SWIPE UP / WA / ArrowUp TO JUMP • TAP / SPACE TO ECHO
      </div>
    </div>
  );
}
