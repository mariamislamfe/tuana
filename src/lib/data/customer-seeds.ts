import type { Address } from "@/lib/types";

const DAY = 1000 * 60 * 60 * 24;
const now = new Date("2026-08-28T12:00:00Z").getTime();
export const daysAgo = (n: number) => new Date(now - n * DAY).toISOString();

export interface CustomerSeed {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdDaysAgo: number;
  address: Address;
  notes: string[];
  tags: string[];
}

const cities: Omit<Address, "fullName" | "phone">[] = [
  { line1: "482 Prospect Ave", city: "Brooklyn, NY", country: "United States", postalCode: "11215" },
  { line1: "119 Elm Street", city: "Austin, TX", country: "United States", postalCode: "78701" },
  { line1: "27 Kensington Rd", city: "London", country: "United Kingdom", postalCode: "W8 5NP" },
  { line1: "88 Rue de Rivoli", city: "Paris", country: "France", postalCode: "75004" },
  { line1: "1500 Pine St", city: "Seattle, WA", country: "United States", postalCode: "98101" },
  { line1: "44 King St W", city: "Toronto, ON", country: "Canada", postalCode: "M5H 1J1" },
  { line1: "912 Ocean Dr", city: "Miami, FL", country: "United States", postalCode: "33139" },
  { line1: "6 Chapel Market", city: "London", country: "United Kingdom", postalCode: "N1 9EZ" },
  { line1: "310 Federal St", city: "Boston, MA", country: "United States", postalCode: "02110" },
  { line1: "77 York St", city: "Sydney", country: "Australia", postalCode: "2000" },
  { line1: "245 5th Ave", city: "New York, NY", country: "United States", postalCode: "10016" },
  { line1: "18 Rue Montorgueil", city: "Paris", country: "France", postalCode: "75001" },
  { line1: "630 SW 5th Ave", city: "Portland, OR", country: "United States", postalCode: "97204" },
  { line1: "9 Grafton St", city: "Dublin", country: "Ireland", postalCode: "D02 F892" },
  { line1: "1122 2nd Ave", city: "Seattle, WA", country: "United States", postalCode: "98101" },
  { line1: "56 Neal St", city: "London", country: "United Kingdom", postalCode: "WC2H 9PA" },
  { line1: "3400 Peachtree Rd", city: "Atlanta, GA", country: "United States", postalCode: "30326" },
  { line1: "200 Bay St", city: "San Francisco, CA", country: "United States", postalCode: "94133" },
  { line1: "12 Rundle Mall", city: "Adelaide", country: "Australia", postalCode: "5000" },
  { line1: "701 Brazos St", city: "Austin, TX", country: "United States", postalCode: "78701" },
  { line1: "88 Wellington St", city: "Auckland", country: "New Zealand", postalCode: "1010" },
  { line1: "1440 Larimer St", city: "Denver, CO", country: "United States", postalCode: "80202" },
];

const names = [
  "Maren Kessler", "Julian Park", "Sofia Reyes", "Devon Lockhart", "Priya Nair",
  "Elias Thornton", "Camille Bertrand", "Noah Fischer", "Amara Okafor", "Theo Sandoval",
  "Isla Mercer", "Rowan Delgado", "Yusuf Aydın", "Greta Wallenberg", "Malik Hassan",
  "Lena Vasquez", "Oskar Lindqvist", "Nadia Farouk", "Colton Briggs", "Freya Nystrom",
  "Marcus Chen", "Delphine Moreau",
];

export const customerSeeds: CustomerSeed[] = names.map((name, i) => {
  const [first, last] = name.split(" ");
  const city = cities[i % cities.length];
  return {
    id: `cust-${i + 1}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${["gmail.com", "outlook.com", "icloud.com", "proton.me"][i % 4]}`,
    phone: `+1 555 01${(10 + i).toString().padStart(2, "0")}`,
    createdDaysAgo: 30 + i * 14 + (i % 3) * 9,
    address: { ...city, fullName: name, phone: `+1 555 01${(10 + i).toString().padStart(2, "0")}` },
    notes: i % 5 === 0 ? ["Prefers signature-required delivery."] : i % 7 === 0 ? ["Reached out about a delayed shipment in the past — resolved."] : [],
    tags: i % 6 === 0 ? ["wholesale-inquiry"] : [],
  };
});
