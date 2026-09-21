import { img, IMG } from "@/lib/data/images";
import type { SiteContent } from "./types";

export function defaultContent(): SiteContent {
  return {
    brand: { name: "Tuana", tagline: "Beauty, made softly.", logo: "/logo.jpg", mark: "/logo-mark.jpg" },
    announcement: {
      enabled: true,
      text: "Free shipping over EGP 3,000  ·  Use code WELCOME10 for 10% off your first order",
      href: "/shop",
    },
    nav: {
      categoriesLabel: "Categories",
      links: [
        { label: "Shop", href: "/shop" },
        { label: "New Arrivals", href: "/shop?tag=new" },
        { label: "Best Sellers", href: "/shop?tag=bestseller" },
      ],
    },
    home: {
      hero: {
        eyebrow: "Skincare · Makeup · Accessories",
        headline: "Beauty, made softly.",
        subtext:
          "Skincare that works, makeup that feels like skin, and the small accessories that finish the look — one considered edit, made to be used every day.",
        image: img(IMG.amberDropper, 2200, 1500),
        video: "",
        slides: [{ image: img(IMG.roseGoldMakeup, 2200, 1500) }, { image: img(IMG.ringsLeaves, 2200, 1500) }],
        primaryCta: { label: "Shop All", href: "/shop" },
        secondaryCta: { label: "New Arrivals", href: "/shop?tag=new" },
      },
      reel: {
        enabled: true,
        eyebrow: "In motion",
        heading: "Watch it come to life.",
        body: "A few quiet moments from the Tuana routine — textures, rituals and the small details we obsess over.",
        video: "",
        poster: "",
        button: { label: "Shop the Collection", href: "/shop" },
      },
      marquee: {
        items: [
          { text: "Free shipping over EGP 3,000" },
          { text: "Cruelty-free & vegan" },
          { text: "New drops every month" },
          { text: "30-day easy returns" },
        ],
      },
      valueProps: [
        { title: "Free shipping over EGP 3,000", body: "Standard delivery in 3–7 business days." },
        { title: "30-day returns", body: "Unopened items, no questions asked." },
        { title: "Cruelty-free & vegan", body: "Every formula, tested on real skin — never animals." },
      ],
      categories: { eyebrow: "Shop by category", heading: "Find your next favorite." },
      bestSellers: { eyebrow: "Fan favorites", heading: "Best Sellers" },
      editorial: {
        eyebrow: "Our approach",
        heading: "Made for real skin, real routines, real Tuesdays.",
        body: "No trend-chasing ingredient lists and no fifteen-step routines. We formulate in small batches, test for irritation before texture, and edit everything down to what you'll actually reach for.",
        image: img(IMG.facialTreatment, 1400, 1400),
        button: { label: "Read our story", href: "/about" },
      },
      newArrivals: { eyebrow: "Just landed", heading: "New Arrivals" },
      newsletter: {
        eyebrow: "Join the list",
        heading: "Get 10% off your first order.",
        body: "New drops, restocks, and the occasional beauty note. No spam — unsubscribe any time.",
        buttonLabel: "Subscribe",
        successTitle: "You're on the list",
        successBody: "Look out for 10% off your first order.",
      },
    },
    footer: {
      description: "Skincare, makeup, and accessories — formulated simply and made to become part of your day.",
      companyName: "Tuana Beauty Co.",
    },
    productPage: {
      shippingNote: "Tracking is emailed as soon as your order leaves the warehouse.",
      returnsNote:
        "Free returns within 30 days of delivery on unopened items in original packaging. Start a return from your account order history and we'll email a prepaid label.",
      shippingLine: "Arrives in 3–7 business days.",
      returnsLine: "Free 30-day returns on unopened items.",
    },
    about: {
      eyebrow: "Our story",
      heading: "Fewer steps, done properly.",
      paragraphs: [
        {
          text: "Tuana started with a simple frustration: most beauty shelves are either endless or so stripped down they don't do anything. We wanted an edit you'd actually finish — skincare that works, makeup that feels like skin, and accessories that make getting ready a little more fun.",
        },
        {
          text: "Every formula is tested for irritation before we ever talk about texture or shade. We keep the catalog small on purpose — if it doesn't hold up to daily use, it doesn't make the cut.",
        },
        {
          text: "We're a small team and we read every email. If something doesn't work for you, tell us — we'd rather make it right.",
        },
      ],
      image: img(IMG.facialTreatment, 1600, 900),
    },
    shipping: {
      heading: "Shipping",
      items: [
        { q: "How long does shipping take?", a: "Standard shipping arrives in 3–7 business days. Express shipping (1–2 business days) is available at checkout for EGP 150." },
        { q: "Is shipping free?", a: "Orders over EGP 3,000 ship free with standard shipping. Below that, standard shipping is a flat EGP 60." },
        { q: "Do you ship internationally?", a: "We currently ship within the US, Canada, the UK, EU, and Australia. International orders may be subject to customs duties on arrival." },
        { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking link by email. You can also view order status any time from your account." },
      ],
    },
    returns: {
      heading: "Returns",
      items: [
        { q: "What's your return policy?", a: "Unopened items in original packaging can be returned within 30 days of delivery for a full refund." },
        { q: "How do I start a return?", a: "Sign in to your account, open the order from your order history, and start a return. We'll email a prepaid return label." },
        { q: "How long do refunds take?", a: "Refunds are issued to your original payment method within 5–7 business days of us receiving your return." },
        { q: "Can I exchange an item instead?", a: "Yes — note your preferred shade, size, or scent when starting a return and we'll ship the replacement as soon as the original is on its way back to us." },
      ],
    },
    contact: {
      heading: "Contact Us",
      intro: "Questions about an order, a shade, or a product — we read everything ourselves.",
      email: "support@tuana.example.com",
      hours: "Mon–Fri, 9am–6pm ET · usually within one business day",
    },
    privacy: {
      heading: "Privacy Policy",
      updated: "Last updated September 2026",
      sections: [
        { title: "What we collect", body: "When you shop with us, we collect the information needed to fulfill your order: name, email, shipping and billing address, and payment details (processed securely by our payment provider — we never store full card numbers). We also collect basic usage data to keep the site running well." },
        { title: "How we use it", body: "Your information is used to process orders, provide customer support, and — if you opt in — send you occasional product updates. We do not sell your personal information to third parties." },
        { title: "Third parties", body: "We share order information with the carriers who ship it and our payment processor to complete transactions. Each partner is contractually required to handle your data responsibly." },
        { title: "Your choices", body: "You can access, correct, or delete your account information at any time from your account page, or by emailing us. You can unsubscribe from marketing email at any time using the link in any message." },
        { title: "Cookies", body: "We use cookies to keep you signed in, remember your cart, and understand how the site is used so we can improve it. You can disable cookies in your browser, though some features may not work as expected." },
      ],
    },
    terms: {
      heading: "Terms of Service",
      updated: "Last updated September 2026",
      sections: [
        { title: "Orders", body: "By placing an order, you're offering to purchase a product subject to these terms. We reserve the right to refuse or cancel any order — for example, in cases of suspected fraud or pricing errors — and will notify you if this happens." },
        { title: "Pricing", body: "All prices are listed in Egyptian pounds (EGP) and are subject to change without notice. If a product's listed price is incorrect, we'll contact you before shipping." },
        { title: "Shipping & risk of loss", body: "Risk of loss and title for items purchased pass to you upon delivery to the carrier. See our Shipping page for estimated delivery windows." },
        { title: "Returns", body: "Unopened items may be returned within 30 days of delivery per our Returns policy. Final-sale items, if any, will be clearly marked at checkout." },
        { title: "Skin & allergies", body: "Skincare and makeup can affect people differently. Please review ingredients and patch-test new products; stop use and consult a professional if irritation occurs." },
        { title: "Limitation of liability", body: "Tuana is not liable for indirect, incidental, or consequential damages arising from the use of our products or this website, to the extent permitted by law." },
      ],
    },
    seo: {
      title: "Tuana — Skincare, Makeup & Accessories",
      description:
        "Tuana is a beauty brand for skincare, makeup, and accessories — formulated simply, tested honestly, and made to become part of your everyday.",
    },
  };
}
