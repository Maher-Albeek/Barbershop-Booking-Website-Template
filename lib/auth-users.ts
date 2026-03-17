export type AuthRole = "admin" | "employee";

export type AuthUserRecord = {
  id: string;
  email: string;
  role: AuthRole;
  displayName: string;
  employeeSlug?: string;
  canManageAvailability?: boolean;
  passwordSalt: string;
  passwordHash: string;
};

export const authUsers: AuthUserRecord[] = [
  {
    id: "admin-1",
    email: "admin@crownblade.local",
    role: "admin",
    displayName: "Shop Admin",
    passwordSalt: "cbca17c9584f2fcb59a0d2701253b6da",
    passwordHash:
      "5b30f3019630c18180331b3bbccab44c8241f0e71f641e8cb8c577dfc56a853eba06a945d634b950e231377ebf756b80cc2c710ed0727fe2f67e8182a7640878"
  },
  {
    id: "employee-1",
    email: "samir@crownblade.local",
    role: "employee",
    displayName: "Samir Haddad",
    employeeSlug: "samir-haddad",
    canManageAvailability: true,
    passwordSalt: "b572d2ea55bd90b48d3cb074a32761d6",
    passwordHash:
      "c41e2d4e694e03dccaa15a094953c9d4d143dbc572d601fbb1dc925fb46afe4f9c1cd855b4c0feb8f808911803c36d2be63018d2b860471bbc899ab4700e3dcf"
  }
];
