import { registerSchema } from "../validators/auth.validator.js";

const validInput = {
  firstName: "  Ankit ",
  lastName: "Gupta",
  email: " ANKIT@Example.COM ",
  password: "MeetMind@123",
};

const invalidInput = {
  firstName: "A",
  lastName: "",
  email: "not-an-email",
  password: "123",
};

console.log("\nValid input:");

const validResult = registerSchema.safeParse(validInput);

console.log(validResult);

console.log("\nInvalid input:");

const invalidResult = registerSchema.safeParse(invalidInput);

console.log(invalidResult);