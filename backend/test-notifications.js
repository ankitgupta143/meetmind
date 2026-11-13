import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || "gsk_dummy_test_key_for_testing";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dummy_jwt_access_secret_12345";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dummy_jwt_refresh_secret_12345";

import assert from "node:assert";
import mongoose from "mongoose";
import Notification from "./src/models/Notification.js";
import { formatRelativeTime } from "./src/services/notification.service.js";

const { default: app } = await import("./src/app.js");

console.log("====================================================");
console.log("   MEETMIND NOTIFICATIONS TEST SUITE                ");
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
// 1. Relative Time Formatter Tests
// ------------------------------------------------------------------
runTest("[NOTIF-01] Relative Time: Formats < 45s as 'Just now'", () => {
  const justNow = new Date(Date.now() - 10_000);
  assert.strictEqual(formatRelativeTime(justNow), "Just now");
});

runTest("[NOTIF-02] Relative Time: Formats 5 minutes ago", () => {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  assert.strictEqual(formatRelativeTime(fiveMinAgo), "5 min ago");
});

runTest("[NOTIF-03] Relative Time: Formats 1 hour ago", () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  assert.strictEqual(formatRelativeTime(oneHourAgo), "1 hour ago");
});

runTest("[NOTIF-04] Relative Time: Formats 3 hours ago", () => {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  assert.strictEqual(formatRelativeTime(threeHoursAgo), "3 hours ago");
});

runTest("[NOTIF-05] Relative Time: Formats Yesterday", () => {
  const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000);
  assert.strictEqual(formatRelativeTime(yesterday), "Yesterday");
});

runTest("[NOTIF-06] Relative Time: Formats 4 days ago", () => {
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
  assert.strictEqual(formatRelativeTime(fourDaysAgo), "4 days ago");
});

// ------------------------------------------------------------------
// 2. Notification Model Schema Validation Tests
// ------------------------------------------------------------------
runTest("[NOTIF-07] Model Validation: Rejects notification without recipient", () => {
  const notif = new Notification({
    title: "Test Notification",
    type: "ai",
  });
  const err = notif.validateSync();
  assert.ok(err.errors.recipient);
});

runTest("[NOTIF-08] Model Validation: Rejects notification without title", () => {
  const notif = new Notification({
    recipient: new mongoose.Types.ObjectId(),
    type: "ai",
  });
  const err = notif.validateSync();
  assert.ok(err.errors.title);
});

runTest("[NOTIF-09] Model Validation: Rejects invalid notification type", () => {
  const notif = new Notification({
    recipient: new mongoose.Types.ObjectId(),
    title: "Test",
    type: "invalid_type_xyz",
  });
  const err = notif.validateSync();
  assert.ok(err.errors.type);
});

runTest("[NOTIF-10] Model Validation: Accepts valid notification with defaults", () => {
  const notif = new Notification({
    recipient: new mongoose.Types.ObjectId(),
    title: "AI Summary Ready",
    type: "ai",
    description: "Meeting has finished processing",
  });
  const err = notif.validateSync();
  assert.strictEqual(err, undefined);
  assert.strictEqual(notif.read, false);
});

// ------------------------------------------------------------------
// 3. Express Routing Mount Verification
// ------------------------------------------------------------------
runTest("[NOTIF-11] Express App: Mounts /api/v1/notifications in route stack", () => {
  const stack = app.router?.stack || app._router?.stack || [];
  const matched = stack.some((layer) => {
    if (layer.matchers?.[0]) {
      const match = layer.matchers[0]("/api/v1/notifications");
      return Boolean(match);
    }
    return layer.regexp?.toString().includes("notifications");
  });

  assert.ok(matched, "Notification route should be mounted in Express app");
});

console.log("\n====================================================");
console.log(`   TOTAL: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log("====================================================\n");

if (passed !== total) {
  process.exit(1);
}
