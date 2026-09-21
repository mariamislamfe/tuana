export interface ContentLink {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: { name: string; tagline: string; logo: string; mark: string };
  announcement: { enabled: boolean; text: string; href: string };
  nav: { categoriesLabel: string; links: ContentLink[] };
  home: {
    hero: {
      eyebrow: string;
      headline: string;
      subtext: string;
      image: string;
      /** Optional background video (mp4/webm). When set it replaces the slideshow. */
      video: string;
      /** Extra images that fade in after `image` when there is no video. */
      slides: { image: string }[];
      primaryCta: ContentLink;
      secondaryCta: ContentLink;
    };
    marquee: { items: { text: string }[] };
    reel: { enabled: boolean; eyebrow: string; heading: string; body: string; video: string; poster: string; button: ContentLink };
    valueProps: { title: string; body: string }[];
    categories: { eyebrow: string; heading: string };
    bestSellers: { eyebrow: string; heading: string };
    editorial: { eyebrow: string; heading: string; body: string; image: string; button: ContentLink };
    newArrivals: { eyebrow: string; heading: string };
    newsletter: {
      eyebrow: string;
      heading: string;
      body: string;
      buttonLabel: string;
      successTitle: string;
      successBody: string;
    };
  };
  footer: { description: string; companyName: string };
  productPage: { shippingNote: string; returnsNote: string; shippingLine: string; returnsLine: string };
  about: { eyebrow: string; heading: string; paragraphs: { text: string }[]; image: string };
  shipping: { heading: string; items: { q: string; a: string }[] };
  returns: { heading: string; items: { q: string; a: string }[] };
  contact: { heading: string; intro: string; email: string; hours: string };
  privacy: { heading: string; updated: string; sections: { title: string; body: string }[] };
  terms: { heading: string; updated: string; sections: { title: string; body: string }[] };
  seo: { title: string; description: string };
}
