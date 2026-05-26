/* -----------------------------------------------------------------------------
 * Power Zone — product showcase data
 *
 * Each product drives:
 *   - left reel  (ImageReel) — the generator photo
 *   - right reel (SpecReel)  — the marketing/spec copy
 *   - center card (ProductCard) — title, subtitle, category, year
 *
 * Three colors per product drive the scene:
 *   - leftColor  : deeper brand tone, anchors the generator image
 *   - rightColor : lighter sibling tone, improves readability of the spec copy
 *   - accentColor: mid-tone, tints the center card (sits visually between
 *                  the two panels so the card reads as a distinct object)
 *
 * Copy is sourced from https://powerzone.com.pk/ (`/fpt`, `/perkins`,
 * `/cummins`, `/yuchai`).
 * -------------------------------------------------------------------------- */

export type Product = {
  id: number;
  slug: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  accentColor: string;
  leftColor: string;
  rightColor: string;
  /** Background color for the horizontal-scroll detail panels (the
   * "product description" surface the user slides through after the
   * click choreography). Typically the lightest tone in the product's
   * palette so the description copy reads as black-on-paper. */
  descriptionBgColor: string;
  /** Two additional product images interleaved through the detail
   * panels. For products without two extra photos (e.g. BESS), set
   * these to the main image — the detail layout will detect that and
   * render image-less variants of the affected panels. */
  gallery: [string, string];
  /** Multi-paragraph product story shown in the detail page. Written
   * in our voice, longer than `overview` (which stays a one-paragraph
   * tease for the listing). */
  descriptionLong: string;
  /** Engineering deep-dive paragraph for the detail page — the
   * "what's actually in the box" beat. */
  engineering: string;
  origin: string;
  tagline: string;
  overview: string;
  features: string[];
  applications: string[];
  url: string;
};

/** Returns "#FFFFFF" or "#000000" depending on which gives better
 * contrast on `bg`. Uses a perceived-luminance (YIQ) split so it
 * matches what the eye actually sees, not just the math. */
export function textOn(bg: string): "#FFFFFF" | "#000000" {
  const hex = bg.startsWith("#") ? bg.slice(1) : bg;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 140 ? "#000000" : "#FFFFFF";
}

export const products: Product[] = [
  {
    id: 1,
    slug: "FPT",
    image: "/images/fpt_product_1_1.webp",
    title: "FPT",
    subtitle: "Diesel",
    category: "Industrial",
    year: "Italy",
    accentColor: "#4B4545",
    leftColor: "#4B4545",
    rightColor: "#F5EFE5",
    descriptionBgColor: "#F5EFE5",
    gallery: ["/images/fpt_product_2.avif", "/images/fpt_product_3.avif"],
    descriptionLong:
      "Italian-engineered diesel power tuned for the kind of grid that doesn't always behave. FPT Industrial designs gensets around three priorities — instant peak response, tight voltage and frequency control, and the long service intervals their European industrial customers depend on. Power Zone is the official FPT distributor in Pakistan, handling supply, on-site installation, commissioning, and after-sales support nationwide. Configure as primary or as standby; integrate with microgrids, hybrid renewables, or off-grid topologies without re-engineering the package.",
    engineering:
      "Built on FPT's high-efficiency combustion architecture with a rugged alternator sized for step-load surges. Voltage and frequency stay inside a tight band even as load shifts, which keeps sensitive electronics safe across the duty cycle. Extended service intervals translate to lower lifetime cost; the chassis is engineered for sustained operation in industrial environments where downtime isn't an option.",
    origin: "Italian Engineering",
    tagline: "Built on European precision",
    overview:
      "Italian-engineered diesel gensets designed for reliable performance across residential, commercial, and industrial loads. Advanced combustion technology delivers fuel-efficient output with the durability FPT Industrial is known for.",
    features: [
      "Peak load handling with instant response",
      "Precise voltage and frequency regulation",
      "High fuel efficiency, extended service intervals",
      "Long operational life backed by Italian engineering",
    ],
    applications: [
      "Industrial facilities",
      "Hospitals",
      "Data centers",
      "Construction sites",
      "Residential backup",
      "Microgrid integration",
    ],
    url: "https://powerzone.com.pk/fpt",
  },
  {
    id: 2,
    slug: "Perkins",
    image: "/images/perkins_product_1.webp",
    title: "Perkins",
    subtitle: "Diesel",
    category: "Commercial",
    year: "UK",
    accentColor: "#454545",
    leftColor: "#454545",
    rightColor: "#EFEFEF",
    descriptionBgColor: "#EFEFEF",
    gallery: [
      "/images/perkins_product_2.avif",
      "/images/perkins_product_3.avif",
    ],
    descriptionLong:
      "British-engineered diesel power tuned for fuel economy and long service life. Perkins pairs a high-efficiency combustion design with a heavy-duty alternator that holds output steady across the load curve — exactly what you want on a site where the genset runs for months between meaningful interventions. Power Zone supplies the full Perkins lineup across Pakistan with installation, commissioning, and on-site maintenance built into the package.",
    engineering:
      "Perkins' fuel-optimized engine architecture cuts consumption per kilowatt while extending intervals between service. Voltage and frequency regulation are tight enough to protect sensitive electronics; the rugged alternator absorbs peak surges without dropouts. The result is predictable cost-of-ownership over a long life — the kind of math that lands well with industrial buyers.",
    origin: "British Engineering",
    tagline: "Built for durability and efficiency",
    overview:
      "Fuel-optimized Perkins engines deliver dependable power with minimal environmental impact. Rugged British engineering tuned for long service life in harsh operating environments.",
    features: [
      "High-efficiency combustion with rugged alternator",
      "Fuel-efficient performance reducing operating cost",
      "Extended service intervals, minimal maintenance",
      "Stable output protects sensitive equipment",
    ],
    applications: [
      "Factories & industrial facilities",
      "Hospitals & healthcare",
      "Construction sites",
      "Commercial offices & retail",
      "Residential backup",
      "Data centers",
    ],
    url: "https://powerzone.com.pk/perkins",
  },
  {
    id: 3,
    slug: "Cummins",
    image: "/images/cummins_product_1.webp",
    title: "Cummins",
    subtitle: "Diesel",
    category: "Utility",
    year: "USA",
    accentColor: "#454B45",
    leftColor: "#454B45",
    rightColor: "#EFF5EF",
    descriptionBgColor: "#EFF5EF",
    gallery: [
      "/images/cummins_product_2.avif",
      "/images/cummins_product_3.avif",
    ],
    descriptionLong:
      "American-engineered diesel power with the kind of grid-failure response that defines mission-critical sites. Cummins gensets ship with smart load monitoring that adjusts output in real time, and they're tuned to come online within seconds of an outage — the difference between a server farm staying on its feet and dropping a frame. Power Zone supplies, installs, and maintains the full Cummins lineup across Pakistan, sizing each install around the customer's actual load profile.",
    engineering:
      "Advanced combustion paired with a high-performance alternator and a real-time load controller. Voltage and frequency stay inside a tight band as step loads come on and off, which matters for hospitals, data centers, and anywhere downtime carries real cost. Reduced emissions and extended service intervals push down total cost of ownership across the lifecycle.",
    origin: "American Power",
    tagline: "American muscle, global reliability",
    overview:
      "Long-term durability and reliable performance engineered for mission-critical loads. Advanced combustion technology with optimized fuel consumption, field-tested across decades of industrial service.",
    features: [
      "Rapid startup within seconds of an outage",
      "Smart load monitoring with live output adjustment",
      "Consistent voltage and frequency regulation",
      "Reduced emissions and operating cost",
    ],
    applications: [
      "Industrial facilities",
      "Healthcare",
      "Data centers",
      "Microgrids & hybrid renewables",
      "Off-grid installations",
    ],
    url: "https://powerzone.com.pk/cummins",
  },
  {
    id: 4,
    slug: "Yuchai",
    image: "/images/yuchai_product_1.webp",
    title: "Yuchai",
    subtitle: "Diesel",
    category: "Industrial",
    year: "China",
    accentColor: "#45454B",
    leftColor: "#45454B",
    rightColor: "#EFEFF3",
    descriptionBgColor: "#EFEFF3",
    gallery: [
      "/images/yuchai_product_2.jpeg",
      "/images/yuchai_product_3.avif",
    ],
    descriptionLong:
      "High-value diesel power from China's largest engine manufacturer. Yuchai gensets are built around a strong output-to-fuel ratio and a wide capacity range — a pragmatic answer for sites that need real industrial reliability without the import-tier price tag. Power Zone handles supply, installation, and ongoing maintenance, with prime and standby configurations sized to the actual load.",
    engineering:
      "Modern Chinese engine technology with high-efficiency combustion and a long-runtime build. Voltage and frequency hold steady through peak load spikes; protection circuits guard sensitive equipment from electrical fluctuations. Extended service intervals and a robust alternator design mean low intervention rates over a long working life.",
    origin: "Chinese Manufacturing",
    tagline: "High value performance",
    overview:
      "Cost-effective diesel generators from China's largest engine manufacturer. Reliable prime and standby power across a wide load spectrum, engineered for continuous service in demanding environments.",
    features: [
      "Strong engine output with low fuel consumption",
      "Voltage and frequency stability under peak load",
      "Long service intervals and extended lifespan",
      "Prime and standby power configurations",
    ],
    applications: [
      "Factories & warehouses",
      "Hospitals",
      "Offices",
      "Load-shedding backup",
      "Construction sites",
    ],
    url: "https://powerzone.com.pk/yuchai",
  },
];

/* -----------------------------------------------------------------------------
 * BESS — Battery Energy Storage Solutions catalog.
 *
 * Same Product shape as `products` so the same showcase + detail experience
 * can drive either catalog. Copy is placeholder for now and should be
 * replaced with real marketing language before launch.
 * -------------------------------------------------------------------------- */

export const bessProducts: Product[] = [
  {
    id: 1,
    slug: "Battery",
    image: "/images/battery_product_1.webp",
    title: "Li-ion Battery",
    subtitle: "Storage",
    category: "Energy Storage",
    year: "2025",
    accentColor: "#4B4545",
    leftColor: "#4B4545",
    rightColor: "#F5EFE5",
    descriptionBgColor: "#F5EFE5",
    gallery: [
      "/images/battery_product_1.webp",
      "/images/battery_product_1.webp",
    ],
    descriptionLong:
      "Lithium iron phosphate (LFP) battery storage in low-voltage and high-voltage configurations. The plug-and-play modular design lets capacity grow with the load — drop in additional units instead of re-engineering the system. The integrated battery management runs round-the-clock, optimizing performance and catching issues early. Built for grid-tied, off-grid, and hybrid renewable installations across commercial, industrial, and residential sites.",
    engineering:
      "LFP chemistry chosen for thermal stability and long cycle life over the typical NMC alternative. The BMS keeps cells equalized and ready for fast charge/discharge response, which translates to peak load shaving and clean voltage/frequency regulation. Rapid power deployment during outages keeps critical loads online.",
    origin: "Pakistan Engineered",
    tagline: "Modular LFP storage that scales with the load",
    overview:
      "Plug-and-play LFP battery modules in low-voltage or high-voltage configurations. Add units to scale capacity without redesigning the BMS or the rack.",
    features: [
      "Lithium iron phosphate (LFP) chemistry",
      "Round-the-clock battery management system",
      "Modular: scale by adding units",
      "Peak shaving and demand-charge reduction",
      "Programmable schedules and adaptive grid response",
    ],
    applications: [
      "Commercial and industrial backup",
      "Data center support",
      "Residential storage",
      "Solar PV integration",
      "Grid stability and peak shaving",
    ],
    url: "https://powerzone.com.pk/battery",
  },
  {
    id: 2,
    slug: "BESS",
    image: "/images/bess_product_1.webp",
    title: "BESS",
    subtitle: "Storage",
    category: "Storage System",
    year: "2025",
    accentColor: "#454545",
    leftColor: "#454545",
    rightColor: "#EFEFEF",
    descriptionBgColor: "#EFEFEF",
    gallery: [
      "/images/bess_product_1.webp",
      "/images/bess_product_1.webp",
    ],
    descriptionLong:
      "A compact, IP65-rated battery energy storage cabinet built around LFP cells. Intelligent battery profiles route energy across operational priorities; redundant dual-path cooling and continuous thermal monitoring keep the system stable under sustained load. The pre-engineered modular architecture means rapid deployment for commercial and industrial sites, and integrates cleanly with existing solar or grid infrastructure.",
    engineering:
      "LFP cells with intelligent cell balancing keep state of charge equalized across the stack. Dual cooling paths plus active thermal monitoring handle sustained discharge without throttling. Automated fault detection isolates problems before they cascade, and the system supports black-start as well as on-grid and off-grid operation.",
    origin: "Pakistan Engineered",
    tagline: "Compact LFP cabinet, ready for grid-edge",
    overview:
      "IP65 cabinet with LFP cells, intelligent battery profiles, dual-path cooling, and automated fault isolation. Modular and pre-engineered for fast deployment.",
    features: [
      "IP65 outdoor-rated enclosure",
      "Intelligent battery profiles for dynamic allocation",
      "Redundant dual-path cooling with thermal monitoring",
      "Automated fault detection and isolation",
      "Black-start capable; on-grid and off-grid",
    ],
    applications: [
      "Industrial peak shaving",
      "Solar + storage installations",
      "Data centers and commercial buildings",
      "Backup for critical infrastructure",
      "Microgrid anchor storage",
    ],
    url: "https://powerzone.com.pk/bess",
  },
  {
    id: 3,
    slug: "Inverter",
    image: "/images/inverter_product_1.webp",
    title: "Hybrid Inverter",
    subtitle: "Hybrid",
    category: "Power Electronics",
    year: "2025",
    accentColor: "#454B45",
    leftColor: "#454B45",
    rightColor: "#EFF5EF",
    descriptionBgColor: "#EFF5EF",
    gallery: [
      "/images/inverter_product_1.webp",
      "/images/inverter_product_1.webp",
    ],
    descriptionLong:
      "A hybrid inverter that integrates solar PV, battery storage, and grid power in a single chassis. Intelligent automatic switching keeps load online when the grid drops; voltage and frequency regulation deliver clean power to sensitive equipment. Built around the same LFP battery architecture and 24/7 BMS as the rest of the Power Zone storage lineup, with modular capacity that grows with the install.",
    engineering:
      "Bi-directional power conversion with intelligent solar / battery / grid switching. Voltage and frequency regulation hold load-side power clean enough for sensitive electronics. Programmable battery-profile scheduling lets you bias toward backup, peak shaving, or self-consumption depending on the site.",
    origin: "Pakistan Engineered",
    tagline: "Hybrid PV, battery, and grid in one chassis",
    overview:
      "Hybrid inverter that integrates solar PV, battery storage, and grid power. Intelligent switching, voltage/frequency regulation, and modular battery integration.",
    features: [
      "Intelligent PV / battery / grid switching",
      "Voltage and frequency regulation",
      "Programmable battery profiles",
      "Modular LFP battery integration",
      "Plug-and-play deployment",
    ],
    applications: [
      "Residential hybrid solar",
      "Commercial buildings",
      "Industrial sites",
      "Data centers",
      "On-grid and off-grid scenarios",
    ],
    url: "https://powerzone.com.pk/inverter",
  },
];
