/** Simulates network latency for mock API calls */
export function delay(ms = 300) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
