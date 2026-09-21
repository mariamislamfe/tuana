import type { SiteContent } from "./types";

/**
 * Describes every editable field so the dashboard editor is generated from
 * data. Add a field to `types.ts` + `defaults.ts`, then list it here and it
 * appears in Dashboard → Content — no new UI code.
 */
export type FieldSpec =
  | { kind: "text" | "textarea" | "image" | "video" | "toggle"; key: string; label: string; help?: string }
  | { kind: "group"; key: string; label: string; fields: FieldSpec[] }
  | { kind: "list"; key: string; label: string; itemTitle: string; fields: FieldSpec[] };

export interface SectionSpec {
  key: keyof SiteContent;
  title: string;
  description?: string;
  fields: FieldSpec[];
}

export interface TabSpec {
  id: string;
  label: string;
  sections: SectionSpec[];
}

const link = (key: string, label: string): FieldSpec => ({
  kind: "group",
  key,
  label,
  fields: [
    { kind: "text", key: "label", label: "Button text" },
    { kind: "text", key: "href", label: "Link (e.g. /shop)" },
  ],
});

const faqFields: FieldSpec[] = [
  { kind: "text", key: "heading", label: "Page heading" },
  {
    kind: "list",
    key: "items",
    label: "Questions",
    itemTitle: "Question",
    fields: [
      { kind: "text", key: "q", label: "Question" },
      { kind: "textarea", key: "a", label: "Answer" },
    ],
  },
];

const legalFields: FieldSpec[] = [
  { kind: "text", key: "heading", label: "Page heading" },
  { kind: "text", key: "updated", label: "“Last updated” line" },
  {
    kind: "list",
    key: "sections",
    label: "Sections",
    itemTitle: "Section",
    fields: [
      { kind: "text", key: "title", label: "Title" },
      { kind: "textarea", key: "body", label: "Text" },
    ],
  },
];

export const CONTENT_TABS: TabSpec[] = [
  {
    id: "home",
    label: "Home page",
    sections: [
      {
        key: "home",
        title: "Home page",
        description: "Everything on the front page, top to bottom.",
        fields: [
          {
            kind: "group",
            key: "hero",
            label: "Hero (top banner)",
            fields: [
              { kind: "video", key: "video", label: "Hero video (optional)", help: "MP4 or WebM, ideally under 15MB. When set, it plays silently in a loop behind the headline instead of the slideshow." },
              { kind: "image", key: "image", label: "Hero image", help: "Wide image — first slide, and the poster while a video loads." },
              {
                kind: "list",
                key: "slides",
                label: "More slideshow images",
                itemTitle: "Slide",
                fields: [{ kind: "image", key: "image", label: "Image" }],
              },
              { kind: "text", key: "eyebrow", label: "Small line above headline" },
              { kind: "text", key: "headline", label: "Headline" },
              { kind: "textarea", key: "subtext", label: "Supporting text" },
              link("primaryCta", "Main button"),
              link("secondaryCta", "Second button"),
            ],
          },
          {
            kind: "group",
            key: "reel",
            label: "Video section (“In motion”)",
            fields: [
              { kind: "toggle", key: "enabled", label: "Show this section" },
              { kind: "video", key: "video", label: "Video", help: "MP4 or WebM. Leave empty to show an animated image collage instead." },
              { kind: "image", key: "poster", label: "Cover image (optional)", help: "Shown while the video loads." },
              { kind: "text", key: "eyebrow", label: "Small line" },
              { kind: "text", key: "heading", label: "Heading" },
              { kind: "textarea", key: "body", label: "Text" },
              link("button", "Button"),
            ],
          },
          {
            kind: "group",
            key: "marquee",
            label: "Scrolling ticker",
            fields: [
              {
                kind: "list",
                key: "items",
                label: "Messages",
                itemTitle: "Message",
                fields: [{ kind: "text", key: "text", label: "Message" }],
              },
            ],
          },
          {
            kind: "list",
            key: "valueProps",
            label: "Highlights strip (shipping, returns…)",
            itemTitle: "Highlight",
            fields: [
              { kind: "text", key: "title", label: "Title" },
              { kind: "text", key: "body", label: "Sub-line" },
            ],
          },
          {
            kind: "group",
            key: "categories",
            label: "“Shop by category” heading",
            fields: [
              { kind: "text", key: "eyebrow", label: "Small line" },
              { kind: "text", key: "heading", label: "Heading" },
            ],
          },
          {
            kind: "group",
            key: "bestSellers",
            label: "Best sellers heading",
            fields: [
              { kind: "text", key: "eyebrow", label: "Small line" },
              { kind: "text", key: "heading", label: "Heading" },
            ],
          },
          {
            kind: "group",
            key: "editorial",
            label: "Story banner (image + text)",
            fields: [
              { kind: "image", key: "image", label: "Image" },
              { kind: "text", key: "eyebrow", label: "Small line" },
              { kind: "text", key: "heading", label: "Heading" },
              { kind: "textarea", key: "body", label: "Text" },
              link("button", "Button"),
            ],
          },
          {
            kind: "group",
            key: "newArrivals",
            label: "New arrivals heading",
            fields: [
              { kind: "text", key: "eyebrow", label: "Small line" },
              { kind: "text", key: "heading", label: "Heading" },
            ],
          },
          {
            kind: "group",
            key: "newsletter",
            label: "Newsletter signup",
            fields: [
              { kind: "text", key: "eyebrow", label: "Small line" },
              { kind: "text", key: "heading", label: "Heading" },
              { kind: "textarea", key: "body", label: "Text" },
              { kind: "text", key: "buttonLabel", label: "Button text" },
              { kind: "text", key: "successTitle", label: "Thank-you title" },
              { kind: "text", key: "successBody", label: "Thank-you message" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "site",
    label: "Header, footer & SEO",
    sections: [
      {
        key: "brand",
        title: "Brand",
        fields: [
          { kind: "text", key: "name", label: "Store name", help: "Shown in the header, footer and browser tab." },
          { kind: "text", key: "tagline", label: "Tagline" },
          { kind: "image", key: "mark", label: "Header logo (emblem)", help: "Small, roughly square — shown next to the store name in the header." },
          { kind: "image", key: "logo", label: "Full logo", help: "Shown in the footer and on the sign-in pages." },
        ],
      },
      {
        key: "announcement",
        title: "Announcement bar",
        description: "The thin bar above the header.",
        fields: [
          { kind: "toggle", key: "enabled", label: "Show the bar" },
          { kind: "text", key: "text", label: "Message" },
          { kind: "text", key: "href", label: "Link (optional)" },
        ],
      },
      {
        key: "nav",
        title: "Menu",
        fields: [
          { kind: "text", key: "categoriesLabel", label: "Categories dropdown label" },
          {
            kind: "list",
            key: "links",
            label: "Menu links",
            itemTitle: "Link",
            fields: [
              { kind: "text", key: "label", label: "Label" },
              { kind: "text", key: "href", label: "Link" },
            ],
          },
        ],
      },
      {
        key: "footer",
        title: "Footer",
        fields: [
          { kind: "textarea", key: "description", label: "Short description" },
          { kind: "text", key: "companyName", label: "Company name (copyright line)" },
        ],
      },
      {
        key: "seo",
        title: "Search engines (SEO)",
        fields: [
          { kind: "text", key: "title", label: "Site title" },
          { kind: "textarea", key: "description", label: "Site description" },
        ],
      },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    sections: [
      {
        key: "about",
        title: "About page",
        fields: [
          { kind: "image", key: "image", label: "Image" },
          { kind: "text", key: "eyebrow", label: "Small line" },
          { kind: "text", key: "heading", label: "Heading" },
          { kind: "list", key: "paragraphs", label: "Paragraphs", itemTitle: "Paragraph", fields: [{ kind: "textarea", key: "text", label: "Text" }] },
        ],
      },
      { key: "shipping", title: "Shipping page", fields: faqFields },
      { key: "returns", title: "Returns page", fields: faqFields },
      {
        key: "contact",
        title: "Contact page",
        fields: [
          { kind: "text", key: "heading", label: "Heading" },
          { kind: "textarea", key: "intro", label: "Intro text" },
          { kind: "text", key: "email", label: "Support email" },
          { kind: "text", key: "hours", label: "Opening hours line" },
        ],
      },
      {
        key: "productPage",
        title: "Product pages",
        description: "Shared text shown on every product.",
        fields: [
          { kind: "text", key: "shippingLine", label: "Shipping line (next to the truck icon)" },
          { kind: "text", key: "returnsLine", label: "Returns line (next to the return icon)" },
          { kind: "textarea", key: "shippingNote", label: "“Shipping” accordion — extra text" },
          { kind: "textarea", key: "returnsNote", label: "“Returns” accordion text" },
        ],
      },
      { key: "privacy", title: "Privacy policy", fields: legalFields },
      { key: "terms", title: "Terms of service", fields: legalFields },
    ],
  },
];
