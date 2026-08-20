import User from "../models/User.js";

export async function getCurrentUser(userId) {
  const user = await User.findById(userId)
    .lean();

  if (!user) {
    const error = new Error("User not found.");
    error.code = "USER_NOT_FOUND";

    throw error;
  }

  if (user.status === "deleted") {
    const error = new Error(
      "User account no longer exists."
    );

    error.code = "USER_DELETED";

    throw error;
  }

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    authProvider: user.authProvider,
    emailVerifiedAt: user.emailVerifiedAt,
    onboardingCompleted: user.onboardingCompleted,
    role: user.role,
    status: user.status,
    profile: user.profile,
    avatar: user.avatar,
    settings: user.settings,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateCurrentUser(
  userId,
  updates
) {
  const setOperations = {};

  if (updates.firstName !== undefined) {
    setOperations.firstName =
      updates.firstName;
  }

  if (updates.lastName !== undefined) {
    setOperations.lastName =
      updates.lastName;
  }

  if (updates.phone !== undefined) {
    setOperations["profile.phone"] =
      updates.phone;
  }

  if (updates.company !== undefined) {
    setOperations["profile.company"] =
      updates.company;
  }

  if (updates.jobTitle !== undefined) {
    setOperations["profile.jobTitle"] =
      updates.jobTitle;
  }

  if (updates.country !== undefined) {
    setOperations["profile.country"] =
      updates.country;
  }

  if(updates.avatar !== undefined){
    setOperations.avatar = {
      url: updates.avatar.url ?? null,
      publicId: updates.avatar.publicId ?? null,
    }
  }

  if (updates.timezone !== undefined) {
    setOperations[
      "settings.localization.timezone"
    ] = updates.timezone;
  }

  if (updates.language !== undefined) {
    setOperations[
      "settings.localization.language"
    ] = updates.language;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: setOperations,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!user) {
    const error = new Error("User not found.");
    error.code = "USER_NOT_FOUND";

    throw error;
  }

  if (user.status === "deleted") {
    const error = new Error(
      "User account no longer exists."
    );

    error.code = "USER_DELETED";

    throw error;
  }

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    authProvider: user.authProvider,
    emailVerifiedAt: user.emailVerifiedAt,
    onboardingCompleted: user.onboardingCompleted,
    role: user.role,
    status: user.status,
    profile: user.profile,
    avatar: user.avatar,
    settings: user.settings,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}