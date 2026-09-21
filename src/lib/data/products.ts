import type { Product, ProductImage, ProductReview, ProductVariant, ProductOption } from "@/lib/types";
import { img, IMG } from "./images";
import { slugify } from "@/lib/utils";

const DAY = 1000 * 60 * 60 * 24;
const now = new Date("2026-08-28T12:00:00Z").getTime();
const daysAgo = (n: number) => new Date(now - n * DAY).toISOString();

const REVIEW_AUTHORS = [
  "Maren K.", "Julian P.", "Sofia R.", "Devon L.", "Priya N.", "Elias T.",
  "Camille B.", "Noah F.", "Amara O.", "Theo S.", "Isla M.", "Rowan D.",
  "Yusuf A.", "Greta W.", "Malik H.", "Lena V.",
];

const REVIEW_TEMPLATES: { title: string; body: string; rating: 3 | 4 | 5 }[] = [
  { title: "Even better in person", rating: 5, body: "I'm careful about adding new things to my routine but this earned its spot right away. The quality is really there." },
  { title: "Exactly what I wanted", rating: 5, body: "I compared this against three other options before ordering and I'm glad I waited. It's already part of my everyday." },
  { title: "Great quality, minor wait", rating: 4, body: "Shipping took a few days longer than expected, but the quality when it arrived made up for it. Would order again." },
  { title: "Gentle and consistent", rating: 4, body: "No irritation, no fuss — just does its job quietly every day. That's rare for me." },
  { title: "Gifted it twice already", rating: 5, body: "Bought one for myself first, ended up ordering two more as gifts. Everyone's asked where it's from." },
  { title: "Good, not perfect", rating: 3, body: "It's nice, but I expected a bit more for the price. Still get plenty of use out of it." },
  { title: "Understated and well made", rating: 5, body: "This is the kind of thing that just quietly does its job well. No complaints after several weeks of daily use." },
];

function reviewsFor(productId: string, count: number, seed: number): ProductReview[] {
  const list: ProductReview[] = [];
  for (let i = 0; i < count; i++) {
    const t = REVIEW_TEMPLATES[(seed + i * 3) % REVIEW_TEMPLATES.length];
    list.push({
      id: `${productId}-rev-${i + 1}`,
      author: REVIEW_AUTHORS[(seed + i * 5) % REVIEW_AUTHORS.length],
      rating: t.rating,
      title: t.title,
      body: t.body,
      date: daysAgo(10 + seed * 4 + i * 17),
      verified: (seed + i) % 4 !== 0,
    });
  }
  return list;
}

interface RawProduct {
  title: string;
  category: string;
  short: string;
  description: string;
  bullets: string[];
  price: number;
  compareAt?: number;
  photo: string;
  options?: ProductOption[];
  variantInventory?: number[];
  flags?: { featured?: boolean; bestSeller?: boolean; newArrival?: boolean };
  createdDaysAgo: number;
  reviewCount: number;
}

const SHADES_FACE = ["Fair", "Light", "Medium", "Deep"];
const SHADES_LIP = ["Rose Nude", "Berry", "Coral", "Classic Red"];

const RAW: RawProduct[] = [
  // ── Skincare ────────────────────────────────────────────────
  { title: "Oat Milk Cream Cleanser", category: "skincare", short: "A creamy, non-foaming cleanser that never leaves skin tight.", description: "Colloidal oat milk and glycerin lift away makeup, SPF, and the day without disturbing the skin barrier. No foam, no squeak — just clean, comfortable skin.", bullets: ["Colloidal oat milk + glycerin", "Fragrance-free", "pH-balanced", "150ml"], price: 28, photo: IMG.bathFlatlay, createdDaysAgo: 60, reviewCount: 6, flags: { bestSeller: true } },
  { title: "Rosewater Micellar Water", category: "skincare", short: "A no-rinse micellar water that lifts makeup without stripping.", description: "Micelles in a rosewater base dissolve makeup and sunscreen on contact — no rinsing required. Gentle enough for the eye area.", bullets: ["No-rinse", "Rosewater base", "Safe for eye area", "200ml"], price: 24, photo: IMG.dropperEucalyptus, createdDaysAgo: 95, reviewCount: 4 },
  { title: "Jojoba Cleansing Balm", category: "skincare", short: "A solid-to-oil balm that melts away makeup and SPF.", description: "A jojoba and shea base that melts on contact with warm hands, dissolving even long-wear makeup. Emulsifies with water for a clean, non-greasy rinse.", bullets: ["Jojoba + shea base", "Dissolves waterproof makeup", "100g"], price: 32, photo: IMG.homeShelf, createdDaysAgo: 140, reviewCount: 5 },
  { title: "Vitamin C Brightening Serum", category: "skincare", short: "A 15% vitamin C serum for a brighter, more even tone.", description: "A stabilized 15% vitamin C blend with ferulic acid and vitamin E, formulated to resist oxidation so the bottle stays effective to the last drop.", bullets: ["15% stabilized vitamin C", "Ferulic acid + vitamin E", "Use AM under SPF"], price: 48, compareAt: 60, photo: IMG.amberDropper, options: [{ name: "Size", values: ["30ml", "50ml"] }], variantInventory: [22, 10], createdDaysAgo: 50, reviewCount: 8, flags: { featured: true, bestSeller: true } },
  { title: "Hyaluronic Acid Serum", category: "skincare", short: "A multi-weight hyaluronic acid serum for lasting hydration.", description: "Three molecular weights of hyaluronic acid hold water at different depths of the skin. Layers cleanly under moisturizer, morning or night.", bullets: ["Multi-weight hyaluronic acid", "Fragrance-free", "Two sizes"], price: 38, photo: IMG.dropperEucalyptus, options: [{ name: "Size", values: ["15ml", "30ml"] }], variantInventory: [28, 15], createdDaysAgo: 85, reviewCount: 7, flags: { bestSeller: true } },
  { title: "Niacinamide 10% Pore Serum", category: "skincare", short: "A 10% niacinamide serum to refine texture and visible pores.", description: "10% niacinamide with zinc for oilier, congestion-prone skin. A thin, almost weightless texture that layers with vitamin C or retinol.", bullets: ["10% niacinamide + zinc", "Non-greasy", "30ml"], price: 32, photo: IMG.amberDropper, createdDaysAgo: 30, reviewCount: 3, flags: { newArrival: true } },
  { title: "Barrier Repair Day Cream", category: "skincare", short: "A ceramide-rich day cream that supports a healthy barrier.", description: "Five ceramides, cholesterol, and fatty acids in the ratio your skin barrier naturally uses. A cushioned finish under makeup or SPF.", bullets: ["5-ceramide complex", "Fragrance-free", "Two sizes"], price: 42, photo: IMG.facialTreatment, options: [{ name: "Size", values: ["50ml", "100ml"] }], variantInventory: [24, 12], createdDaysAgo: 65, reviewCount: 6 },
  { title: "Overnight Recovery Cream", category: "skincare", short: "A rich night cream for dry and dehydrated skin.", description: "A balm-like cream for the hours skin spends repairing itself. Shea butter and squalane seal in every step underneath.", bullets: ["Shea butter + squalane", "PM use", "50ml"], price: 46, photo: IMG.bedroom, createdDaysAgo: 120, reviewCount: 5 },
  { title: "Broad Spectrum SPF 50 Fluid", category: "skincare", short: "A weightless, no-white-cast daily sunscreen.", description: "A fluid-texture SPF 50 that sits invisibly under makeup on every skin tone. If you only buy one skincare step, make it this one.", bullets: ["Broad spectrum SPF 50", "No white cast", "50ml"], price: 36, photo: IMG.spaDiffuser, createdDaysAgo: 55, reviewCount: 9, flags: { bestSeller: true } },
  { title: "Pink Clay Detox Mask", category: "skincare", short: "A gentle pink clay mask that clears congestion without over-drying.", description: "French pink clay, milder than kaolin or bentonite. Ten minutes, twice a week is plenty.", bullets: ["French pink clay", "Use 1–2x weekly", "75ml"], price: 30, photo: IMG.clayMask, createdDaysAgo: 70, reviewCount: 5 },
  { title: "Hydrating Sheet Mask Set", category: "skincare", short: "Five hyaluronic acid sheet masks for an instant boost.", description: "Five individually packed cotton sheet masks soaked in hyaluronic acid and centella — the fifteen-minute reset before an event, or just a Sunday.", bullets: ["Set of 5", "Hyaluronic acid + centella", "15-minute treatment"], price: 26, photo: IMG.facialMask, createdDaysAgo: 33, reviewCount: 3 },

  // ── Makeup ──────────────────────────────────────────────────
  { title: "Skin Tint Serum Foundation", category: "makeup", short: "A sheer, skin-like tint with serum-level hydration.", description: "Buildable, lightweight coverage that evens tone and lets real skin show through. Hyaluronic acid and vitamin E keep it comfortable all day.", bullets: ["Sheer to medium, buildable", "Hyaluronic acid + vitamin E", "30ml", "4 shades"], price: 34, photo: IMG.roseGoldMakeup, options: [{ name: "Shade", values: SHADES_FACE }], variantInventory: [14, 20, 22, 9], createdDaysAgo: 40, reviewCount: 8, flags: { featured: true, bestSeller: true } },
  { title: "Soft Cream Blush", category: "makeup", short: "A melt-in-skin cream blush for a natural flush.", description: "A creamy, blendable blush that melts into skin and can be layered from a whisper to a full flush. Works with fingers or a brush.", bullets: ["Blendable cream texture", "Buildable color", "Vegan"], price: 24, photo: IMG.roseGoldMakeup, options: [{ name: "Shade", values: ["Peach", "Rose", "Berry"] }], variantInventory: [18, 24, 11], createdDaysAgo: 22, reviewCount: 5, flags: { newArrival: true } },
  { title: "Glow Highlighting Drops", category: "makeup", short: "Liquid glow to mix into foundation or tap on cheekbones.", description: "Pearlescent, non-glittery drops that give skin a lit-from-within finish. Wear alone, mix into moisturizer, or tap on high points.", bullets: ["Liquid, non-glitter", "Mix or layer", "20ml"], price: 28, photo: IMG.roseGoldMakeup, createdDaysAgo: 75, reviewCount: 4 },
  { title: "Velvet Setting Powder", category: "makeup", short: "A translucent powder that sets makeup without flattening it.", description: "A finely milled, translucent powder that softens shine and locks in makeup while leaving a natural finish.", bullets: ["Translucent, fits all tones", "Finely milled", "Talc-free"], price: 30, photo: IMG.brushSetPouch, createdDaysAgo: 110, reviewCount: 3 },
  { title: "Mauve Dream Eyeshadow Palette", category: "makeup", short: "Twelve wearable mauves, roses, and browns in matte and shimmer.", description: "Twelve shades built around soft mauves and warm neutrals, in matte and pearl finishes that blend easily and stay put.", bullets: ["12 shades, matte + shimmer", "Highly pigmented", "Vegan"], price: 38, compareAt: 46, photo: IMG.eyeshadowMauve, createdDaysAgo: 28, reviewCount: 7, flags: { featured: true, newArrival: true } },
  { title: "Lash Lift Volumizing Mascara", category: "makeup", short: "Lifted, separated lashes that don't clump or smudge.", description: "A flexible brush and a lightweight, buildable formula for volume and length without flaking. Removes with warm water.", bullets: ["Volume + lift", "Smudge-resistant", "Ophthalmologist tested"], price: 22, photo: IMG.eyeshadowHand, createdDaysAgo: 80, reviewCount: 6, flags: { bestSeller: true } },
  { title: "Brow Sculpt Gel Pencil", category: "makeup", short: "A micro-tip pencil and clear gel in one slim tool.", description: "Draw hair-like strokes with the micro-tip, then brush through with the built-in gel spoolie to set.", bullets: ["Micro-tip + brow gel", "Smudge-resistant", "3 shades"], price: 20, photo: IMG.eyeshadowHand, createdDaysAgo: 100, reviewCount: 3 },
  { title: "Velvet Matte Lipstick", category: "makeup", short: "A comfortable, weightless matte in soft, wearable shades.", description: "A cushiony matte that doesn't dry the lips. Rich pigment in one swipe, with a soft-focus velvet finish.", bullets: ["Comfortable matte", "Rich one-swipe color", "Vegan"], price: 22, photo: IMG.nudeLipstick, options: [{ name: "Shade", values: SHADES_LIP }], variantInventory: [26, 18, 20, 12], createdDaysAgo: 46, reviewCount: 9, flags: { featured: true, bestSeller: true } },
  { title: "Juicy Lip Oil", category: "makeup", short: "A glossy, non-sticky lip oil that conditions as it shines.", description: "A lightweight oil blend with a sheer wash of color and high shine, without the stickiness of a traditional gloss.", bullets: ["Non-sticky shine", "Conditioning oils", "Sheer tint"], price: 18, photo: IMG.nudeLipstick, createdDaysAgo: 18, reviewCount: 4, flags: { newArrival: true } },
  { title: "Soft Focus Lip Liner", category: "makeup", short: "A creamy liner that defines without feathering.", description: "A long-wear creamy liner that glides on, defines the lip line, and doubles as a full-lip base for staying power.", bullets: ["Creamy, long-wear", "Twist-up, no sharpening", "4 shades"], price: 16, photo: IMG.nudeLipstick, createdDaysAgo: 130, reviewCount: 3 },
  { title: "Nail Lacquer Trio", category: "makeup", short: "Three chip-resistant polishes in a coordinated soft palette.", description: "Three high-shine, quick-drying lacquers chosen to layer and mix — a manicure in soft neutrals that lasts.", bullets: ["Set of 3, 10ml each", "Chip-resistant", "10-free formula"], price: 26, photo: IMG.nailPolishRow, createdDaysAgo: 24, reviewCount: 4 },

  // ── Accessories ─────────────────────────────────────────────
  { title: "Everyday Gold Hoops", category: "accessories", short: "Lightweight hoops in 18k gold plating, made for daily wear.", description: "A comfortable, hollow-tube hoop that catches light without the weight. Tarnish-resistant plating over hypoallergenic surgical steel.", bullets: ["18k gold plated", "Hypoallergenic steel post", "Lightweight hollow tube"], price: 32, photo: IMG.goldHoop, options: [{ name: "Finish", values: ["Gold", "Silver"] }], variantInventory: [30, 22], createdDaysAgo: 35, reviewCount: 8, flags: { featured: true, bestSeller: true } },
  { title: "Stacking Ring Set", category: "accessories", short: "Four slim rings designed to be mixed, stacked, and swapped.", description: "Four delicate bands — smooth, beaded, twisted, and plain — that look considered alone and effortless together.", bullets: ["Set of 4", "Tarnish-resistant plating", "Waterproof finish"], price: 36, compareAt: 44, photo: IMG.ringsLeaves, options: [{ name: "Size", values: ["5–6", "7–8"] }], variantInventory: [20, 16], createdDaysAgo: 52, reviewCount: 6 },
  { title: "Textured Statement Earrings", category: "accessories", short: "Sculptural drop earrings that make a simple outfit finished.", description: "Textured, lightweight drops in a warm gold finish. Big presence, small weight — comfortable from morning to night.", bullets: ["Lightweight", "Gold finish", "Hypoallergenic posts"], price: 30, photo: IMG.earringsHeels, createdDaysAgo: 16, reviewCount: 3, flags: { newArrival: true } },
  { title: "Minimal Link Watch", category: "accessories", short: "A slim, silver-tone watch with a link bracelet.", description: "A quiet, classic watch with a clean dial and an adjustable link bracelet that sits comfortably alone or stacked.", bullets: ["Stainless case", "Adjustable link bracelet", "Water-resistant (3 ATM)"], price: 68, photo: IMG.silverWatch, createdDaysAgo: 88, reviewCount: 5 },
  { title: "Everyday Canvas Tote", category: "accessories", short: "A roomy canvas tote for work, weekends, and everything between.", description: "A structured natural canvas tote with reinforced handles and an inside zip pocket. Holds a laptop, a lunch, and your whole routine.", bullets: ["Heavyweight cotton canvas", "Inside zip pocket", "Fits a 14\" laptop"], price: 44, photo: IMG.kraftTote, createdDaysAgo: 62, reviewCount: 4 },
  { title: "Cosmetic Pouch", category: "accessories", short: "A wipe-clean pouch that keeps the whole routine together.", description: "A roomy, wipe-clean lined pouch with a smooth zip, sized to hold a full makeup edit and a few skincare minis.", bullets: ["Wipe-clean lining", "Smooth YKK-style zip", "Fits a full makeup edit"], price: 24, photo: IMG.brushSetPouch, options: [{ name: "Color", values: ["Cream", "Cocoa"] }], variantInventory: [28, 21], createdDaysAgo: 44, reviewCount: 5, flags: { bestSeller: true } },
  { title: "Silk Scrunchie Set", category: "accessories", short: "Three gentle silk-feel scrunchies that don't pull or crease.", description: "Soft satin scrunchies that hold hair without tugging or leaving a crease. A set of three in a coordinated palette.", bullets: ["Set of 3", "Gentle, no-crease hold", "Machine washable"], price: 18, photo: IMG.roseGoldMakeup, options: [{ name: "Color", values: ["Blush", "Sage", "Cocoa"] }], variantInventory: [30, 24, 26], createdDaysAgo: 26, reviewCount: 6, flags: { newArrival: true } },
  { title: "Pearl Hair Clip Set", category: "accessories", short: "Six pearl-detail clips for quick, polished updos.", description: "Six slim clips with faux-pearl detail to finish a half-up, hold a fringe, or add a little polish to a low bun.", bullets: ["Set of 6", "Strong, slim clip", "Faux-pearl detail"], price: 16, photo: IMG.ringsDish, createdDaysAgo: 38, reviewCount: 3 },
  { title: "Rose Quartz Gua Sha", category: "accessories", short: "A hand-carved rose quartz tool for facial massage and sculpting.", description: "Hand-carved from genuine rose quartz and weighted for a slow, deliberate massage along the jaw and cheekbones. Best with a facial oil.", bullets: ["Genuine rose quartz", "Includes how-to card"], price: 28, photo: IMG.guaSha, createdDaysAgo: 45, reviewCount: 6, flags: { bestSeller: true } },
  { title: "Fluffy Makeup Brush Set", category: "accessories", short: "Fifteen soft brushes and a pouch for every step of your face.", description: "Fifteen ultra-soft, dense brushes for face, cheek, and eye — with a matching travel pouch. Cruelty-free synthetic bristles.", bullets: ["15 brushes + pouch", "Synthetic, cruelty-free bristles", "Easy to clean"], price: 42, compareAt: 52, photo: IMG.brushSetPouch, createdDaysAgo: 58, reviewCount: 7, flags: { featured: true } },
];

function buildVariants(productId: string, basePrice: number, compareAt: number | undefined, options: ProductOption[] | undefined, inventory: number[] | undefined): ProductVariant[] {
  if (!options || options.length === 0) {
    return [{ id: `${productId}-default`, sku: `${productId.toUpperCase()}-DEF`, title: "Default", optionValues: {}, price: basePrice, compareAtPrice: compareAt, inventory: 24 }];
  }

  let combos: Record<string, string>[] = [{}];
  for (const opt of options) {
    const next: Record<string, string>[] = [];
    for (const combo of combos) for (const value of opt.values) next.push({ ...combo, [opt.name]: value });
    combos = next;
  }

  return combos.map((combo, i) => ({
    id: `${productId}-v${i + 1}`,
    sku: `${productId.toUpperCase()}-${i + 1}`,
    title: Object.values(combo).join(" / "),
    optionValues: combo,
    price: basePrice,
    compareAtPrice: compareAt,
    inventory: inventory ? inventory[i % inventory.length] : 15,
  }));
}

function buildImages(productId: string, photo: string): ProductImage[] {
  return [{ id: `${productId}-img-1`, url: img(photo, 1400, 1750), alt: "" }];
}

/** Seed prices were written in USD; the store sells in EGP (~50 EGP per USD, rounded to 10). */
const egp = (usd: number) => Math.round((usd * 50) / 10) * 10;

export function seedProducts(): Product[] {
  return RAW.map((source, index) => {
    const raw = { ...source, price: egp(source.price), compareAt: source.compareAt ? egp(source.compareAt) : undefined };
    const id = `prod-${index + 1}`;
    const variants = buildVariants(id, raw.price, raw.compareAt, raw.options, raw.variantInventory);
    const reviews = reviewsFor(id, Math.min(raw.reviewCount, REVIEW_TEMPLATES.length + 1), index);
    const rating = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 4.5;

    return {
      id,
      slug: slugify(raw.title),
      title: raw.title,
      brand: "Tuana",
      categoryIds: [`cat-${raw.category}`],
      shortDescription: raw.short,
      description: raw.description,
      bullets: raw.bullets,
      images: buildImages(id, raw.photo),
      options: raw.options ?? [],
      variants,
      price: raw.price,
      compareAtPrice: raw.compareAt,
      currency: "EGP",
      rating,
      reviewCount: raw.reviewCount,
      reviews,
      tags: [raw.category, ...(raw.flags?.bestSeller ? ["bestseller"] : []), ...(raw.flags?.newArrival ? ["new"] : [])],
      status: "active",
      featured: raw.flags?.featured ?? false,
      bestSeller: raw.flags?.bestSeller ?? false,
      newArrival: raw.flags?.newArrival ?? raw.createdDaysAgo <= 21,
      totalInventory: variants.reduce((sum, v) => sum + v.inventory, 0),
      source: { supplier: "internal", syncStatus: "not_synced" },
      shipping: { freeShipping: raw.price >= 3000, estimatedDaysMin: 3, estimatedDaysMax: 7 },
      createdAt: daysAgo(raw.createdDaysAgo),
      updatedAt: daysAgo(Math.min(raw.createdDaysAgo, 4)),
    } satisfies Product;
  });
}

export interface ProductInput {
  title: string;
  brand: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  imageUrl: string;
  extraImageUrls?: string[];
  status: Product["status"];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}
