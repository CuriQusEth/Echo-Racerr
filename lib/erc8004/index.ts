export interface AgentConfig {
  agentAddress: string;
  permissions: string[];
}

export function generateAgentSignature(action: string, payload: any) {
  return {
    action,
    payload,
    signature: "0x8004mocksignature_" + Date.now().toString(16),
    agent: "Echo_Racer_Orchestrator_Agent"
  };
}

export function authorizeAgent(config: AgentConfig) {
  console.log(`[ERC-8004] Authorizing agent ${config.agentAddress} with permissions:`, config.permissions);
  return true;
}
