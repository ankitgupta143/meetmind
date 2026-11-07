import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import GlobalConversation from "../models/GlobalConversation.js";

async function testSourceReferences() {
  console.log("==================================================");
  console.log("   TESTING PRIORITY 3: SOURCE REFERENCES");
  console.log("==================================================\n");

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

  const testOwnerId = new mongoose.Types.ObjectId();
  const testMeetingId = new mongoose.Types.ObjectId();

  // Test 1: Backward Compatibility - Message with no sources
  const legacyMessageDoc = new GlobalConversation({
    ownerId: testOwnerId,
    messages: [
      {
        role: "user",
        content: "What did we discuss?",
      },
      {
        role: "assistant",
        content: "You discussed the marketing campaign.",
      },
    ],
  });

  try {
    await legacyMessageDoc.validate();
    assert(
      legacyMessageDoc.messages[1].sources === undefined ||
        legacyMessageDoc.messages[1].sources.length === 0,
      "Legacy messages without sources pass validation (backward compatible)"
    );
  } catch (err) {
    assert(false, `Legacy message validation failed: ${err.message}`);
  }

  // Test 2: Message with structured source references
  const docWithSources = new GlobalConversation({
    ownerId: testOwnerId,
    messages: [
      {
        role: "assistant",
        content: "The team agreed to complete the API integration by Friday.",
        sources: [
          {
            meetingId: testMeetingId,
            meetingTitle: "Sprint Planning Meeting",
            excerpt: "We should aim to finish the API integration by Friday...",
            startTime: 755,
            endTime: 780,
            speaker: "John",
          },
        ],
      },
    ],
  });

  try {
    await docWithSources.validate();
    const source = docWithSources.messages[0].sources[0];
    assert(
      source.meetingId.toString() === testMeetingId.toString(),
      "Source references preserve meetingId"
    );
    assert(
      source.meetingTitle === "Sprint Planning Meeting",
      "Source references preserve meetingTitle"
    );
    assert(
      source.startTime === 755 && source.endTime === 780,
      "Source references preserve timestamps"
    );
    assert(
      source.speaker === "John",
      "Source references preserve speaker"
    );
    assert(
      source.excerpt.includes("API integration"),
      "Source references preserve excerpt"
    );
  } catch (err) {
    assert(false, `Document with sources failed validation: ${err.message}`);
  }

  // Test 3: Validation constraints on sources
  const invalidSourceDoc = new GlobalConversation({
    ownerId: testOwnerId,
    messages: [
      {
        role: "assistant",
        content: "Answer",
        sources: [
          {
            // Missing required meetingId and meetingTitle
            excerpt: "Some excerpt",
          },
        ],
      },
    ],
  });

  try {
    await invalidSourceDoc.validate();
    assert(false, "Should reject sources missing meetingId or meetingTitle");
  } catch (err) {
    assert(
      err.errors?.["messages.0.sources.0.meetingId"] !== undefined ||
        err.errors?.["messages.0.sources.0.meetingTitle"] !== undefined,
      "Rejects source references missing meetingId or meetingTitle"
    );
  }

  // Test 4: Live MongoDB Persistence (if --db flag passed)
  if (process.argv.includes("--db")) {
    console.log("\nRunning live MongoDB persistence check...");
    const { connectDatabase } = await import("../config/database.js");
    await connectDatabase();

    const created = await GlobalConversation.create({
      ownerId: testOwnerId,
      title: "Test Sources Chat",
      messages: [
        {
          role: "assistant",
          content: "Answer with verified sources",
          sources: [
            {
              meetingId: testMeetingId,
              meetingTitle: "Weekly Sync",
              excerpt: "Discussing architecture changes.",
              startTime: 120,
              endTime: 150,
              speaker: "Alice",
            },
          ],
        },
      ],
    });

    const retrieved = await GlobalConversation.findById(created._id).lean();
    assert(
      retrieved.messages[0].sources?.length === 1,
      "Live DB: successfully persisted and retrieved message with sources"
    );
    assert(
      retrieved.messages[0].sources[0].speaker === "Alice",
      "Live DB: speaker data accurately retrieved"
    );

    await GlobalConversation.findByIdAndDelete(created._id);
    await mongoose.disconnect();
    console.log("Live DB check complete.");
  }

  console.log(`\nResults: ${testsPassed}/${totalTests} tests passed.`);
  console.log("==================================================");
}

testSourceReferences().catch((err) => {
  console.error(err);
  process.exit(1);
});
