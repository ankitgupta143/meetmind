import argon2 from "argon2";

const password = "MeetMind@123";

const hash = await argon2.hash(password, {
  type: argon2.argon2id,
});

console.log("\nOriginal password:");
console.log(password);

console.log("\nGenerated hash:");
console.log(hash);

const validPassword = await argon2.verify(
  hash,
  password
);

console.log("\nCorrect password:");
console.log(validPassword);

const invalidPassword = await argon2.verify(
  hash,
  "WrongPassword123"
);

console.log("\nWrong password:");
console.log(invalidPassword);