import bcrypt from "bcryptjs";

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// In-memory store — resets on server restart. Replace with a real users
// table (Supabase/Postgres/etc.) once one is connected; the two server
// actions in `account/actions.ts` are the only callers.
const demoHash = bcrypt.hashSync("tuana-demo-2026", 10);

export const customerAccounts: CustomerAccount[] = [
  { id: "cust-1", name: "Maren Kessler", email: "maren.kessler@gmail.com", passwordHash: demoHash },
];

export function findCustomerByEmail(email: string) {
  return customerAccounts.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerCustomer(name: string, email: string, password: string): CustomerAccount {
  const account: CustomerAccount = {
    id: `cust-${customerAccounts.length + 1}-${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
  };
  customerAccounts.push(account);
  return account;
}

export function verifyCustomerPassword(user: CustomerAccount, password: string) {
  return bcrypt.compareSync(password, user.passwordHash);
}
