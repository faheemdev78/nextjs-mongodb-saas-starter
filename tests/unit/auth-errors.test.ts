import { describe, expect, it } from "vitest";

import { authErrorMessage } from "@/lib/auth-errors";

describe("authErrorMessage", () => {
  it("returns undefined when Auth.js did not send an error", () => {
    expect(authErrorMessage(undefined)).toBeUndefined();
  });

  it("maps known Auth.js codes and falls back for the rest", () => {
    expect(authErrorMessage("CredentialsSignin")).toMatch(/Invalid email/);
    expect(authErrorMessage("OAuthAccountNotLinked")).toMatch(/password/);
    expect(authErrorMessage("SomethingNew")).toMatch(/Could not sign in/);
  });
});
