const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked:
    "That email is already registered with a password. Sign in with email instead.",
  Configuration:
    "Sign-in is not configured. Check AUTH_SECRET and the GitHub credentials.",
  AccessDenied: "Access was denied.",
};

export function authErrorMessage(code: string | undefined): string | undefined {
  if (!code) return undefined;
  return AUTH_ERROR_MESSAGES[code] ?? "Could not sign in. Try again.";
}
