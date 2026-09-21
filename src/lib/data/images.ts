/**
 * Placeholder photography for Tuana. Every ID below was downloaded and
 * visually checked: generic, unbranded skincare / makeup / jewelry imagery,
 * no third-party logos. Do not add IDs without doing the same.
 *
 * Everything visible on the site can be replaced from the dashboard
 * (Content, Categories, Products) — by upload, by pasting a URL, or by
 * picking one of the presets below — so these are only the starting point.
 */
export function img(id: string, w = 1200, h?: number) {
  const params = new URLSearchParams({ q: "80", w: String(w), auto: "format", fit: "crop" });
  if (h) params.set("h", String(h));
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`;
}

export const IMG = {
  amberDropper: "1608571423902-eed4a5ad8108",
  dropperEucalyptus: "1617897903246-719242758050",
  spaDiffuser: "1620733723572-11c53f73a416",
  guaSha: "1600428877878-1a0fd85beda8",
  clayMask: "1596755389378-c31d21fd1273",
  bathFlatlay: "1590439471364-192aa70c0b53",
  facialTreatment: "1552693673-1bf958298935",
  facialMask: "1616394584738-fc6e612e71b9",
  bedroom: "1571508601891-ca5e7a713859",
  whiteInterior: "1519710164239-da123dc03ef4",
  homeShelf: "1524634126442-357e0eac3c14",
  nudeLipstick: "1625093742435-6fa192b6fb10",
  roseGoldMakeup: "1596462502278-27bfdc403348",
  nailPolishRow: "1512207046665-7592bb0ce5e6",
  nailPolishScatter: "1512207643973-fef70e8cb699",
  brushSetPouch: "1654763837435-66a8bce43aff",
  eyeshadowMauve: "1548954638-082b560e0a66",
  eyeshadowHand: "1596704017254-9b121068fb31",
  ringsDish: "1561828995-aa79a2db86dd",
  ringsLeaves: "1620135104013-1abdff4b1ca7",
  goldHoop: "1680968921717-4abbbe793bb3",
  earringsHeels: "1549439602-43ebca2327af",
  silverWatch: "1534277448999-989742a033af",
  watchWrist: "1524592094714-0f0654e20314",
  kraftTote: "1544816155-12df9643f363",
  floralHeels: "1543163521-1bf539c55dd2",
} as const;

/** Presets offered in the dashboard image picker. */
export const PRESET_IMAGES: { label: string; id: string }[] = [
  { label: "Serum bottle, palm shadow", id: IMG.amberDropper },
  { label: "Dropper & eucalyptus", id: IMG.dropperEucalyptus },
  { label: "Gua sha & roller", id: IMG.guaSha },
  { label: "Clay mask", id: IMG.clayMask },
  { label: "Facial treatment", id: IMG.facialTreatment },
  { label: "Facial mask", id: IMG.facialMask },
  { label: "Bath flatlay", id: IMG.bathFlatlay },
  { label: "Spa diffuser", id: IMG.spaDiffuser },
  { label: "Nude lipstick", id: IMG.nudeLipstick },
  { label: "Rose-gold makeup set", id: IMG.roseGoldMakeup },
  { label: "Nail polish row", id: IMG.nailPolishRow },
  { label: "Nail polish scatter", id: IMG.nailPolishScatter },
  { label: "Brush set & pouch", id: IMG.brushSetPouch },
  { label: "Mauve eyeshadow", id: IMG.eyeshadowMauve },
  { label: "Eyeshadow palette", id: IMG.eyeshadowHand },
  { label: "Rings on dish", id: IMG.ringsDish },
  { label: "Stacking rings", id: IMG.ringsLeaves },
  { label: "Gold hoop earring", id: IMG.goldHoop },
  { label: "Earrings & heels", id: IMG.earringsHeels },
  { label: "Silver watch", id: IMG.silverWatch },
  { label: "Minimal watch", id: IMG.watchWrist },
  { label: "Tote bag", id: IMG.kraftTote },
  { label: "Floral heels", id: IMG.floralHeels },
  { label: "Bedroom", id: IMG.bedroom },
  { label: "White interior", id: IMG.whiteInterior },
  { label: "Styled shelf", id: IMG.homeShelf },
];
