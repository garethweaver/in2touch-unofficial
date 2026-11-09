import { defineConfig, devices } from "@playwright/test";
import { EMULATOR_HOST, PROJECT_ID } from "./tests/e2e/emulator";

const PORT = 3100;

// Run with `yarn test:e2e`, which starts the Firebase emulator first
// (firebase emulators:exec) and then runs Playwright inside it.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false, // tests share one emulator database
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    ...devices["Pixel 7"],
  },
  webServer: {
    command: `next dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      // real env vars take precedence over .env*.local files, so this never touches prod
      NEXT_PUBLIC_APPNAME: "In2Touch",
      NEXT_PUBLIC_FIREBASE_EMULATOR_HOST: EMULATOR_HOST,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_DATABASE_URL: `http://${EMULATOR_HOST}?ns=${PROJECT_ID}`,
      NEXT_PUBLIC_FIREBASE_API_KEY: "fake-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "",
      NEXT_PUBLIC_FIREBASE_APP_ID: "",
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "",
    },
  },
});
