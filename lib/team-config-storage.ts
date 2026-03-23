import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { locales, type Locale } from "@/lib/i18n";

type TeamMemberSnapshot = {
  slug: string;
  isActive: boolean;
  imageSrc: string;
  bookingServiceSlugs: string[];
  specialties: string[];
  name: string;
  bio?: string;
};

type TeamMembersFile = {
  team: Partial<Record<Locale, TeamMemberSnapshot[]>>;
};

const TEAM_MEMBERS_FILE_PATH = join(process.cwd(), "data", "team-members.json");

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseMember(value: unknown): TeamMemberSnapshot | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const input = value as Record<string, unknown>;

  if (
    typeof input.slug !== "string" ||
    typeof input.isActive !== "boolean" ||
    typeof input.imageSrc !== "string" ||
    !isStringArray(input.bookingServiceSlugs) ||
    !isStringArray(input.specialties) ||
    typeof input.name !== "string"
  ) {
    return null;
  }

  return {
    slug: input.slug,
    isActive: input.isActive,
    imageSrc: input.imageSrc,
    bookingServiceSlugs: input.bookingServiceSlugs,
    specialties: input.specialties,
    name: input.name,
    bio: typeof input.bio === "string" ? input.bio : undefined
  };
}

export function loadPersistedTeamMembers(): Partial<Record<Locale, TeamMemberSnapshot[]>> {
  try {
    const raw = readFileSync(TEAM_MEMBERS_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as TeamMembersFile;

    if (!parsed || typeof parsed !== "object" || !parsed.team || typeof parsed.team !== "object") {
      return {};
    }

    const result: Partial<Record<Locale, TeamMemberSnapshot[]>> = {};

    for (const locale of locales) {
      const list = parsed.team[locale];

      if (!Array.isArray(list)) {
        continue;
      }

      const normalized = list
        .map((item) => parseMember(item))
        .filter((item): item is TeamMemberSnapshot => item !== null);

      if (normalized.length > 0) {
        result[locale] = normalized;
      }
    }

    return result;
  } catch {
    return {};
  }
}

export function savePersistedTeamMembers(team: Record<Locale, { members: TeamMemberSnapshot[] }>) {
  const payload: TeamMembersFile = {
    team: {}
  };

  for (const locale of locales) {
    payload.team[locale] = team[locale].members;
  }

  mkdirSync(dirname(TEAM_MEMBERS_FILE_PATH), { recursive: true });
  writeFileSync(TEAM_MEMBERS_FILE_PATH, JSON.stringify(payload, null, 2), "utf8");
}
