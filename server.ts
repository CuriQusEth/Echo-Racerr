import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

export const app = express();

async function startServer() {
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Agent API
  app.get('/api/agent', (req, res) => {
    res.json({
      name: "Echo Racer Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Echo Racer",
      version: "1.0.0"
    });
  });

  app.post('/api/agent', (req, res) => {
    try {
      const body = req.body;
      res.json({
        status: "success",
        message: "Agent command received",
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid agent request" });
    }
  });

  app.get('/api/mcp', (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Echo Racer MCP Endpoint",
      status: "active",
      description: "Active MCP server for Echo Racer Orchestrator Agent",
      capabilities: ["high-speed-racing", "echo-mechanics", "track-optimization"],
      skills: [
        { name: "get_race_status", description: "Get current race status" },
        { name: "start_race", description: "Start a new race" },
        { name: "get_leaderboard", description: "Get current high scores" },
        { name: "optimize_speed", description: "Optimize vehicle speed parameters" },
        { name: "get_track_info", description: "Get upcoming track obstacles" }
      ],
      tools: [
        { name: "get_race_status", description: "Get current race status" },
        { name: "start_race", description: "Start a new race" },
        { name: "get_leaderboard", description: "Get current high scores" },
        { name: "optimize_speed", description: "Optimize vehicle speed parameters" },
        { name: "get_track_info", description: "Get upcoming track obstacles" }
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/mcp', (req, res) => {
    try {
      const body = req.body;
      const method = body.method;
      const id = body.id || null;

      if (method === "tools/list") {
        return res.json({
          jsonrpc: "2.0",
          id: id,
          result: {
            tools: [
              { name: "get_race_status", description: "Get current race status", inputSchema: { type: "object", properties: {}, required: [] } },
              { name: "start_race", description: "Start a new race", inputSchema: { type: "object", properties: {}, required: [] } },
              { name: "get_leaderboard", description: "Get current high scores", inputSchema: { type: "object", properties: {}, required: [] } },
              { name: "optimize_speed", description: "Optimize vehicle speed parameters", inputSchema: { type: "object", properties: {}, required: [] } },
              { name: "get_track_info", description: "Get upcoming track obstacles", inputSchema: { type: "object", properties: {}, required: [] } }
            ]
          }
        });
      }

      if (method === "tools/call") {
        const toolName = body.params?.name;
        return res.json({
          jsonrpc: "2.0",
          id: id,
          result: { content: [{ type: "text", text: `Tool ${toolName} executed successfully` }] }
        });
      }

      if (method === "prompts/list") {
         return res.json({ jsonrpc: "2.0", id: id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
         return res.json({ jsonrpc: "2.0", id: id, result: { resources: [] } });
      }

      res.json({
        jsonrpc: "2.0",
        id: id,
        result: {
          status: "success",
          message: "MCP command received",
          agent: "Echo Racer Orchestrator",
          receivedAt: new Date().toISOString(),
          payload: body
        }
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
