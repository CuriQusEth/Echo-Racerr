export const ATTRIBUTION_CODE = "ECHO_RACER_77x9";
export const BUILDER_CODE = "KRPTO_8021"; // Replace with your builder code

export function getAttributionData() {
  return {
    attribution: ATTRIBUTION_CODE,
    builder: BUILDER_CODE,
    timestamp: Date.now(),
  };
}

export function encodeAttributionData() {
  // Simple payload encoding for demonstration
  const data = getAttributionData();
  const jsonString = JSON.stringify(data);
  return '0x' + Buffer.from(jsonString).toString('hex');
}
