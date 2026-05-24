import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

type EmployeeProfileMeta = {
  position?: string;
  instagramUrl?: string;
};

type EmployeeProfilesFile = {
  profiles: Record<string, EmployeeProfileMeta>;
};

const EMPLOYEE_PROFILES_FILE_PATH = join(process.cwd(), "data", "employee-profiles.json");

function parseProfileMeta(value: unknown): EmployeeProfileMeta | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const input = value as Record<string, unknown>;
  const position = typeof input.position === "string" && input.position.trim() ? input.position.trim() : undefined;
  const instagramUrl =
    typeof input.instagramUrl === "string" && input.instagramUrl.trim()
      ? input.instagramUrl.trim()
      : undefined;

  if (!position && !instagramUrl) {
    return null;
  }

  return {
    position,
    instagramUrl
  };
}

export function loadEmployeeProfiles(): Record<number, EmployeeProfileMeta> {
  try {
    const raw = readFileSync(EMPLOYEE_PROFILES_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as EmployeeProfilesFile;

    if (!parsed || typeof parsed !== "object" || !parsed.profiles || typeof parsed.profiles !== "object") {
      return {};
    }

    const result: Record<number, EmployeeProfileMeta> = {};

    for (const [employeeId, value] of Object.entries(parsed.profiles)) {
      const parsedEmployeeId = Number.parseInt(employeeId, 10);

      if (!Number.isFinite(parsedEmployeeId) || parsedEmployeeId <= 0) {
        continue;
      }

      const profile = parseProfileMeta(value);

      if (profile) {
        result[parsedEmployeeId] = profile;
      }
    }

    return result;
  } catch {
    return {};
  }
}

export function saveEmployeeProfile(employeeId: number, profile: EmployeeProfileMeta) {
  const existing = loadEmployeeProfiles();

  if (profile.position || profile.instagramUrl) {
    existing[employeeId] = {
      position: profile.position,
      instagramUrl: profile.instagramUrl
    };
  } else {
    delete existing[employeeId];
  }

  const payload: EmployeeProfilesFile = {
    profiles: {}
  };

  for (const [id, value] of Object.entries(existing)) {
    payload.profiles[id] = value;
  }

  mkdirSync(dirname(EMPLOYEE_PROFILES_FILE_PATH), { recursive: true });
  writeFileSync(EMPLOYEE_PROFILES_FILE_PATH, JSON.stringify(payload, null, 2), "utf8");
}
