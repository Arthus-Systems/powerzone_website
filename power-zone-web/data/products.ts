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
  /** Manufacturer rating list(s) shown in the detail panels as a
   * tabular reference. Each entry is one self-contained table (header
   * row + data rows), optionally titled — Cummins ships two manufacturer
   * variants (AOSIF + UAE), other brands a single list. Cell count in
   * each row must equal `headers.length`. Omit (undefined / []) for
   * products that don't have a rating list (e.g. BESS, batteries,
   * inverters). */
  ratings?: RatingTable[];
};

export type RatingTable = {
  /** Optional label shown above the table — used when a product has
   * more than one manufacturer variant (Cummins → "AOSIF Manufacturer",
   * "UAE Manufacturer"). Omit for single-table products. */
  title?: string;
  headers: string[];
  rows: string[][];
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
    image: "/images/fpt_product_1.webp",
    title: "FPT",
    subtitle: "Diesel",
    category: "Industrial",
    year: "Italy",
    accentColor: "#4B4545",
    leftColor: "#4B4545",
    rightColor: "#F5EFE5",
    descriptionBgColor: "#F5EFE5",
    gallery: ["/images/fpt_product_2.webp", "/images/fpt_product_3.webp"],
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
    ratings: [
      {
        headers: ["Model", "KVA"],
        rows: [
          ["R24MANS01.23A02", "20 — R"],
          ["R24MSNS01.31A02", "30 — R"],
          ["R38MSNS01.55A01", "50 — R"],
          ["NEF45AM2.S500", "50 — S"],
          ["R38MSNS01.66A01", "60 — R"],
          ["NEF45SM1A.S500", "60 — S"],
          ["NEF45SM2A.S500", "80"],
          ["NEF45TM2A.S500", "100"],
          ["NEF45TM3.S500", "120"],
          ["NEF67TM3A.S500", "150"],
          ["NEF67TM4.S500", "170"],
          ["NEF67TM7.S502", "200"],
          ["NEF67TE8P.S500", "250"],
          ["CURSOR87TE4.S550", "300"],
          ["CURSOR13TE2A.S551", "350"],
          ["CURSOR13TE3A.S551", "400"],
          ["CR13TE7W.S550", "500"],
          ["CR16TE1W.S550", "600"],
        ],
      },
    ],
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
      "/images/perkins_product_2.webp",
      "/images/perkins_product_3.webp",
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
    ratings: [
      {
        headers: ["Model", "Prime Rating (kVA)", "PERKINS Engine No."],
        rows: [
          ["PZ13", "13", "403A-15G1 / 403D-15G1"],
          ["PZ20", "20", "404A-22G1 / 404D-22G"],
          ["PZ30", "30", "1103A-33G"],
          ["PZ45", "45", "1103A-33TG1"],
          ["PZ60", "60", "1103A-33TG2"],
          ["PZ80", "80", "1104A-44TG2"],
          ["PZ100", "100", "1104A-44TAG2"],
          ["PZ150", "150", "11061-70TAG2"],
          ["PZ200", "200", "1106A-70TAG4"],
          ["PZ250", "250", "1206A-E70TTAG3"],
          ["PZ300", "300", "1506A-E88TAG5"],
          ["PZ350", "350", "2206A-E13TAG2 / 2206C-E13TAG2"],
          ["PZ400", "400", "2206A-E13TAG3 / 2206C-E13TAG2"],
          ["PZ500", "500", "2506A-E15TAG2 / 2506C-E15TAG2"],
          ["PZ650", "650", "2806A-E18TAG2 / 2806C-E18TAG2"],
          ["PZ800", "800", "4006-23TAG3A"],
          ["PZ1000", "1000", "4008-TAG2A"],
          ["PZ1250", "1250", "4012-46TWG2A"],
          ["PZ1500", "1500", "4012-46TAG2A"],
          ["PZ2000", "2000", "4016-61TRG2"],
        ],
      },
    ],
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
      "/images/cummins_product_2.webp",
      "/images/cummins_product_3.webp",
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
    ratings: [
      {
        title: "AOSIF Manufacturer",
        headers: ["Prime Power (kVA/kW)", "Standby Power (kVA/kW)", "Engine Model"],
        rows: [
          ["21/17*", "24/19", "4B3.9-G11/25KW"],
          ["25/20", "28/22", "QSB3.9-G3/25KW"],
          ["28/22*", "30/24", "4B3.9-G1/24KW"],
          ["28/22", "30/24", "4B3.9-G2-24KW"],
          ["31/25", "34/27", "4B3.9-G2/27KW"],
          ["38/30", "42/33", "QSB3.9-G33/36KW"],
          ["38/30", "42/33", "B3.9CS4-GT3/36KW"],
          ["40/32*", "44/35", "4BT3.9-G1/36KW"],
          ["40/32", "44/35", "4BT3.9-G2/36KW"],
          ["50/40", "55/44", "4BTA3.9-G2/50KW"],
          ["56/45", "63/50", "QSB3.9-G35/58KW"],
          ["63/50", "69/55", "4BTA3.9-G2/58KW"],
          ["63/50", "69/55", "B3.9CS4-GT2/73KW"],
          ["65/52", "70/56", "QSB3.9-G31/58KW"],
          ["80/64", "90/72", "4BTA3.9-G11/75KW"],
          ["75/60", "83/66", "B5.9CS4-GT3/75KW"],
          ["88/70", "94/75", "QSB3.9-G37/84KW"],
          ["94/75*", "103/82", "6BT5.9-G1/86KW"],
          ["94/75", "103/82", "4BTA3.9-G13/87KW"],
          ["95/76", "105/84", "6BTA5.9-G2/106KW"],
          ["100/80*", "110/88", "4BTAA3.9-G3/96KW"],
          ["100/80", "110/88", "QSB5.9-G2/86KW"],
          ["100/80", "110/88", "QSB3.9-G39/100KW"],
          ["100/80", "110/88", "6BT5.9-G2/86KW"],
          ["100/80", "110/88", "B5.9CS4-GT2/107KW"],
          ["105/84", "115/92", "4BTA3.9-G2/96KW"],
          ["112/90", "125/100", "QSB5.9-G30/106KW"],
          ["115/92", "125/100", "6BTA5.9-G2/106KW"],
          ["125/100", "138/110", "6BTAA5.9-G2/120KW"],
          ["125/100", "138/110", "B5.9CS4-GT1/117KW"],
          ["138/110", "150/120", "QSB5.9-G31/132KW"],
          ["135/108", "145/116", "6BTA5.9-G3/120KW"],
          ["150/120", "165/132", "6BTAA5.9-G12/140KW"],
          ["150/120", "165/132", "QSB5.9-G33/159KW"],
          ["165/132", "165/132", "B6.7CS4-GT2/156KW"],
          ["188/150", "206/165", "6BTC7-G2/173KW"],
          ["188/150", "200/160", "6BTC7-G31/171KW"],
          ["188/150", "200/160", "6CTA8.3-G1/163KW"],
          ["200/160", "215/172", "6CTA8.3-G2/163KW"],
          ["248/198", "250/200", "L9CS4-GT2/230KW"],
          ["225/180", "250/200", "QSL9-G31/188KW"],
          ["250/200", "250/200", "6CTAA8.3-G9/231KW"],
          ["230/183", "264/211", "6CTAA8.3-G8/200KW"],
          ["230/183", "275/220", "6LTA8.9-G3/230KW"],
          ["230/183", "275/220", "6LTA8.9-G34/238KW"],
          ["250/200", "275/220", "QSL9-G2/238KW"],
          ["250/200", "275/220", "L9CS4-GT1/247KW"],
          ["270/216", "300/240", "6LTA9.5-G3/250KW"],
          ["280/224", "312/250", "6LTA9.5-G33/270KW"],
          ["320/256", "350/280", "6LTAA9.5-G30/301KW"],
          ["320/256", "350/280", "6LTAA9.5-G1/290KW"],
          ["350/288", "385/308", "QSZ10-G12/315KW"],
          ["340/280", "400/320", "QSZ13-G6/335KW"],
          ["375/300", "375/300", "QSZ10-G11/345KW"],
          ["388/310", "425/340", "6ZTAA13-G3/340KW"],
          ["400/320", "450/360", "QSZ10-G7/367KW"],
          ["438/350", "475/380", "6ZTAA13-G2/390KW"],
          ["438/350", "475/380", "6LTAA14-G1/400KW"],
          ["438/350", "469/375", "QSZ12-G2/400KW"],
          ["450/360", "500/400", "QSZ13-G5/411KW"],
          ["500/400", "525/420", "QSZ13-G3/450KW"],
          ["500/400", "550/440", "QSZ13-G10/463KW"],
        ],
      },
      {
        title: "UAE Manufacturer",
        headers: ["Model", "kVA*"],
        rows: [
          ["4B3.9-G11", "20"],
          ["4B3.9-G1", "30"],
          ["4BT3.9-G1", "40"],
          ["4BTA3.9-G2", "50"],
          ["4BTA3.9-G11", "80"],
          ["6BT5.9-G1", "80"],
          ["6BT5.9-G2", "100"],
          ["6BTAA5.9-G12", "150"],
          ["6CTA8.3-G2", "188"],
          ["6CTAA8.3G7", "200"],
          ["6LTAA9.5G3", "270"],
          ["6LTAA9.5G1", "320"],
          ["QSG12G3", "360"],
          ["QSG12G4", "410"],
          ["M15G8", "512"],
        ],
      },
    ],
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
      "/images/yuchai_product_2.webp",
      "/images/yuchai_product_3.webp",
    ],
    descriptionLong:
      "High-value diesel power from one of China's largest engine manufacturers. Yuchai gensets are built around a strong output-to-fuel ratio and a wide capacity range — a pragmatic answer for sites that need real industrial reliability without the import-tier price tag. Power Zone handles supply, installation, and ongoing maintenance, with prime and standby configurations sized to the actual load.",
    engineering:
      "Modern Chinese engine technology with high-efficiency combustion and a long-runtime build. Voltage and frequency hold steady through peak load spikes; protection circuits guard sensitive equipment from electrical fluctuations. Extended service intervals and a robust alternator design mean low intervention rates over a long working life.",
    origin: "Chinese Manufacturing",
    tagline: "High value performance",
    overview:
      "Cost-effective diesel generators from one of China's largest engine manufacturers. Reliable prime and standby power across a wide load spectrum, engineered for continuous service in demanding environments.",
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
    ratings: [
      {
        headers: ["Model", "kVA"],
        rows: [
          ["YC4V35-D20", "20"],
          ["YC4V45Z-D20", "30"],
          ["YC4V55Z-D20", "40"],
          ["YC4V35-D20", "20"],
          ["YC4V45Z-D20", "30"],
          ["YC4V55Z-D20", "40"],
          ["YC4D60-D21", "40"],
          ["YC4D60-D21", "40"],
          ["YC4D90Z-D21", "62.5"],
          ["YC4D90Z-D25", "62.5"],
          ["YC4A100Z-D20", "75"],
          ["YC4A100Z-D20", "80"],
          ["YC4A140L-D20", "100"],
          ["YC4A180L-D20", "125"],
          ["YC6B180L-D20", "125"],
          ["YC6B180L-D20", "125"],
          ["YC6B205L-D20", "150"],
          ["YC6A230L-D20", "175"],
          ["YC6A245L-D21", "187.5"],
          ["YC6MK285L-D20", "200"],
          ["YC6MK350L-D20", "250"],
          ["YC6MK350L-D20", "250"],
          ["YC6MK420L-D20", "312.5"],
          ["YC6MJ500L-D21", "375"],
          ["YC6T600L-D22", "450"],
          ["YC6T660L-D20", "500"],
        ],
      },
    ],
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
  // Order: BESS first so that landing on /products?category=bess from the
  // homepage's Peek Our Products card (which shows bess_product_1.webp) lands
  // on the matching hero image instead of the Li-ion Battery.
  {
    id: 2,
    slug: "BESS",
    image: "/images/bess_product_1.webp",
    title: "BESS",
    subtitle: "Storage",
    category: "Storage System",
    year: "2025",
    // Red-warm palette per user request.
    accentColor: "#4B4545",
    leftColor: "#4B4545",
    rightColor: "#F5EFE5",
    descriptionBgColor: "#F5EFE5",
    gallery: [
      "/images/bess_product_2.webp",
      "/images/bess_product_3.webp",
    ],
    descriptionLong:
      "The Compact ESS — a Chint Power-partnered, IP65-rated battery energy storage cabinet built around LFP (lithium iron phosphate) cells. An integrated BMS routes energy across operational priorities with cell-level balancing; redundant dual-path cooling and continuous thermal monitoring keep the stack stable under sustained load. The pre-engineered modular architecture is plug-and-play for rapid deployment on commercial and industrial sites, and integrates cleanly with existing solar or grid infrastructure.",
    engineering:
      "LFP chemistry with an integrated BMS for intelligent cell balancing — state of charge stays equalized across the stack. Dual cooling paths plus active thermal monitoring handle sustained discharge without throttling. Automated fault detection and isolation prevents cascade failures, and the system supports black-start plus on-grid and off-grid operation. Engineered in partnership with Chint Power Systems.",
    origin: "Pakistan Engineered · Chint Partner",
    tagline: "Compact ESS — LFP, IP65, Chint-powered",
    overview:
      "Compact ESS — IP65 LFP cabinet with integrated BMS, dual-path cooling, automated fault isolation, and black-start. Modular plug-and-play deployment, engineered with Chint Power Systems.",
    features: [
      "LFP (lithium iron phosphate) chemistry",
      "IP65 outdoor-rated enclosure",
      "Integrated BMS with cell balancing",
      "Redundant dual-path cooling with thermal monitoring",
      "Automated fault detection and isolation",
      "Black-start capable; on-grid and off-grid",
      "Modular plug-and-play deployment",
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
    id: 1,
    slug: "Battery",
    image: "/images/battery_product_1.webp",
    title: "Li-ion Battery",
    subtitle: "Storage",
    category: "Energy Storage",
    year: "2025",
    // Colors swapped per user request — was Li-ion palette, now uses
    // the original BESS (neutral gray) palette.
    accentColor: "#454545",
    leftColor: "#454545",
    rightColor: "#EFEFEF",
    descriptionBgColor: "#EFEFEF",
    gallery: [
      "/images/battery_product_2.webp",
      "/images/battery_product_3.webp",
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
    id: 3,
    slug: "Inverter",
    image: "/images/inverter_product_1.webp",
    title: "Hybrid Inverter",
    subtitle: "Hybrid",
    category: "Power Electronics",
    year: "2025",
    // Green-tint palette — the remaining slot after BESS took red-warm
    // and Li-ion kept neutral gray.
    accentColor: "#454B45",
    leftColor: "#454B45",
    rightColor: "#EFF5EF",
    descriptionBgColor: "#EFF5EF",
    gallery: [
      "/images/inverter_product_2.webp",
      "/images/hybrid_inverter_product_2.webp",
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
