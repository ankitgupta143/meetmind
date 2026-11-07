import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import GlobalConversation from "../models/GlobalConversation.js";

async function testGlobalConversationModel() {
  console.log("============================================");
  console.log("   TESTING GLOBAL CONVERSATION MODEL");
  console.log("============================================\n");

  let testsPassed = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      testsPassed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. In-Memory Mongoose Schema Validation
  console.log("1. Running Schema & Validation Tests:\n");

  const testOwnerId = new mongoose.Types.ObjectId();

  // Test 1: Valid conversation document
  const validDoc = new GlobalConversation({
    ownerId: testOwnerId,
    messages: [
      { role: "user", content: "Summarize my meetings" },
      { role: "assistant", content: "Here is your summary..." },
    ],
  });

  try {
    await validDoc.validate();
    assert(true, "Valid document passes validation");
  } catch (err) {
    assert(false, `Valid document failed validation: ${err.message}`);
  }

  // Test 2: Default Title
  assert(
    validDoc.title === "New conversation",
    "Default title is set to 'New conversation'"
  );

  // Test 3: Embedded Subdocuments & Subdocument IDs
  assert(validDoc.messages.length === 2, "Contains 2 embedded messages");
  assert(
    validDoc.messages[0]._id instanceof mongoose.Types.ObjectId,
    "Embedded message has its own valid subdocument ObjectId (_id)"
  );

  // Test 4: Default lastMessageAt
  assert(
    validDoc.lastMessageAt instanceof Date,
    "lastMessageAt defaults to a valid Date"
  );

  // Test 5: Reject missing ownerId
  const missingOwnerDoc = new GlobalConversation({
    messages: [{ role: "user", content: "Hi" }],
  });
  try {
    await missingOwnerDoc.validate();
    assert(false, "Should fail when ownerId is missing");
  } catch (err) {
    assert(
      err.errors?.ownerId !== undefined,
      "Fails validation when ownerId is missing"
    );
  }

  // Test 6: Reject invalid role (enum check)
  const invalidRoleDoc = new GlobalConversation({
    ownerId: testOwnerId,
    messages: [{ role: "system", content: "Prompt injection" }],
  });
  try {
    await invalidRoleDoc.validate();
    assert(false, "Should fail when message role is not 'user' or 'assistant'");
  } catch (err) {
    assert(
      err.errors?.["messages.0.role"] !== undefined,
      "Fails validation when message role is invalid"
    );
  }

  // Test 7: Reject missing message content
  const missingContentDoc = new GlobalConversation({
    ownerId: testOwnerId,
    messages: [{ role: "user" }],
  });
  try {
    await missingContentDoc.validate();
    assert(false, "Should fail when message content is missing");
  } catch (err) {
    assert(
      err.errors?.["messages.0.content"] !== undefined,
      "Fails validation when message content is missing"
    );
  }

  // Test 8: Reject title exceeding 100 characters
  const longTitleDoc = new GlobalConversation({
    ownerId: testOwnerId,
    title: "A".repeat(101),
  });
  try {
    await longTitleDoc.validate();
    assert(false, "Should fail when title exceeds 100 characters");
  } catch (err) {
    assert(
      err.errors?.title !== undefined,
      "Fails validation when title exceeds 100 characters"
    );
  }

  // Test 9: Verify indexes
  const indexes = GlobalConversation.schema.indexes();
  const hasCompoundIndex = indexes.some(
    ([fields]) => fields.ownerId === 1 && fields.lastMessageAt === -1
  );
  assert(
    hasCompoundIndex,
    "Compound index { ownerId: 1, lastMessageAt: -1 } is defined"
  );

  console.log(`\nResults: ${testsPassed}/${totalTests} tests passed.`);

  // 2. Database Connection Test (run if --db flag passed)
  const shouldTestDb = process.argv.includes("--db");
  if (shouldTestDb) {
    console.log("\n2. Running Live Database Persistence Test:");
    const { connectDatabase } = await import("../config/database.js");
    await connectDatabase();

    const createdConv = await GlobalConversation.create({
      ownerId: testOwnerId,
      title: "Test DB Chat",
      messages: [
        { role: "user", content: "Hello test" },
        { role: "assistant", content: "Hello response" },
      ],
    });

    console.log(`Created document in DB: ${createdConv._id}`);
    const found = await GlobalConversation.findById(createdConv._id);
    console.log(`Found document: "${found.title}" with ${found.messages.length} messages.`);

    await GlobalConversation.findByIdAndDelete(createdConv._id);
    console.log("Cleaned up test document from DB.");
    await mongoose.disconnect();
  } else {
    console.log(
      "\nNote: To run live database persistence test with MongoDB, pass the --db flag:\nnode backend/src/scripts/testGlobalConversationModel.js --db"
    );
  }
}

testGlobalConversationModel().catch(console.error);
