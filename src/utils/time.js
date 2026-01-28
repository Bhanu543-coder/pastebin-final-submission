export const getNow = () => {
  if (process.env.TEST_MODE === "1") {
    // Standardized fixed time for automated test environments
    return new Date("2026-01-01T00:00:00.000Z");
  }
  return new Date();
};