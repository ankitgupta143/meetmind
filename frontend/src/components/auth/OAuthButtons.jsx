"use client";

import SocialButton from "./SocialButton";

export default function OAuthButtons() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const handleOAuth = (provider) => {
    window.location.href = `${apiUrl}/auth/${provider.toLowerCase()}`;
  };

  return (
    <div className="flex gap-3">
      <SocialButton
        provider="Google"
        onClick={() => handleOAuth("Google")}
      />
      <SocialButton
        provider="GitHub"
        onClick={() => handleOAuth("GitHub")}
      />
    </div>
  );
}
