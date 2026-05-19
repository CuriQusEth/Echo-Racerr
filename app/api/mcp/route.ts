import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
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
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const method = body.method;
    const id = body.id || null;

    if (method === "tools/list") {
      return NextResponse.json({
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
      }, { headers: corsHeaders });
    }

    if (method === "tools/call") {
      const toolName = body.params?.name;
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id,
        result: { content: [{ type: "text", text: `Tool ${toolName} executed successfully` }] }
      }, { headers: corsHeaders });
    }

    if (method === "prompts/list") {
      return NextResponse.json({ jsonrpc: "2.0", id: id, result: { prompts: [] } }, { headers: corsHeaders });
    }

    if (method === "resources/list") {
      return NextResponse.json({ jsonrpc: "2.0", id: id, result: { resources: [] } }, { headers: corsHeaders });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id: id,
      result: {
        status: "success",
        message: "MCP command received",
        agent: "Echo Racer Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      }
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400, headers: corsHeaders });
  }
}

