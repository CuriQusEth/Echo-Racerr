import React from 'react';
import { useGameStore } from '../../game/GameContext';
import { motion } from 'motion/react';
import { Zap, Orbit, Waves } from 'lucide-react';

export default function GarageScreen() {
  const { setScreen, orbs } = useGameStore();

  return (
    <div className="absolute inset-0 bg-[#050505] text-white p-6 md:p-12 flex flex-col font-sans overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 243, 255, 0.1) 25%, rgba(0, 243, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.1) 75%, rgba(255, 0, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 243, 255, 0.1) 25%, rgba(0, 243, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.1) 75%, rgba(255, 0, 255, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px)'
        }}></div>
      </div>

      <div className="flex items-center justify-between mb-12 z-10">
        <button onClick={() => setScreen('title')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 border-2 border-white/20 rounded flex items-center justify-center transform -skew-x-12 group-hover:bg-white group-hover:text-black transition-all">
            <span className="skew-x-12 font-bold uppercase">Esc</span>
          </div>
        </button>
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]">
          Garage <span className="text-[#bc13fe] stroke-text text-transparent" style={{ WebkitTextStroke: '1px #bc13fe' }}>Upgrades</span>
        </h2>
        <div className="flex items-center gap-2 p-3 bg-black/40 backdrop-blur-md border border-white/10 font-black italic text-2xl text-[#00f3ff]">
          <Orbit className="w-6 h-6 text-[#bc13fe]" /> {orbs}
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto z-10 overflow-y-auto pr-4 space-y-6">
        {[
          { name: 'Sonic Disruptor', cost: 50, icon: <Zap className="w-6 h-6" />, desc: 'Increases echo blast radius by 20%', color: '#00f3ff' },
          { name: 'Resonance Battery', cost: 120, icon: <Orbit className="w-6 h-6" />, desc: 'Store up to 4 echoes at once.', color: '#bc13fe' },
          { name: 'Frequency Glide', cost: 200, icon: <Waves className="w-6 h-6" />, desc: 'Extends jump time significantly.', color: '#ff00ff' }
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-black/40 backdrop-blur-xl border-l-[6px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            style={{ borderColor: item.color }}
          >
            <div className="flex items-center gap-6">
              <div 
                className="w-16 h-16 border-2 flex items-center justify-center transform -skew-x-12 bg-white/5"
                style={{ borderColor: `${item.color}50`, color: item.color }}
              >
                <div className="skew-x-12">{item.icon}</div>
              </div>
              <div>
                <h3 className="font-black italic text-2xl uppercase tracking-tight">{item.name}</h3>
                <p className="text-xs uppercase font-bold tracking-widest opacity-60 mt-2">{item.desc}</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-8 py-4 border-2 font-black uppercase text-sm transform -skew-x-12 transition-all hover:bg-white hover:text-black mt-4 sm:mt-0"
              style={{ borderColor: item.color, color: item.color }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = item.color; e.currentTarget.style.color = 'black'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = item.color; }}
            >
              <div className="skew-x-12 flex items-center justify-center gap-2">
                <Orbit className="w-4 h-4" /> {item.cost}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
