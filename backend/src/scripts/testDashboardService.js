import assert from "node:assert";
import mongoose from "mongoose";
import { getDashboardOverview } from "../services/dashboard.service.js";
import { getDashboardStatsController } from "../controllers/meeting.controller.js";
import router from "../routes/meeting.routes.js";

async function runTests() {
  console.log("🧪 Testing Dashboard Overview Service & Controller...\n");

  // Test 1: Function exports
  console.log("1. Checking function exports...");
  assert.strictEqual(
    typeof getDashboardOverview,
    "function",
    "getDashboardOverview must be a function"
  );
  assert.strictEqual(
    typeof getDashboardStatsController,
    "function",
    "getDashboardStatsController must be a function"
  );
  console.log("✅ Service & Controller exports verified.");

  // Test 2: Validation of missing userId
  console.log("\n2. Checking missing userId validation...");
  let threw = false;
  try {
    await getDashboardOverview({});
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, "USER_ID_REQUIRED");
  }
  assert.strictEqual(threw, true, "Should throw error if userId is missing");
  console.log("✅ Missing userId correctly rejected.");

  // Test 3: Route definition check
  console.log("\n3. Checking meeting routes for /stats and /dashboard/stats...");
  const routes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));

  const hasStats = routes.some((r) => r.path === "/stats" && r.methods.includes("get"));
  const hasDashboardStats = routes.some(
    (r) => r.path === "/dashboard/stats" && r.methods.includes("get")
  );

  assert.strictEqual(hasStats, true, "Route /stats must exist with GET method");
  assert.strictEqual(
    hasDashboardStats,
    true,
    "Route /dashboard/stats must exist with GET method"
  );

  // Ensure /stats comes before /:id in stack
  const statsIndex = routes.findIndex((r) => r.path === "/stats");
  const idIndex = routes.findIndex((r) => r.path === "/:id");
  assert.ok(
    statsIndex < idIndex,
    `/stats (index ${statsIndex}) must precede /:id (index ${idIndex}) in router stack`
  );
  console.log("✅ Routes registered in correct order before /:id.");

  console.log("\n🎉 All Dashboard Unit & Route Tests Passed Successfully!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
