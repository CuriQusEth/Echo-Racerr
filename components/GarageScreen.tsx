import { motion } from 'motion/react';
import { ArrowLeft, Wrench, Zap, Shield, Volume2 } from 'lucide-react';

interface GarageScreenProps {
  onBack: () => void;
}

export default function GarageScreen({ onBack }: GarageScreenProps) {
  const upgrades = [
    { id: 'engine', name: 'SONIC ENGINE', icon: Zap, level: 3, max: 5, color: '#00ffcc' },
    { id: 'hull', name: 'RESONANCE HULL', icon: Shield, level: 1, max: 5, color: '#ff00ff' },
    { id: 'echo', name: 'ECHO CAPACITY', icon: Volume2, level: 2, max: 3, color: '#E8A020' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-black z-20">
      <div className="p-6 pb-2 border-b border-[#222] flex items-center justify-between">
        <button onClick={onBack} className="p-2 text-[#666] hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-['Cinzel'] font-bold text-[#ff00ff] flex items-center gap-2">
          <Wrench size={20} />
          GARAGE
        </h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <div className="aspect-video w-full rounded-2xl bg-[#111] border border-[#333] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1)_0%,transparent_70%)]" />
          {/* Mock Vehicle rendering */}
          <div className="w-32 h-16 border-2 border-[#00ffcc] rounded-full relative shadow-[0_0_30px_rgba(0,255,204,0.3)]">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-2 bg-[#ff00ff] rounded-full shadow-[0_0_15px_rgba(255,0,255,0.8)] animate-pulse" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#E8A020] rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-sm text-[#888] px-2 mb-2">VEHICLE UPGRADES</h3>
          {upgrades.map((upg, i) => (
            <motion.div 
              key={upg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-[#222] p-4 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-mono text-sm text-white">
                  <upg.icon size={16} color={upg.color} />
                  {upg.name}
                </div>
                <div className="font-mono text-xs text-[#666]">
                  LVL {upg.level}/{upg.max}
                </div>
              </div>
              <div className="flex gap-1 h-2">
                {Array.from({ length: upg.max }).map((_, j) => (
                  <div 
                    key={j} 
                    className={`flex-1 rounded-full ${j < upg.level ? 'bg-current shadow-[0_0_10px_currentColor]' : 'bg-[#222]'}`}
                    style={{ color: j < upg.level ? upg.color : undefined }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
