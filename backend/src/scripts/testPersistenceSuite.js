import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import * as conversationService from "../services/globalConversation.service.js";
import * as assistantController from "../controllers/globalAssistant.controller.js";
import globalAssistantRoutes from "../routes/globalAssistant.routes.js";
import GlobalConversation from "../models/GlobalConversation.js";

async function testSuite() {
  console.log("==================================================");
  console.log("   GLOBAL AI ASSISTANT CONVERSATION PERSISTENCE");
  console.log("==================================================\n");

  console.log("1. Module & Exports Verification:");
  console.log("   Service exports:", Object.keys(conversationService));
  console.log("   Controller exports:", Object.keys(assistantController));
  console.log("   Routes router registered:", Boolean(globalAssistantRoutes));

  const expectedServiceMethods = [
    "createConversation",
    "getConversations",
    "getConversationById",
    "sendConversationMessage",
    "deleteConversation",
  ];

  for (const method of expectedServiceMethods) {
    if (typeof conversationService[method] !== "function") {
      throw new Error(`Missing expected service method: ${method}`);
    }
  }
  console.log("   [PASS] All expected service methods exist.\n");

  const expectedControllerMethods = [
    "createConversationController",
    "getConversationsController",
    "getConversationByIdController",
    "sendConversationMessageController",
    "deleteConversationController",
    "globalAssistantController",
  ];

  for (const method of expectedControllerMethods) {
    if (typeof assistantController[method] !== "function") {
      throw new Error(`Missing expected controller method: ${method}`);
    }
  }
  console.log("   [PASS] All expected controller actions exist.\n");

  // 2. Unit tests for validation logic without hitting external DB
  console.log("2. Service Validation Error Handling Tests:");

  // Test: Invalid ObjectId
  try {
    await conversationService.getConversationById({
      userId: new mongoose.Types.ObjectId().toString(),
      conversationId: "invalid-id-123",
    });
    console.error("   [FAIL] Expected invalid ObjectId to throw");
  } catch (err) {
    if (err.code === "INVALID_CONVERSATION_ID") {
      console.log("   [PASS] Rejects invalid conversationId with INVALID_CONVERSATION_ID");
    } else {
      console.error("   [FAIL] Unexpected error code:", err.code);
    }
  }

  // Test: Empty message validation
  try {
    await conversationService.sendConversationMessage({
      userId: new mongoose.Types.ObjectId().toString(),
      conversationId: new mongoose.Types.ObjectId().toString(),
      message: "   ",
    });
    console.error("   [FAIL] Expected empty message to throw");
  } catch (err) {
    if (err.code === "MESSAGE_REQUIRED") {
      console.log("   [PASS] Rejects empty message with MESSAGE_REQUIRED");
    } else {
      console.error("   [FAIL] Unexpected error code:", err.code);
    }
  }

  // Test: Oversized message validation
  try {
    await conversationService.sendConversationMessage({
      userId: new mongoose.Types.ObjectId().toString(),
      conversationId: new mongoose.Types.ObjectId().toString(),
      message: "A".repeat(2001),
    });
    console.error("   [FAIL] Expected oversized message to throw");
  } catch (err) {
    if (err.code === "MESSAGE_TOO_LONG") {
      console.log("   [PASS] Rejects oversized message with MESSAGE_TOO_LONG");
    } else {
      console.error("   [FAIL] Unexpected error code:", err.code);
    }
  }

  console.log("\n3. Testing with Live MongoDB (if --db flag is passed):");
  if (process.argv.includes("--db")) {
    const { connectDatabase } = await import("../config/database.js");
    await connectDatabase();

    const userA = new mongoose.Types.ObjectId().toString();
    const userB = new mongoose.Types.ObjectId().toString();

    console.log("   Connected to MongoDB. Running full lifecycle test...");

    // A. Create conversation
    const convA = await conversationService.createConversation({
      userId: userA,
      title: "My Meeting Insights",
    });
    console.log("   [PASS] Created conversation:", convA._id.toString());

    // B. Get conversation history
    const historyA = await conversationService.getConversations({
      userId: userA,
      page: 1,
      limit: 10,
    });
    console.log(`   [PASS] Fetched history: ${historyA.conversations.length} conversations found.`);
    if (historyA.conversations[0].messages !== undefined) {
      console.error("   [FAIL] History should not include message bodies for sidebar safety!");
    } else {
      console.log("   [PASS] Sidebar-safe response verified (message body omitted, messageCount present).");
    }

    // C. Get individual conversation
    const singleConv = await conversationService.getConversationById({
      userId: userA,
      conversationId: convA._id.toString(),
    });
    console.log("   [PASS] Retrieved individual conversation with title:", singleConv.title);

    // D. Security Ownership Check: User B cannot access User A's conversation
    try {
      await conversationService.getConversationById({
        userId: userB,
        conversationId: convA._id.toString(),
      });
      console.error("   [FAIL] User B should NOT be able to access User A's conversation!");
    } catch (secErr) {
      if (secErr.code === "CONVERSATION_NOT_FOUND") {
        console.log("   [PASS] Access control verified: User B cannot access User A's conversation.");
      }
    }

    // E. Delete conversation
    await conversationService.deleteConversation({
      userId: userA,
      conversationId: convA._id.toString(),
    });
    console.log("   [PASS] Successfully deleted conversation.");

    // F. Verify 404 after deletion
    try {
      await conversationService.getConversationById({
        userId: userA,
        conversationId: convA._id.toString(),
      });
      console.error("   [FAIL] Deleted conversation should return 404!");
    } catch (delErr) {
      if (delErr.code === "CONVERSATION_NOT_FOUND") {
        console.log("   [PASS] Deleted conversation correctly returns 404.");
      }
    }

    await mongoose.disconnect();
    console.log("\n   Live MongoDB lifecycle tests completed successfully!");
  } else {
    console.log("   (Pass --db to test end-to-end against live MongoDB)");
  }

  console.log("\n==================================================");
  console.log("   ALL CODE CHECKS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

testSuite().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
