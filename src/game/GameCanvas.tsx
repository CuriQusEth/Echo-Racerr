import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from './GameContext';
import { GAME_CONSTANTS } from './constants';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setScreen, setLastScore, setLastCombo, setOrbs } = useGameStore();

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  // Reference for game state so animation loop can access it without closures capturing old state
    const gameState = useRef({
      distance: 0,
      speed: GAME_CONSTANTS.BASE_SPEED,
      isBoosting: false,
      player: {
        x: 100,
        y: 0, 
        vy: 0,
        state: 'running', 
        width: 40,
        height: 80,
      },
      touchStartY: 0,
      touchStartX: 0,
      echoes: [] as any[],
      obstacles: [] as any[],
      particles: [] as any[],
      orbs: [] as any[],
      trails: [] as any[],
      frameCount: 0,
      maxCombo: 0,
      currentCombo: 0,
      comboTimer: 0,
      isGameOver: false,
    });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (gameState.current.player.y === 0) {
        gameState.current.player.y = canvas.height - GAME_CONSTANTS.FLOOR_Y_OFFSET - gameState.current.player.height;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;

    const gameLoop = () => {
      if (gameState.current.isGameOver) return;
      update();
      draw(ctx, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const update = () => {
      const state = gameState.current;
      state.frameCount++;
      
      // Speed progression
      if (state.speed < GAME_CONSTANTS.MAX_SPEED) {
        state.speed += GAME_CONSTANTS.SPEED_MULTIPLIER;
      }

      const currentSpeed = state.isBoosting ? state.speed * GAME_CONSTANTS.BOOST_SPEED_MULTIPLIER : state.speed;
      state.distance += currentSpeed * 0.1; // scale down for arbitrary units

      // Sync React state rarely to avoid lag
      if (state.frameCount % 10 === 0) {
        setScore(state.distance);
        setCombo(state.currentCombo);
      }

      // Update Trails
      if (state.frameCount % 3 === 0) {
        state.trails.push({
          x: state.player.x,
          y: state.player.y,
          width: state.player.width,
          height: state.player.height,
          life: 10
        });
      }
      for (let i = state.trails.length - 1; i >= 0; i--) {
        state.trails[i].x -= currentSpeed * 0.5; // moves back relative to screen
        state.trails[i].life--;
        if (state.trails[i].life <= 0) state.trails.splice(i, 1);
      }

      // Physics
      const floorY = canvas.height - GAME_CONSTANTS.FLOOR_Y_OFFSET;
      state.player.vy += GAME_CONSTANTS.GRAVITY;
      state.player.y += state.player.vy;

      if (state.player.y >= floorY - state.player.height) {
        state.player.y = floorY - state.player.height;
        state.player.vy = 0;
        if (state.player.state === 'jumping') {
          state.player.state = 'running';
        }
      }

      // Sliding logic - change dimensions
      if (state.player.state === 'sliding') {
        state.player.height = 40;
        if (state.player.y >= floorY - 40) {
           state.player.y = floorY - 40;
        }
      } else {
        state.player.height = 80;
      }

      // Update Echoes
      for (let i = state.echoes.length - 1; i >= 0; i--) {
        state.echoes[i].x += GAME_CONSTANTS.ECHO_SPEED + currentSpeed * 0.5;
        state.echoes[i].radius += 2;
        state.echoes[i].life -= 1;
        if (state.echoes[i].life <= 0) state.echoes.splice(i, 1);
      }

      // Spawn Obstacles & Orbs
      const spawnRate = Math.max(
        GAME_CONSTANTS.MIN_OBSTACLE_SPAWN_RATE, 
        GAME_CONSTANTS.OBSTACLE_SPAWN_RATE - Math.floor(state.speed * 2)
      );

      if (state.frameCount % spawnRate === 0) {
        if (Math.random() > 0.3) {
          const type = Math.random() > 0.5 ? 'ground' : 'air';
          state.obstacles.push({
            x: canvas.width + 100,
            y: type === 'ground' ? floorY - 60 : floorY - 140,
            width: 40,
            height: 60,
            type
          });
        } else {
          // Spawn Orb
          state.orbs.push({
            x: canvas.width + 100,
            y: floorY - 100 - Math.random() * 100,
            radius: 15,
            collected: false
          });
        }
      }

      // Update Obstacles & Collision
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= currentSpeed;
        
        // Echo Collision
        let destroyed = false;
        for (let j = 0; j < state.echoes.length; j++) {
           const echo = state.echoes[j];
           if (Math.abs(obs.x - echo.x) < echo.radius && Math.abs(obs.y - echo.y) < echo.radius) {
             destroyed = true;
             state.currentCombo++;
             if (state.currentCombo > state.maxCombo) state.maxCombo = state.currentCombo;
             state.comboTimer = 100;
             // Spawn particles
             for(let k=0; k<10; k++) {
                state.particles.push({
                  x: obs.x, y: obs.y,
                  vx: (Math.random() - 0.5) * 15,
                  vy: (Math.random() - 0.5) * 15,
                  life: 30, color: '#0ff'
                });
             }
             break;
           }
        }

        if (destroyed) {
           state.obstacles.splice(i, 1);
           continue;
        }

        // Player Collision
        if (
          state.player.x < obs.x + obs.width &&
          state.player.x + state.player.width > obs.x &&
          state.player.y < obs.y + obs.height &&
          state.player.height + state.player.y > obs.y
        ) {
          // GAMEOVER
          gameOver();
          return;
        }

        if (obs.x + obs.width < 0) {
           state.obstacles.splice(i, 1);
        }
      }

      // Update Orbs & Collision
      for (let i = state.orbs.length - 1; i >= 0; i--) {
        const orb = state.orbs[i];
        orb.x -= currentSpeed;
        
        // Player Collision with Orb
        if (
          !orb.collected &&
          state.player.x < orb.x + orb.radius &&
          state.player.x + state.player.width > orb.x - orb.radius &&
          state.player.y < orb.y + orb.radius &&
          state.player.height + state.player.y > orb.y - orb.radius
        ) {
          orb.collected = true;
          setOrbs(o => o + 1); // update global state safely inside loop could be laggy, better just do bulk update or keep local
          
          for(let k=0; k<8; k++) {
            state.particles.push({
              x: orb.x, y: orb.y,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 20, color: '#ff0'
            });
          }
        }

        if (orb.x + orb.radius < 0 || orb.collected) {
           state.orbs.splice(i, 1);
        }
      }

      // Particles Update
      for (let i = state.particles.length - 1; i >= 0; i--) {
        state.particles[i].x += state.particles[i].vx;
        state.particles[i].y += state.particles[i].vy;
        state.particles[i].life--;
        if (state.particles[i].life <= 0) state.particles.splice(i, 1);
      }

      // Combo decrease
      if (state.comboTimer > 0) {
        state.comboTimer--;
        if (state.comboTimer === 0) state.currentCombo = 0;
      }
    };

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const state = gameState.current;
      
      // Clear with trail effect
      ctx.fillStyle = 'rgba(5, 5, 16, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Floor grid (Neon Cyber aesthetic)
      const floorY = height - GAME_CONSTANTS.FLOOR_Y_OFFSET;
      ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(width, floorY);
      ctx.stroke();

      // Parallax Lines
      const gridOffset = (state.distance * 10) % 50;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i - gridOffset, floorY);
        ctx.lineTo(i - gridOffset - 100, height);
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.1 + (i/width)*0.3})`;
        ctx.stroke();
      }

      // Player Trails
      state.trails.forEach(t => {
         const color = state.isBoosting ? '255,255,255' : '0,255,255';
         ctx.fillStyle = `rgba(${color}, ${t.life / 20})`;
         ctx.fillRect(t.x, t.y, t.width, t.height);
      });

      // Player
      ctx.fillStyle = state.isBoosting ? '#fff' : '#0ff';
      ctx.shadowColor = '#0ff';
      ctx.shadowBlur = 15;
      ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
      ctx.shadowBlur = 0; // reset

      // Obstacles
      ctx.fillStyle = '#f0f';
      ctx.shadowColor = '#f0f';
      ctx.shadowBlur = 10;
      state.obstacles.forEach(obs => {
         ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });
      ctx.shadowBlur = 0;

      // Orbs
      ctx.fillStyle = '#ff0';
      ctx.shadowColor = '#ff0';
      ctx.shadowBlur = 15;
      state.orbs.forEach(orb => {
         ctx.beginPath();
         ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
         ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Echoes
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 3;
      state.echoes.forEach(echo => {
         ctx.beginPath();
         ctx.arc(echo.x, echo.y, echo.radius, -Math.PI/4, Math.PI/4);
         ctx.stroke();
         ctx.beginPath();
         ctx.arc(echo.x - 10, echo.y, echo.radius * 0.8, -Math.PI/4, Math.PI/4);
         ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
         ctx.stroke();
      });

      // Particles
      state.particles.forEach(p => {
         ctx.fillStyle = p.color;
         ctx.globalAlpha = p.life / 30;
         ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.globalAlpha = 1.0;
    };

    const gameOver = () => {
      gameState.current.isGameOver = true;
      setLastScore(Math.floor(gameState.current.distance));
      setLastCombo(gameState.current.maxCombo);
      setScreen('gameover');
    };

    // Controls
    const handleTouchStart = (e: TouchEvent) => {
       gameState.current.touchStartX = e.touches[0].clientX;
       gameState.current.touchStartY = e.touches[0].clientY;
       gameState.current.isBoosting = true;
       // Quick tap detection for echo will be handled in touchend if duration is short
    };

    const handleTouchEnd = (e: TouchEvent) => {
       gameState.current.isBoosting = false;
       if (gameState.current.player.state === 'sliding') {
          gameState.current.player.state = 'running';
       }

       const touchEndX = e.changedTouches[0].clientX;
       const touchEndY = e.changedTouches[0].clientY;
       const dx = touchEndX - gameState.current.touchStartX;
       const dy = touchEndY - gameState.current.touchStartY;

       // Swipe up
       if (dy < -30) {
          if (gameState.current.player.y >= canvas.height - GAME_CONSTANTS.FLOOR_Y_OFFSET - gameState.current.player.height) {
             gameState.current.player.vy = GAME_CONSTANTS.JUMP_FORCE;
             gameState.current.player.state = 'jumping';
          }
       } 
       // Swipe down
       else if (dy > 30) {
          gameState.current.player.state = 'sliding';
       }
       // Tap
       else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
           fireEcho();
       }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.code === 'Space' || e.code === 'ArrowUp') {
          if (gameState.current.player.y >= canvas.height - GAME_CONSTANTS.FLOOR_Y_OFFSET - gameState.current.player.height) {
             gameState.current.player.vy = GAME_CONSTANTS.JUMP_FORCE;
             gameState.current.player.state = 'jumping';
          }
       } else if (e.code === 'ArrowDown') {
          gameState.current.player.state = 'sliding';
       } else if (e.code === 'KeyE') {
          fireEcho();
       } else if (e.code === 'ShiftLeft') {
          gameState.current.isBoosting = true;
       }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
       if (e.code === 'ArrowDown') {
          gameState.current.player.state = 'running';
       } else if (e.code === 'ShiftLeft') {
          gameState.current.isBoosting = false;
       }
    };

    const fireEcho = () => {
       gameState.current.echoes.push({
           x: gameState.current.player.x + gameState.current.player.width,
           y: gameState.current.player.y + gameState.current.player.height / 2,
           radius: 10,
           life: 60
       });
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setScreen, setLastScore, setLastCombo]);

  return (
    <>
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* HUD overlay */}
      <div className="absolute top-0 left-0 w-full p-6 pointer-events-none flex justify-between items-start">
         <div>
            <div className="text-cyan-400 font-mono text-xl tracking-widest">{Math.floor(score)}m</div>
            <div className="text-white font-mono text-xs opacity-50">DISTANCE</div>
         </div>
         <div className="text-right">
            <div className={`font-mono text-2xl font-bold transition-colors ${combo > 5 ? 'text-pink-500 animate-pulse' : 'text-purple-400'}`}>
              {combo > 0 ? `${combo}x` : ''}
            </div>
            {combo > 0 && <div className="text-white font-mono text-xs opacity-50">COMBO</div>}
         </div>
      </div>
      <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none opacity-30 text-xs tracking-widest text-cyan-200">
         SWIPE UP TO JUMP • DOWN TO SLIDE • TAP TO ECHO
      </div>
    </>
  );
}
