import bcrypt from "bcryptjs";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "owner" | "manager" | "support";
}

// Demo credentials — email: admin@tuana.com / password: tuana-admin-2026
// Swap this module for a real users table once a database is connected.
const seedHash = bcrypt.hashSync("tuana-admin-2026", 10);

export const adminUsers: AdminUser[] = [
  { id: "admin-1", name: "Jordan Ellis", email: "admin@tuana.com", passwordHash: seedHash, role: "owner" },
];

export function findAdminByEmail(email: string) {
  return adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function verifyAdminPassword(user: AdminUser, password: string) {
  return bcrypt.compareSync(password, user.passwordHash);
}
