import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authUsers, type AuthRole } from "@/lib/auth-users";

const SESSION_COOKIE_NAME = "barbershop_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  role: AuthRole;
  email: string;
  displayName: string;
  employeeSlug?: string;
  canManageAvailability?: boolean;
  iat: number;
  exp: number;
};

export type AuthSession = SessionPayload;

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET ?? "barbershop-dev-session-secret-change-me";
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const body = toBase64Url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

function decodeSession(value: string): SessionPayload | null {
  const [body, signature] = value.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = sign(body);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function verifyPassword(password: string, saltHex: string, expectedHashHex: string) {
  const actualHash = scryptSync(password, Buffer.from(saltHex, "hex"), 64, {
    N: 16384,
    r: 8,
    p: 1
  });
  const expectedHash = Buffer.from(expectedHashHex, "hex");

  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
}

export function authenticateUser(email: string, password: string) {
  const user = authUsers.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    return null;
  }

  return user;
}

export async function createSession(input: {
  userId: string;
  role: AuthRole;
  email: string;
  displayName: string;
  employeeSlug?: string;
  canManageAvailability?: boolean;
}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const session = encodeSession({
    sub: input.userId,
    role: input.role,
    email: input.email,
    displayName: input.displayName,
    employeeSlug: input.employeeSlug,
    canManageAvailability: input.canManageAvailability,
    iat: issuedAt,
    exp: issuedAt + SESSION_TTL_SECONDS
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawSession) {
    return null;
  }

  return decodeSession(rawSession);
}

export async function requireRole(
  allowedRoles: AuthRole[],
  locale: string,
  destinationPath: string
) {
  const session = await getSession();

  if (!session || !allowedRoles.includes(session.role)) {
    const params = new URLSearchParams({
      role: allowedRoles[0],
      redirectTo: `/${locale}${destinationPath}`
    });
    redirect(`/${locale}/login?${params.toString()}`);
  }

  return session;
}

export function generateTemporaryPassword() {
  return randomBytes(12).toString("base64url");
}
