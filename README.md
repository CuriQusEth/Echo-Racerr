# Echo Racer

Echo Racer is a futuristic, high-speed endless runner where sound and echoes are your greatest weapon. You are an Echo Racer who rides through neon canyons, cyber ruins, and sonic dimensions. Send powerful sound echoes to destroy obstacles, create temporary platforms, and gain massive speed boosts.

## Features

- **Mobile First Gameplay**: Swipe controls to jump and slide. Tap to send Echo Pulses.
- **Echo Mechanics**: Destroy obstacles, create platforms, and trigger chain reactions using echoes.
- **Resonance Orbs**: Collect orbs to upgrade your echo power and vehicle in the Garage.
- **Hybrid Leaderboard**: Compete to be the fastest Echo Racer with distance and combo tracking.

## On-Chain Elements (Base Mainnet)

- **SIWE Integration**: Sign in with Ethereum to post scores.
- **On-chain Score Tracking**: Post your farthest distance and highest echo combo on the blockchain.
- **Agent Orchestrator**: Supports an ERC-8004 Trustless Agent for AI-driven track optimization and real-time racing automation via Model Context Protocol (MCP).

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Agent Configuration

This project includes a `.well-known/agent-card.json` for AI agent discovery, adhering to ERC-8004.
The agent MCP interfaces are available at:
- `/api/agent`
- `/api/mcp`
