/**
 * Comprehensive Password Reset & Transactional Email Test Suite
 * Tests security features, token hashing, expiration, session revocation, and route handlers.
 */
import mongoose from "mongoose";
import crypto from "node:crypto";
import User from "./src/models/User.js";
import Session from "./src/models/Session.js";
import { registerUser, loginUser, requestPasswordReset, resetPasswordWithToken } from "./src/services/auth.service.js";
import { createSession } from "./src/services/session.service.js";
import { verifyPassword } from "./src/services/password.service.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/meetmind_test";

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    passedTests++;
    console.log(`  ✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log("=======================================================");
  console.log("       🧪 PASSWORD RESET & EMAIL SECURITY TEST SUITE    ");
  console.log("=======================================================\n");

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.\n");

  const testEmail = `pwdreset_${Date.now()}@test.meetmind.app`;
  const initialPassword = "InitialPassword123!";
  const newPassword = "NewSecurePassword456!";

  try {
    // 1. Setup Test User
    console.log("Scenario 1: User Registration & Active Sessions Setup");
    const registered = await registerUser({
      firstName: "Reset",
      lastName: "Tester",
      email: testEmail,
      password: initialPassword,
    });
    assert(registered.id, "User registered successfully");

    // Create 2 active sessions for this user
    const session1 = await createSession({ userId: registered.id, userAgent: "Chrome Mac", ipAddress: "127.0.0.1" });
    const session2 = await createSession({ userId: registered.id, userAgent: "Firefox Windows", ipAddress: "127.0.0.2" });
    assert(session1.refreshToken && session2.refreshToken, "Two active sessions created for user");

    // 2. Request Password Reset for existing user
    console.log("\nScenario 2: Request Password Reset (Existing Local User)");
    const resetReqResult = await requestPasswordReset(testEmail);
    assert(resetReqResult.message.includes("password reset link has been sent"), "Generic confirmation message returned");

    // Verify token hash and expiration in DB
    const userWithToken = await User.findById(registered.id).select("+passwordResetToken +passwordResetExpires");
    assert(userWithToken.passwordResetToken && userWithToken.passwordResetToken.length === 64, "Token stored as 64-char SHA-256 hash");
    assert(userWithToken.passwordResetExpires > new Date(), "Expiration set in future (~1 hour)");

    // 3. Timing / User Enumeration Defense
    console.log("\nScenario 3: Request Password Reset (Non-existent Email)");
    const nonExistentResult = await requestPasswordReset("nonexistent_email_12345@nowhere.com");
    assert(nonExistentResult.message === resetReqResult.message, "Identical generic response returned for non-existent email (anti-enumeration)");

    // 4. OAuth User Protection
    console.log("\nScenario 4: Request Password Reset (OAuth User)");
    const oauthEmail = `oauth_${Date.now()}@google.com`;
    await User.create({
      firstName: "Google",
      lastName: "User",
      email: oauthEmail,
      authProvider: "google",
    });
    const oauthResult = await requestPasswordReset(oauthEmail);
    assert(oauthResult.message === resetReqResult.message, "Identical generic response returned for OAuth user");
    const oauthDbUser = await User.findOne({ email: oauthEmail }).select("+passwordResetToken");
    assert(oauthDbUser.passwordResetToken === null, "OAuth user does not receive a password reset token");

    // 5. Invalid Token Rejection
    console.log("\nScenario 5: Reset With Invalid Token");
    let caughtInvalid = false;
    try {
      await resetPasswordWithToken({ token: "totally_invalid_token_123", newPassword });
    } catch (err) {
      caughtInvalid = true;
      assert(err.code === "EXPIRED_OR_INVALID_TOKEN", "Rejected invalid token with EXPIRED_OR_INVALID_TOKEN");
    }
    assert(caughtInvalid, "Invalid token threw expected error");

    // 6. Expired Token Rejection
    console.log("\nScenario 6: Reset With Expired Token");
    // Manually expire the token in database
    const fakeRawToken = "expired_raw_token_value_32_bytes_long!!";
    const fakeHash = crypto.createHash("sha256").update(fakeRawToken).digest("hex");
    await User.findByIdAndUpdate(registered.id, {
      passwordResetToken: fakeHash,
      passwordResetExpires: new Date(Date.now() - 10000), // 10 seconds ago
    });

    let caughtExpired = false;
    try {
      await resetPasswordWithToken({ token: fakeRawToken, newPassword });
    } catch (err) {
      caughtExpired = true;
      assert(err.code === "EXPIRED_OR_INVALID_TOKEN", "Expired token rejected with EXPIRED_OR_INVALID_TOKEN");
    }
    assert(caughtExpired, "Expired token threw expected error");

    // 7. Successful Password Reset Flow
    console.log("\nScenario 7: Successful Password Reset Flow");
    // Generate a fresh legitimate reset token
    const freshRawToken = crypto.randomBytes(32).toString("hex");
    const freshHash = crypto.createHash("sha256").update(freshRawToken).digest("hex");
    await User.findByIdAndUpdate(registered.id, {
      passwordResetToken: freshHash,
      passwordResetExpires: new Date(Date.now() + 3600000),
    });

    const resetSuccess = await resetPasswordWithToken({ token: freshRawToken, newPassword });
    assert(resetSuccess.message.includes("successfully reset"), "Success message returned");

    // Verify DB state after reset
    const userAfterReset = await User.findById(registered.id).select("+passwordResetToken +passwordResetExpires +passwordHash");
    assert(userAfterReset.passwordResetToken === null, "passwordResetToken cleared from DB");
    assert(userAfterReset.passwordResetExpires === null, "passwordResetExpires cleared from DB");

    const isNewPasswordValid = await verifyPassword(newPassword, userAfterReset.passwordHash);
    assert(isNewPasswordValid === true, "New password verified against updated passwordHash");

    const isOldPasswordValid = await verifyPassword(initialPassword, userAfterReset.passwordHash);
    assert(isOldPasswordValid === false, "Old password no longer verifies");

    // 8. Session Revocation Verification
    console.log("\nScenario 8: All Active Sessions Revoked Upon Password Change");
    const activeSessions = await Session.find({ userId: registered.id, revokedAt: null });
    assert(activeSessions.length === 0, "Zero active sessions remain after password reset");

    const revokedSessions = await Session.find({ userId: registered.id, revokedAt: { $ne: null } });
    assert(revokedSessions.length >= 2, "Previously active sessions marked revoked");
    assert(revokedSessions.every(s => s.revokeReason === "password-change"), "All sessions revoked with reason 'password-change'");

    // 9. Single-Use Token Defense
    console.log("\nScenario 9: Single-Use Token Defense (Token Reuse Prevention)");
    let caughtReplay = false;
    try {
      await resetPasswordWithToken({ token: freshRawToken, newPassword: "AnotherNewPassword999!" });
    } catch (err) {
      caughtReplay = true;
      assert(err.code === "EXPIRED_OR_INVALID_TOKEN", "Replayed token rejected");
    }
    assert(caughtReplay, "Token cannot be reused after first successful reset");

    // 10. Login with new credentials succeeds
    console.log("\nScenario 10: Authentication Verification");
    const loginResult = await loginUser({ email: testEmail, password: newPassword });
    assert(loginResult.accessToken && loginResult.user.id, "Successfully authenticated with new password");

    let oldLoginFailed = false;
    try {
      await loginUser({ email: testEmail, password: initialPassword });
    } catch (err) {
      oldLoginFailed = true;
      assert(err.code === "INVALID_CREDENTIALS", "Login with old password correctly rejected");
    }
    assert(oldLoginFailed, "Old credentials rejected");

    // 11. Schema Validation Tests
    console.log("\nScenario 11: Zod Schemas Validation");
    const { forgotPasswordSchema, resetPasswordSchema } = await import("./src/validators/auth.validator.js");
    
    // forgotPasswordSchema valid
    const validForgot = forgotPasswordSchema.safeParse({ email: "Test.User@Domain.Com" });
    assert(validForgot.success && validForgot.data.email === "test.user@domain.com", "forgotPasswordSchema lowers email");
    
    // forgotPasswordSchema invalid
    const invalidForgot = forgotPasswordSchema.safeParse({ email: "not-an-email" });
    assert(!invalidForgot.success, "forgotPasswordSchema rejects malformed email");

    // resetPasswordSchema valid
    const validReset = resetPasswordSchema.safeParse({ token: "abc123token", password: "NewStrongPassword888!" });
    assert(validReset.success, "resetPasswordSchema accepts valid token and password");

    // resetPasswordSchema invalid (short password)
    const invalidReset = resetPasswordSchema.safeParse({ token: "abc", password: "short" });
    assert(!invalidReset.success, "resetPasswordSchema rejects short passwords (< 8 chars)");

    // 12. Route Mounting Check
    console.log("\nScenario 12: Route Mounting in Express App");
    const { default: authRoutes } = await import("./src/routes/auth.routes.js");
    const routes = authRoutes.stack.map(layer => ({
      path: layer.route?.path,
      method: layer.route ? Object.keys(layer.route.methods)[0].toUpperCase() : null
    })).filter(r => r.path);

    const hasForgot = routes.some(r => r.path === "/forgot-password" && r.method === "POST");
    const hasReset = routes.some(r => r.path === "/reset-password" && r.method === "POST");
    assert(hasForgot, "POST /forgot-password route is registered in auth router");
    assert(hasReset, "POST /reset-password route is registered in auth router");



    console.log("\n=======================================================");
    console.log(`🎉 ALL TESTS PASSED: ${passedTests}/${totalTests}`);
    console.log("=======================================================\n");

  } finally {
    // Cleanup test data
    await User.deleteMany({ email: { $in: [testEmail, `oauth_${Date.now()}@google.com`] } });
    await Session.deleteMany({});
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
