import assert from "node:assert";
import {
  parseAndVerifySources,
  askGlobalAssistant,
  askGlobalAssistantStream,
} from "../services/globalAssistant.service.js";
import {
  streamConversationMessage,
} from "../services/globalConversation.service.js";

async function runTests() {
  console.log("🧪 Testing Streaming Assistant Service & Sources Parsing...\n");

  // 1. Verify exports
  assert.strictEqual(typeof askGlobalAssistant, "function");
  assert.strictEqual(typeof askGlobalAssistantStream, "function");
  assert.strictEqual(typeof parseAndVerifySources, "function");
  assert.strictEqual(typeof streamConversationMessage, "function");
  console.log("✅ All streaming functions exported properly.");

  // 2. Test parseAndVerifySources with ```sources block
  const mockRegistry = new Map();
  mockRegistry.set("SRC-1", {
    meetingId: "6aa5949862695fb6ce009783",
    meetingTitle: "Sprint Planning",
    excerpt: "We finished authentication yesterday.",
    startTime: 120,
    endTime: 140,
    speaker: "John",
  });

  const rawWithFence = `
The authentication system is finished [SRC-1]. We can move to testing.

\`\`\`sources
["SRC-1"]
\`\`\`
`;

  const parsed = parseAndVerifySources({
    rawContent: rawWithFence,
    meetings: [{ _id: "6aa5949862695fb6ce009783", title: "Sprint Planning" }],
    sourceRegistry: mockRegistry,
  });

  assert.strictEqual(
    parsed.cleanMessage,
    "The authentication system is finished [SRC-1]. We can move to testing."
  );
  assert.strictEqual(parsed.verifiedSources.length, 1);
  assert.strictEqual(parsed.verifiedSources[0].meetingId, "6aa5949862695fb6ce009783");
  console.log("✅ parseAndVerifySources cleanly strips ```sources and verifies references.");

  // 3. Test parseAndVerifySources with inline tag only (no code fence)
  const rawInlineOnly = "We decided to postpone deployment [SRC-1] until Friday.";
  const parsedInline = parseAndVerifySources({
    rawContent: rawInlineOnly,
    meetings: [{ _id: "6aa5949862695fb6ce009783", title: "Sprint Planning" }],
    sourceRegistry: mockRegistry,
  });

  assert.strictEqual(parsedInline.cleanMessage, rawInlineOnly);
  assert.strictEqual(parsedInline.verifiedSources.length, 1);
  console.log("✅ parseAndVerifySources handles inline tags without fence cleanly.");

  console.log("\n🎉 All Streaming Unit Tests Passed Successfully!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
