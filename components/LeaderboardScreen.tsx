import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  // Mock data for leaderboard
  const leaders = [
    { rank: 1, address: '0x1234...5678', distance: 15420, combo: 890 },
    { rank: 2, address: '0x8765...4321', distance: 14200, combo: 750 },
    { rank: 3, address: '0xabcd...efgh', distance: 12500, combo: 620 },
    { rank: 4, address: '0x0987...xyz1', distance: 10100, combo: 440 },
    { rank: 5, address: '0x5555...4444', distance: 9800, combo: 390 },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-black z-20">
      <div className="p-6 pb-2 border-b border-[#222] flex items-center justify-between">
        <button onClick={onBack} className="p-2 text-[#666] hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-['Cinzel'] font-bold text-[#E8A020] flex items-center gap-2">
          <Trophy size={20} />
          ON-CHAIN RANKS
        </h2>
        <div className="w-10" /> {/* Balancer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {leaders.map((leader, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center p-4 rounded-xl border ${leader.rank === 1 ? 'border-[#E8A020]/50 bg-[#E8A020]/10' : leader.rank <= 3 ? 'border-[#00ffcc]/30 bg-[#00ffcc]/5' : 'border-[#222] bg-[#111]'} relative overflow-hidden`}
          >
            <div className="w-12 text-center font-['Cinzel'] text-2xl font-bold opacity-50 flex justify-center">
              {leader.rank === 1 ? <Medal className="text-[#E8A020]" /> : `#${leader.rank}`}
            </div>
            <div className="flex-1 ml-4">
              <div className="font-mono text-sm text-white mb-1">{leader.address}</div>
              <div className="flex gap-4 font-mono text-xs text-[#888]">
                <span><span className="text-[#00ffcc]">{leader.distance}</span>m</span>
                <span><span className="text-[#ff00ff]">{leader.combo}</span> combo</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
