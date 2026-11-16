import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || "gsk_dummy_test_key_for_testing";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dummy_jwt_access_secret_12345";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dummy_jwt_refresh_secret_12345";

import assert from "node:assert";
import { updateSettingsSchema } from "./src/validators/user.validator.js";

const { default: app } = await import("./src/app.js");

console.log("====================================================");
console.log("   MEETMIND USER SETTINGS VERIFICATION SUITE       ");
console.log("====================================================\n");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${error.message}`);
  }
}

// ------------------------------------------------------------------
// 1. Settings Schema Validation Tests
// ------------------------------------------------------------------
runTest("[SETTINGS-01] Validates complete settings payload", () => {
  const validPayload = {
    appearance: {
      theme: "dark",
      accentColor: "purple",
      animations: true,
      compactView: false,
    },
    localization: {
      language: "en",
      timezone: "America/New_York",
    },
    notifications: {
      email: true,
      push: false,
      inApp: true,
      meetingReady: true,
      summaryReady: true,
      mentions: true,
      weeklyDigest: false,
      workspaceUpdates: true,
    },
    ai: {
      model: "gemini-flash",
      summaryStyle: "balanced",
      responseTone: "professional",
      autoSummary: true,
      autoActionItems: true,
      autoDecisions: true,
      autoAnalytics: true,
    },
  };

  const result = updateSettingsSchema.safeParse(validPayload);
  assert.strictEqual(result.success, true);
});

runTest("[SETTINGS-02] Validates partial settings update (single section)", () => {
  const partial = {
    appearance: {
      theme: "light",
    },
  };
  const result = updateSettingsSchema.safeParse(partial);
  assert.strictEqual(result.success, true);
});

runTest("[SETTINGS-03] Rejects empty settings update", () => {
  const empty = {};
  const result = updateSettingsSchema.safeParse(empty);
  assert.strictEqual(result.success, false);
});

runTest("[SETTINGS-04] Rejects invalid theme enum", () => {
  const invalid = {
    appearance: {
      theme: "solarized-neon",
    },
  };
  const result = updateSettingsSchema.safeParse(invalid);
  assert.strictEqual(result.success, false);
});

runTest("[SETTINGS-05] Rejects invalid summary style enum", () => {
  const invalid = {
    ai: {
      summaryStyle: "ultra-verbose",
    },
  };
  const result = updateSettingsSchema.safeParse(invalid);
  assert.strictEqual(result.success, false);
});

runTest("[SETTINGS-06] Rejects unauthorized root-level injected fields (Mass Assignment)", () => {
  const injected = {
    appearance: {
      theme: "dark",
    },
    role: "admin",
    isSuperuser: true,
  };
  const result = updateSettingsSchema.safeParse(injected);
  assert.strictEqual(result.success, false);
});

runTest("[SETTINGS-07] Rejects unauthorized sub-document injected fields (Prototype / Property Pollution)", () => {
  const injected = {
    appearance: {
      theme: "dark",
      unauthorizedProp: "malicious_value",
    },
  };
  const result = updateSettingsSchema.safeParse(injected);
  assert.strictEqual(result.success, false);
});

// ------------------------------------------------------------------
// 2. Express Route Registration Verification
// ------------------------------------------------------------------
runTest("[SETTINGS-08] Express App: Mounts /api/v1/users route stack", () => {
  const stack = app.router?.stack || app._router?.stack || [];
  const matched = stack.some((layer) => {
    if (layer.matchers?.[0]) {
      const match = layer.matchers[0]("/api/v1/users");
      return Boolean(match);
    }
    return layer.regexp?.toString().includes("users");
  });

  assert.ok(matched, "Users router should be mounted in Express app");
});

console.log("\n====================================================");
console.log(`   TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log("====================================================\n");

if (passed !== total) {
  process.exit(1);
}
