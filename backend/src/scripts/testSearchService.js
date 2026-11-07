import assert from "node:assert";
import mongoose from "mongoose";
import { searchWorkspace } from "../services/search.service.js";
import { searchController } from "../controllers/search.controller.js";
import searchRouter from "../routes/search.routes.js";

async function runTests() {
  console.log("🧪 Testing Search Service, Controller & Routes...\n");

  // 1. Check exports
  console.log("1. Checking function exports...");
  assert.strictEqual(
    typeof searchWorkspace,
    "function",
    "searchWorkspace must be a function"
  );
  assert.strictEqual(
    typeof searchController,
    "function",
    "searchController must be a function"
  );
  console.log("✅ Service & Controller exports verified.");

  // 2. Missing userId validation
  console.log("\n2. Checking missing userId validation...");
  let threw = false;
  try {
    await searchWorkspace({ query: "roadmap" });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, "USER_ID_REQUIRED");
  }
  assert.strictEqual(threw, true, "Should throw error if userId is missing");
  console.log("✅ Missing userId correctly rejected.");

  // 3. Empty query returns empty results
  console.log("\n3. Checking empty query behavior...");
  const emptyRes = await searchWorkspace({
    userId: new mongoose.Types.ObjectId(),
    query: "   ",
  });
  assert.deepStrictEqual(emptyRes.results, []);
  assert.strictEqual(emptyRes.total, 0);
  console.log("✅ Empty query returns empty result set safely.");

  // 4. Check route definition
  console.log("\n4. Checking search router definition...");
  const routes = searchRouter.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));

  const hasGet = routes.some(
    (r) => r.path === "/" && r.methods.includes("get")
  );
  assert.strictEqual(hasGet, true, "GET / must be registered on searchRouter");
  console.log("✅ Route GET / correctly registered on searchRouter.");

  console.log("\n🎉 All Search Backend Tests Passed Successfully!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
