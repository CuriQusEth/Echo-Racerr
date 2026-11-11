# Echo Racer

Echo Racer is a futuristic, high-speed endless runner where sound and echoes are your greatest weapon. You are an Echo Racer who rides through neon canyons, cyber ruins, and sonic dimensions. Send powerful sound echoes to destroy obstacles, create temporary platforms, and gain massive speed boosts.

**App URL:** https://echoracer.vercel.app/

## 🛠 Tech Stack
- Frontend: HTML5 Canvas, Tailwind CSS, Framer Motion
- Blockchain: Wagmi, Viem (Base Denim Mainnet - Chain ID 8453, 200ms Canonical Blocks)
- Protocol integrations: ERC-8021 Attribution, ERC-8004 Autonomous Agents
- Consensus / Network: Base Denim (Retired Flashblocks in favor of 200ms native canonical blocks)
- Agents API: Next.js App Router API Routes

## 🎮 Features
- **Mobile First Gameplay**: Swipe controls to jump and slide. Tap to send Echo Pulses.
- **Echo Mechanics**: Destroy obstacles, create platforms, and trigger chain reactions using echoes.
- **Hybrid Leaderboard**: Compete with on-chain score tracking.

## 🤖 Echo Racer Orchestrator (ERC-8004 AI Agent)

The project includes an intelligent, autonomous AI Agent described as the "Echo Racer Orchestrator". Registration endpoint is built following the ERC-8004 specification.

**Agent Capabilities:**
- high-speed-racing
- echo-mechanics
- track-optimization
- real-time-racing-automation
- drift-management
- lap-strategy
- mcp-command-execution

### 🔌 Model Context Protocol (MCP) Integration

The orchestrator agent provides a Model Context Protocol (MCP) server for direct command execution and agent-to-agent communication. 

**Endpoints**:
- **Agent Discovery Card**: `/.well-known/agent-card.json`
- **Main Agent API**: `/api/agent` (GET & POST)
- **MCP Server API**: `/api/mcp` (GET & POST)

**MCP Tools Available:**
- `get_race_status`: Get current race status
- `start_race`: Start a new race
- `get_leaderboard`: Get current high scores
- `optimize_speed`: Optimize vehicle speed parameters
- `get_track_info`: Get upcoming track obstacles

## 🚀 Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs with Vite / Express locally):
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
