export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
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
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const method = body.method;
      const id = body.id || null;

      if (method === "tools/list") {
        return res.status(200).json({
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
        return res.status(200).json({
          jsonrpc: "2.0",
          id: id,
          result: { content: [{ type: "text", text: `Tool ${toolName} executed successfully` }] }
        });
      }

      if (method === "prompts/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: id, result: { prompts: [] } });
      }

      if (method === "resources/list") {
        return res.status(200).json({ jsonrpc: "2.0", id: id, result: { resources: [] } });
      }

      return res.status(200).json({
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
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
