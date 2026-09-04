export interface IndustryFeature {
  title: string;
  description: string;
  badge?: string;
  tag?: string;
  iconName?: string;
}


export interface IndustrySolution {
  slug: string;
  title: string;
  shortName: string;
  categoryGroup: "restaurant" | "retail_wholesale";
  categoryGroupLabel: string;
  heroBadge: string;
  headline: string;
  tagline: string;
  description: string;
  iconSvg: string; // SVG path or identifier
  accentColor: string; // Tailwind hex or class
  bgGradient: string;
  keyFeatures: IndustryFeature[];
  appCapabilities: {
    title: string;
    description: string;
    tag: string;
  }[];
  sampleWorkflow: {
    step: string;
    title: string;
    detail: string;
  }[];
  metrics: {
    label: string;
    value: string;
    subtext: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    business: string;
    location: string;
    rating: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  // ==========================================
  // FOOD, RESTAURANT & HOSPITALITY GROUP
  // ==========================================
  {
    slug: "fine-dine",
    title: "Fine Dine Restaurants",
    shortName: "Fine Dine",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "TABLE RESERVATION & KOT SYSTEM",
    headline: "Table Management, Captain KOT App & Multi-Course Billing",
    tagline: "Deliver 5-star hospitality with zero order delays, multi-floor table layouts, split cheques, and live kitchen order routing.",
    description: "SaaSzo POS elevates your dining room with interactive floor maps, Captain tablet order punch, automatic service charges, and real-time recipe food costing.",
    iconSvg: "fine-dine",
    accentColor: "#6451f1",
    bgGradient: "from-indigo-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Multi-Floor Table Layout & Live Status",
        description: "Visual floor plan showing occupied, vacant, reserved, and billing tables in real time with timer alerts.",
        badge: "Floor Plan",
      },
      {
        title: "Captain Tablet / Phone KOT Punch",
        description: "Waitstaff takes orders at table-side on smartphone; KOT prints instantly in kitchen & bar stations.",
        badge: "Captain KOT",
      },
      {
        title: "Split Bills & Multi-Tender Payment",
        description: "Effortlessly split bills item-wise or amount-wise between guests across cash, cards, and UPI.",
        badge: "Split Pay",
      },
      {
        title: "Multi-Course Firing (Starters, Mains, Desserts)",
        description: "Hold and fire food courses sequentially with a single tap to keep table dining flow perfect.",
        badge: "Course Firing",
      },
      {
        title: "Dual Slabs & Service Charge Automation",
        description: "Automate AC/Non-AC restaurant GST, state excise liquor tax, and customizable service charge rules.",
        badge: "Tax Ready",
      },
      {
        title: "Valet Parking & Guest CRM History",
        description: "Print valet tokens and remember guest food preferences, anniversaries, and VIP discounts.",
        badge: "VIP CRM",
      },
    ],
    appCapabilities: [
      {
        title: "100% Offline SQLite Architecture",
        description: "Never lose a table during dinner rush. SaaSzo runs completely offline on local SQLite and syncs when online.",
        tag: "Zero Downtime",
      },
      {
        title: "Kitchen Display System (KDS)",
        description: "Color-coded digital order queue for head chefs with item preparation countdowns.",
        tag: "Kitchen Flow",
      },
      {
        title: "Recipe Costing & Portion BOM",
        description: "Auto-deduct raw ingredients (paneer, chicken, spices) when a dish is billed.",
        tag: "Food Cost",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Guest Seated & Table Assigned", detail: "Captain assigns table via visual map and punches starters on phone app." },
      { step: "02", title: "Instant Kitchen KOT Print", detail: "Thermal printer at tandoor and bar station prints ticket with table number." },
      { step: "03", title: "Split Bill & Digital Receipt", detail: "Bill split 3 ways; UPI dynamic QR generated with instant WhatsApp confirmation." },
    ],
    metrics: [
      { label: "Table Turnover", value: "35% Faster", subtext: "More guests served per night" },
      { label: "KOT Accuracy", value: "100% Precise", subtext: "Zero verbal miscommunication" },
      { label: "Food Cost Savings", value: "12% Reduced", subtext: "Via strict recipe BOM control" },
    ],
    testimonial: {
      quote: "SaaSzo transformed our dining room. Captains take orders in 20 seconds, and split billing is completely seamless even during packed Saturday nights.",
      author: "Vikramaditya Rathore",
      business: "The Royal Heritage Restaurant",
      location: "Jaipur, Rajasthan",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can waitstaff take orders on their own Android or iOS phones?",
        answer: "Yes! SaaSzo Captain app works smoothly on any standard Android smartphone, tablet, or iOS device.",
      },
      {
        question: "Does it support separate thermal printers for Kitchen and Bar?",
        answer: "Yes! You can route beverage items to the bar printer and food items to the kitchen printer automatically.",
      },
    ],
  },
  {
    slug: "qsr",
    title: "Quick Service Restaurants (QSR)",
    shortName: "QSR & Fast Food",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "HIGH-SPEED COUNTER CHECKOUT",
    headline: "5-Second Express Billing, Kitchen Display & Token Calling",
    tagline: "Crush long customer queues with ultra-fast touch billing, combo meals, Kitchen Display System (KDS), and live TV token screens.",
    description: "Built specifically for high-velocity burger joints, roll counters, momo stalls, and fast food franchises needing speed, accuracy, and offline resilience.",
    iconSvg: "qsr",
    accentColor: "#6451f1",
    bgGradient: "from-orange-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "5-Second Express Touch Screen Billing",
        description: "Tap-and-bill interface designed for cashiers to complete orders in under 5 seconds with zero lag.",
        badge: "5s Bill",
      },
      {
        title: "Live Order Ready TV Token Display",
        description: "Customer token number displays on LED TV screen with chime callout when food is ready.",
        badge: "Token Screen",
      },
      {
        title: "Dynamic Combo Meals & Add-On Modifiers",
        description: "Upsell with 1-tap combo prompts: 'Add Fries & Drink for ₹60?' during checkout.",
        badge: "Upsell",
      },
      {
        title: "Kitchen Display System (KDS)",
        description: "Replace messy paper slips with live touch screens in the assembly line.",
        badge: "KDS Screen",
      },
      {
        title: "Dynamic UPI Soundbox & Instant QR",
        description: "Display scannable UPI QR on customer display with immediate voice audio confirmation.",
        badge: "UPI Soundbox",
      },
      {
        title: "Cash Drawer Kick & Cashier Shift Handover",
        description: "Auto-kick cash drawer on billing; reconcile physical cash with system tally at shift end.",
        badge: "Cash Drawer",
      },
    ],
    appCapabilities: [
      {
        title: "100% Offline Resilience",
        description: "Zero dependency on cloud servers for counter billing. Operates seamlessly during internet downtime.",
        tag: "100% Offline",
      },
      {
        title: "Aggregator Sync (Zomato / Swiggy)",
        description: "Accept and manage dine-in, takeaway, and delivery orders on one unified screen.",
        tag: "Delivery Hub",
      },
      {
        title: "Hourly Rush Heatmaps",
        description: "Track peak customer rush hours to optimize staff and food prep schedules.",
        tag: "Analytics",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Customer Orders at Counter", detail: "Cashier taps Burger Combo + Coke in 4 seconds." },
      { step: "02", title: "Token Printed & Sent to KDS", detail: "Token #142 prints on thermal receipt; order appears green on kitchen screen." },
      { step: "03", title: "Food Handover & Token Cleared", detail: "Chef taps complete; TV screen chimes 'Token 142 Ready for Pickup'." },
    ],
    metrics: [
      { label: "Checkout Time", value: "5 Seconds", subtext: "Average bill generation speed" },
      { label: "Queue Drop", value: "80% Less", subtext: "Faster throughput at counter" },
      { label: "Upsell Growth", value: "+22% Revenue", subtext: "Through combo prompt modifiers" },
    ],
    testimonial: {
      quote: "During peak 1 PM lunch rush, our lines used to spill out. SaaSzo's 5-second billing and KDS eliminated the chaos completely.",
      author: "Rahul Sharma",
      business: "Bite Express QSR Chain",
      location: "New Delhi",
      rating: "4.9",
    },
    faqs: [
      {
        question: "Can I connect a customer-facing token display TV screen?",
        answer: "Yes! Any smart TV or HDMI monitor can display live token numbers with audio chimes using SaaSzo Token Screen.",
      },
      {
        question: "Does it work with standard 3-inch Bluetooth thermal printers?",
        answer: "Yes! Supports ESC/POS Bluetooth, USB, Ethernet thermal receipt printers with automatic cutters.",
      },
    ],
  },
  {
    slug: "cafe",
    title: "Cafes & Coffee Shops",
    shortName: "Cafe & Coffee",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "ARTISAN COFFEE & CUSTOM MODIFIERS",
    headline: "Custom Modifiers, Table QR Scan-to-Pay & Customer Wallet",
    tagline: "Delight your coffee lovers with milk & syrup customization, contactless table QR ordering, digital stamp rewards, and paperless bills.",
    description: "Tailor-made for specialty coffee roasters, modern cafes, and tea lounges seeking fast counter and table operations with automated ingredient tracking.",
    iconSvg: "cafe",
    accentColor: "#6451f1",
    bgGradient: "from-amber-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Custom Syrups, Milk & Roasting Modifiers",
        description: "Easily customize orders: Oat Milk, Extra Shot, Hazelnut Syrup, Less Sugar with auto pricing.",
        badge: "Modifiers",
      },
      {
        title: "Contactless Table QR Scan & Pay",
        description: "Customers scan tabletop QR to view digital menu, customize coffee, and pay via UPI.",
        badge: "Table QR",
      },
      {
        title: "Customer Prepaid Wallet & Stamp Loyalty",
        description: "'Buy 5 Coffees, Get 1 Free' digital stamp card tracked automatically by customer phone number.",
        badge: "Loyalty",
      },
      {
        title: "Paperless WhatsApp Invoices",
        description: "Send eco-friendly digital invoices directly to customer WhatsApp instantly upon payment.",
        badge: "WhatsApp",
      },
      {
        title: "Daily Milk & Bean Inventory Consumption",
        description: "Track daily usage of coffee beans (grams), milk cartons, and pastries with automatic wastage logging.",
        badge: "Stock Log",
      },
      {
        title: "Barista Station KOT Printer Support",
        description: "Direct printing to barista espresso bar with clear modifier notes for error-free preparation.",
        badge: "Barista Print",
      },
    ],
    appCapabilities: [
      {
        title: "Offline Local Database",
        description: "Keep brewing and billing even when Wi-Fi drops. Syncs back automatically when connection restores.",
        tag: "Zero Downtime",
      },
      {
        title: "Bakery & Desserts Batch Tracking",
        description: "Track fresh croissants and cheesecakes with batch times to ensure zero stale sales.",
        tag: "Freshness",
      },
      {
        title: "Customer Feedback SMS",
        description: "Automated thank you SMS with Google Review rating link after bill settlement.",
        tag: "Google Reviews",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Customer Customizes Order", detail: "Barista taps Iced Latte -> Almond Milk -> Caramel in 3 taps." },
      { step: "02", title: "Barista Ticket Printed", detail: "Clear recipe label prints at espresso bar with guest name." },
      { step: "03", title: "Digital Receipt & Stamps", detail: "Bill sent to WhatsApp; customer receives +1 stamp on their digital card." },
    ],
    metrics: [
      { label: "Repeat Customers", value: "+45% Growth", subtext: "Via digital stamp card loyalty" },
      { label: "Paper Cost", value: "70% Saved", subtext: "Through WhatsApp e-billing" },
      { label: "Modifier Accuracy", value: "100%", subtext: "Zero wrong milk/syrup orders" },
    ],
    testimonial: {
      quote: "Our customers love the WhatsApp bills and stamp cards. The modifier options make barista training take less than 15 minutes.",
      author: "Pooja Vora",
      business: "Roast & Brew Artisan Cafe",
      location: "Bengaluru, Karnataka",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I track coffee bean inventory in grams?",
        answer: "Yes! SaaSzo supports fractional units like grams, milliliters, and kilograms for precise bean and milk usage.",
      },
      {
        question: "Can customers order from their tables using their phones?",
        answer: "Yes! Each table gets a unique QR code allowing guests to view the menu, add modifiers, and pay directly.",
      },
    ],
  },
  {
    slug: "bakery",
    title: "Bakeries & Patisseries",
    shortName: "Bakery & Patisserie",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "ADVANCE CAKE BOOKING & WEIGHT SYNC",
    headline: "Advance Cake Bookings, Weighing Scale Sync & Batch Expiry",
    tagline: "Manage customized designer cake orders, electronic weighing scales, short-shelf-life batch expiries, and daily recipe production.",
    description: "Purpose-built for bakeries, sweet shops, and artisan patisseries requiring advance token deposits, weight-based pricing, and strict perishability control.",
    iconSvg: "bakery",
    accentColor: "#6451f1",
    bgGradient: "from-amber-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Advance Custom Cake Order Bookings",
        description: "Capture flavor, weight, custom message, reference photo, delivery date/time, and advance deposit.",
        badge: "Cake Booking",
      },
      {
        title: "Electronic Weighing Scale Auto-Sync",
        description: "Connect USB/Serial weighing scales; weight auto-populates on bill with 1-gram accuracy.",
        badge: "Weigh Scale",
      },
      {
        title: "Perishable Batch & Expiry Management",
        description: "Track 24-hour and 48-hour fresh cream items; receive proactive alerts before items spoil.",
        badge: "Batch Expiry",
      },
      {
        title: "Recipe Bill of Materials (BOM)",
        description: "Auto-deduct flour, butter, chocolate, and sugar inventory whenever a batch of cakes is baked.",
        badge: "BOM Recipe",
      },
      {
        title: "Festival Gift Box & Hamper Bundling",
        description: "Bundle cookies, chocolates, and dry sweets into customizable festive hampers with 1 SKU.",
        badge: "Hampers",
      },
      {
        title: "Pickup SMS & Delivery Tracking",
        description: "Send automated SMS when cake is ready for pickup with pickup token number.",
        badge: "Pickup Alert",
      },
    ],
    appCapabilities: [
      {
        title: "Eggless & Vegan Tagging",
        description: "Clear green vegetarian/eggless markers printed on all cake box labels and receipts.",
        tag: "Dietary Tags",
      },
      {
        title: "Offline Standalone Counter",
        description: "Fast touch checkout with local SQLite database for crowded morning & evening rushes.",
        tag: "Offline",
      },
      {
        title: "Thermal Barcode Sticker Printing",
        description: "Print barcode price labels with manufacturing date and expiry time directly on pastries.",
        tag: "Barcodes",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Customer Books Birthday Cake", detail: "Staff enters 'Happy 5th Birthday Aarav', 1.5kg Chocolate Truffle, ₹500 advance." },
      { step: "02", title: "Kitchen Production Schedule", detail: "Chef sees tomorrow's 4 PM delivery queue with photo reference on tablet." },
      { step: "03", title: "Pickup SMS & Balance Settlement", detail: "Cake completed -> SMS sent -> Customer pays balance ₹700 via UPI on pickup." },
    ],
    metrics: [
      { label: "Advance Orders", value: "2.8x Increase", subtext: "Zero forgotten cake bookings" },
      { label: "Spoilage Loss", value: "Zero Waste", subtext: "Through proactive batch expiry" },
      { label: "Weighing Speed", value: "3x Faster", subtext: "Direct USB scale auto-tare" },
    ],
    testimonial: {
      quote: "Custom cake orders used to be noted in paper diaries and caused so many errors. SaaSzo automated our advance bookings and pickup reminders.",
      author: "Ananya Deshmukh",
      business: "The Velvet Crust Patisserie",
      location: "Mumbai, Maharashtra",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I print barcode labels for pre-packed cookies with expiry date?",
        answer: "Yes! SaaSzo supports barcode sticker printers (TVS, TSC, Zebra) for shelf packaging.",
      },
      {
        question: "Does it handle partial advance payments for customized cakes?",
        answer: "Yes! You can record advance deposits and collect the remaining balance at pickup with a single tap.",
      },
    ],
  },
  {
    slug: "ice-cream-desserts",
    title: "Ice Cream & Dessert Parlours",
    shortName: "Ice Cream & Desserts",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "SCOOP & TUB INVENTORY",
    headline: "Scoop & Tub Tracking, Weight-Based Pricing & Fast Billing",
    tagline: "Handle massive summer evening rush queues with single-tap flavor selection, weighing scale auto-tare, waffle cone add-ons, and instant UPI soundbox.",
    description: "Designed for scoop parlours, gelato boutiques, and dessert counters requiring rapid counter touch billing and cold-chain inventory monitoring.",
    iconSvg: "ice-cream-desserts",
    accentColor: "#6451f1",
    bgGradient: "from-purple-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Single, Double Scoop & Tub Pricing Matrix",
        description: "1-tap selection for Cone, Cup, Waffle Bowl, 500g Tub, 1kg Family Pack with dynamic toppings.",
        badge: "Scoop Matrix",
      },
      {
        title: "Direct Weighing Scale Auto-Sync",
        description: "Place tub on scale; SaaSzo auto-calculates exact price based on weight in grams.",
        badge: "Auto Tare",
      },
      {
        title: "Fast Tap Counter POS for Summer Rush",
        description: "Process 100+ customers per hour with color-coded flavor buttons and quick-pay buttons.",
        badge: "Fast Tap",
      },
      {
        title: "Deep Freeze Batch & Flavour Inventory",
        description: "Monitor remaining kilograms per flavor tub to prevent running out of bestseller flavors.",
        badge: "Tub Stock",
      },
      {
        title: "Dynamic UPI QR & Voice Soundbox",
        description: "Display scannable UPI QR on customer display with immediate voice audio confirmation.",
        badge: "Soundbox",
      },
      {
        title: "Kids Birthday & Family Pack Rewards",
        description: "Digital loyalty points accrued automatically on customer phone numbers for repeat visits.",
        badge: "Loyalty",
      },
    ],
    appCapabilities: [
      {
        title: "100% Offline SQLite Architecture",
        description: "Never lose a sale during busy weekend rushes even if the internet connection is disrupted.",
        tag: "Zero Downtime",
      },
      {
        title: "Thermal Receipt Auto-Cutter",
        description: "Instant 2-inch and 3-inch ESC/POS thermal receipt printing with barcode & UPI QR.",
        tag: "Fast Printing",
      },
      {
        title: "Multi-Counter Kiosk Sync",
        description: "Operate 2 or 3 billing counters simultaneously syncing to central stock in real time.",
        tag: "Multi-Counter",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Customer Chooses Flavors", detail: "Cashier taps Belgian Chocolate + Roasted Almond in 2 seconds." },
      { step: "02", title: "Add-On Waffle Cone Selected", detail: "1-tap add-on adds ₹30; UPI QR appears on customer display." },
      { step: "03", title: "Instant Payment & Receipt", detail: "Customer scans UPI; soundbox confirms payment; receipt prints in 1.5s." },
    ],
    metrics: [
      { label: "Hourly Volume", value: "120+ Bills/Hr", subtext: "During peak summer rush" },
      { label: "Inventory Accuracy", value: "99.5%", subtext: "Per-tub scoop monitoring" },
      { label: "Payment Speed", value: "3 Seconds", subtext: "Via instant dynamic UPI QR" },
    ],
    testimonial: {
      quote: "On summer weekends we have 50 people waiting in line. SaaSzo's fast tap layout and instant UPI soundbox halved our waiting time.",
      author: "Manish Kulkarni",
      business: "Frosty Delights Ice Cream Parlour",
      location: "Pune, Maharashtra",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I connect an electronic weighing scale for selling gelato by weight?",
        answer: "Yes! Supports USB and Serial RS232 weighing scales with automatic tare and pricing.",
      },
      {
        question: "Can I run 2 billing counters during peak hours on the same database?",
        answer: "Yes! Multiple counter terminals can bill simultaneously with instant real-time stock synchronization.",
      },
    ],
  },
  {
    slug: "pizzeria",
    title: "Pizzerias & Italian Trattorias",
    shortName: "Pizzeria",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "TOPPINGS & CRUST CUSTOMIZER",
    headline: "Half-and-Half Pizzas, Toppings Customizer & Oven KOT Routing",
    tagline: "Build complex custom pizzas with crust selections, cheese burst add-ons, dedicated pizza oven tickets, and delivery rider dispatch.",
    description: "Built for independent pizzerias and multi-outlet Italian chains requiring specialized pizza customizers, ingredient BOM deductions, and delivery tracking.",
    iconSvg: "pizzeria",
    accentColor: "#6451f1",
    bgGradient: "from-rose-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Half-and-Half Pizza Builder",
        description: "Combine two distinct styles (e.g. Left: Paneer Tikka, Right: Farmhouse) on a single pizza base.",
        badge: "Half & Half",
      },
      {
        title: "Crust, Cheese & Topping Customizer",
        description: "Select Thin Crust, Cheese Burst, Wheat Dough, extra mozzarella, olives, and jalapenos with live pricing.",
        badge: "Toppings",
      },
      {
        title: "Dedicated Pizza Oven Station KOT",
        description: "Direct thermal ticket printing to pizza prep station with clear crust, sauce, and topping notes.",
        badge: "Oven KOT",
      },
      {
        title: "In-House Delivery Rider Dispatch",
        description: "Assign delivery orders to delivery boys with customer address navigation and cash collection status.",
        badge: "Rider App",
      },
      {
        title: "Cheese & Dough Yeast BOM Consumption",
        description: "Auto-deduct exact grams of mozzarella cheese, flour dough balls, and pizza sauce per size billed.",
        badge: "BOM Stock",
      },
      {
        title: "Aggregator Integration (Zomato / Swiggy)",
        description: "Manage walk-in dine-in, takeaway, and online delivery orders from a unified dashboard.",
        badge: "Online Sync",
      },
    ],
    appCapabilities: [
      {
        title: "30-Minute Delivery Stopwatch",
        description: "Live countdown timer on delivery orders to ensure hot on-time customer deliveries.",
        tag: "Timer",
      },
      {
        title: "Offline SQLite Core",
        description: "Never lose an order during Friday dinner rush. Complete standalone counter billing.",
        tag: "Offline",
      },
      {
        title: "SMS Order Status Updates",
        description: "Auto SMS to customer: 'Your pizza is in the oven' and 'Out for delivery with rider Amit'.",
        tag: "Live SMS",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Pizza Customized at POS", detail: "Cashier selects Medium -> Cheese Burst -> Extra Olives in 5 seconds." },
      { step: "02", title: "Oven Ticket Printed", detail: "Pizza chef receives ticket with large clear ingredient checkboxes." },
      { step: "03", title: "Rider Assigned & Dispatched", detail: "Rider scans invoice barcode; customer receives live tracking SMS." },
    ],
    metrics: [
      { label: "Prep Time", value: "14 Minutes", subtext: "Average oven to box time" },
      { label: "Order Accuracy", value: "100%", subtext: "Clear modifier KOT printing" },
      { label: "Delivery Speed", value: "24 Mins Avg", subtext: "Streamlined rider dispatch" },
    ],
    testimonial: {
      quote: "The Half-and-Half pizza builder and cheese burst modifiers work like magic. Our kitchen tickets are crystal clear and mistakes dropped to zero.",
      author: "Karan Singhal",
      business: "Crust & Craft Woodfired Pizza",
      location: "Hyderabad, Telangana",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I set different prices for extra cheese on Regular, Medium, and Large pizzas?",
        answer: "Yes! Topping modifier prices can be dynamically linked to pizza sizes automatically.",
      },
      {
        question: "Can I manage delivery boy cash reconciliation at the end of the day?",
        answer: "Yes! SaaSzo tracks all COD orders assigned to each rider and reconciles collected cash in 1 click.",
      },
    ],
  },
  {
    slug: "bar-brewery",
    title: "Bars, Pubs & Microbreweries",
    shortName: "Bar & Brewery",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "EXCISE & LIQUOR TAX READY",
    headline: "Peg-Wise Liquor Inventory, Happy Hours & Running Tabs",
    tagline: "Track spirit bottles down to 30ml/60ml pegs, automate state excise liquor VAT vs food GST, run scheduled happy hour deals, and manage open tabs.",
    description: "Engineered for high-energy bars, craft breweries, and lounges requiring strict beverage accountability, dual tax calculations, and lightning-fast tab management.",
    iconSvg: "bar-brewery",
    accentColor: "#6451f1",
    bgGradient: "from-indigo-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Peg-Wise (30ml / 60ml / Bottle) Inventory",
        description: "Real-time bottle and peg tracking for scotch, vodka, gin, and beer barrels with automated spillage logs.",
        badge: "Peg Control",
      },
      {
        title: "Scheduled Happy Hour Pricing Rules",
        description: "Auto-trigger 1+1 or 30% discounts between 4 PM - 8 PM on weekdays with automatic revert.",
        badge: "Happy Hour",
      },
      {
        title: "Open Running Tabs for Group Dining",
        description: "Keep tables and bar tabs open; add rounds of drinks throughout the night with instant bill settlement.",
        badge: "Bar Tabs",
      },
      {
        title: "State Excise VAT & Food GST Dual Slabs",
        description: "Accurate tax separation on single bills: Liquor VAT / Excise duty + Food GST (5% / 18%).",
        badge: "Excise Tax",
      },
      {
        title: "Bartender Station KOT Printer Support",
        description: "Drink orders print directly at the bar dispenser counter for instant cocktail preparation.",
        badge: "Bar KOT",
      },
      {
        title: "Live Band & Cover Charge Ticketing",
        description: "Bill entrance cover charges with redeemable F&B coupons at the counter.",
        badge: "Cover Charge",
      },
    ],
    appCapabilities: [
      {
        title: "Spillage & Breakage Logs",
        description: "Record broken bottles and bar wastage with manager authorization pins.",
        tag: "Loss Prevention",
      },
      {
        title: "100% Offline SQLite Core",
        description: "Zero freeze during packed weekend DJ nights. Lightning fast touch response.",
        tag: "Zero Downtime",
      },
      {
        title: "Staff PIN Authorizations",
        description: "Restrict complimentary drinks, bill discounts, and item cancellations to manager PINs.",
        tag: "Security",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Open Tab for Table 12", detail: "Captain starts tab; punches 4 Craft Beers + Nachos on tablet." },
      { step: "02", title: "Automatic Happy Hour Price", detail: "System applies 1+1 beer deal; bar ticket prints at draught station." },
      { step: "03", title: "Single Itemized Dual-Tax Bill", detail: "Bill prints with separate Liquor VAT and Food GST totals; settled via card." },
    ],
    metrics: [
      { label: "Excise Accuracy", value: "100% Match", subtext: "Government audit compliance" },
      { label: "Spillage Loss", value: "Zero Unaccounted", subtext: "Strict peg-level tracking" },
      { label: "Tab Speed", value: "4x Faster", subtext: "Instant running tab lookup" },
    ],
    testimonial: {
      quote: "Tracking 30ml pegs and dual liquor VAT/GST used to give our accountants nightmares. SaaSzo automated everything and our excise reports match 100%.",
      author: "Siddharth Roy",
      business: "Hop & Barrel Microbrewery",
      location: "Gurugram, Haryana",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Does it support separate state liquor VAT and restaurant GST on the same bill?",
        answer: "Yes! SaaSzo automatically splits liquor items and food items into their respective tax brackets on the invoice.",
      },
      {
        question: "Can I lock discounts and bill cancellations behind manager PIN codes?",
        answer: "Yes! Role-based security prevents unauthorized voids and complimentary drink modifications.",
      },
    ],
  },
  {
    slug: "food-court",
    title: "Food Courts & Multi-Kiosk Malls",
    shortName: "Food Court",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "CENTRAL PREPAID CARD & KIOSK SYNC",
    headline: "Central Food Cards, Multi-Vendor Revenue Split & Token TV",
    tagline: "Operate modern food courts with central prepaid smart card recharges, automated vendor revenue sharing, and multi-stall token callouts.",
    description: "The complete operating system for mall food courts, amusement parks, corporate cafeterias, and multi-brand culinary hubs.",
    iconSvg: "food-court",
    accentColor: "#6451f1",
    bgGradient: "from-blue-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Central Prepaid RFID / NFC Card Recharge",
        description: "Customers load cash/UPI onto smart cards at entry kiosk; tap to pay across all food stalls.",
        badge: "Smart Cards",
      },
      {
        title: "Automated Multi-Vendor Revenue Settlement",
        description: "Calculate vendor sales, deduct mall operator commission %, and generate daily payout reports.",
        badge: "Revenue Split",
      },
      {
        title: "Large Screen TV Token Callout System",
        description: "Central LED displays show live ready tokens with sound chimes across all stalls.",
        badge: "Token Display",
      },
      {
        title: "100% Offline Standalone Kiosk Terminals",
        description: "Every food stall bills seamlessly without internet; syncs transactions to central hub.",
        tag: "Zero Downtime",
        badge: "Offline Kiosk",
      },
      {
        title: "Single-QR Multi-Vendor Food Ordering",
        description: "Guests scan table QR code to order from multiple stalls on a single digital cart.",
        badge: "Unified QR",
      },
      {
        title: "Mall Operator Live Analytics Dashboard",
        description: "Real-time footfall, gross revenue, top performing stalls, and balance refunds overview.",
        badge: "Mall Admin",
      },
    ],
    appCapabilities: [
      {
        title: "Refund Counter Management",
        description: "1-tap balance refund on prepaid food cards when customers exit the food court.",
        tag: "Refunds",
      },
      {
        title: "Individual Stall Thermal Printers",
        description: "Each stall receives only their respective item orders with order token numbers.",
        tag: "Stall Routing",
      },
      {
        title: "Franchise Royalty Settlements",
        description: "Automate daily, weekly, or monthly bank transfer settlement sheets for all vendors.",
        tag: "Settlement",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Card Loaded at Recharge Desk", detail: "Guest loads ₹1,000 on Food Court Smart Card via UPI." },
      { step: "02", title: "Tap to Pay at Multiple Stalls", detail: "Taps ₹250 at Dosa Stall, ₹350 at Burger Stall; balance updates instantly." },
      { step: "03", title: "Central Token & Commission Split", detail: "TV displays 'Token 89 Ready'; system auto-allocates 15% mall commission." },
    ],
    metrics: [
      { label: "Daily Transactions", value: "15,000+ Bills", subtext: "Across 22 food stalls" },
      { label: "Settlement Time", value: "1-Click", subtext: "Daily vendor commission payout" },
      { label: "Queue Reduction", value: "65% Less", subtext: "Via prepaid tap-and-pay" },
    ],
    testimonial: {
      quote: "Managing 18 food stalls used to require hours of manual reconciliation every night. SaaSzo automated our vendor settlements and prepaid cards completely.",
      author: "Prateek Mukherjee",
      business: "Nexus Food Junction",
      location: "Kolkata, West Bengal",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can we support dynamic UPI QR at individual stalls along with prepaid cards?",
        answer: "Yes! Stalls can accept central prepaid cards, direct UPI, cash, and debit/credit cards simultaneously.",
      },
      {
        question: "How does the vendor revenue settlement work?",
        answer: "SaaSzo calculates gross sales per stall, subtracts operator revenue share/commission, and generates daily bank payout files.",
      },
    ],
  },
  {
    slug: "cloud-kitchen",
    title: "Cloud Kitchens & Dark Kitchens",
    shortName: "Cloud Kitchen",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "MULTI-BRAND SINGLE SCREEN",
    headline: "Multi-Brand Hub, Recipe BOM Costing & Dispatch Label Print",
    tagline: "Run 10+ virtual food brands from a single kitchen screen, consolidate Zomato/Swiggy orders, track recipe food cost, and print dispatch stickers.",
    description: "The dedicated operating system for ghost kitchens, virtual restaurant networks, and multi-brand culinary delivery hubs.",
    iconSvg: "cloud-kitchen",
    accentColor: "#6451f1",
    bgGradient: "from-purple-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Multi-Brand Single Screen Dashboard",
        description: "Manage Biryani, Burgers, Pizzas, and Desserts brands on one unified master dashboard.",
        badge: "Multi-Brand",
      },
      {
        title: "1-Click Multi-Brand Menu 86 (Stock Out)",
        description: "Ran out of paneer? 1-click toggles paneer dishes across all 5 virtual brands instantly.",
        badge: "Item Toggle",
      },
      {
        title: "Recipe BOM Food Costing Calculator",
        description: "Track precise food costs and gross margins per dish down to every spice gram and packaging box.",
        badge: "Recipe BOM",
      },
      {
        title: "Thermal Packaging Sticker & Bag Label Print",
        description: "Print adhesive bag seal stickers with customer name, items list, and tamper-proof safety seal.",
        badge: "Bag Labels",
      },
      {
        title: "Rider Pickup Handover Verification",
        description: "Verify delivery rider OTP or order number before handing over bags to prevent wrong deliveries.",
        badge: "Handover",
      },
      {
        title: "Kitchen Preparation Countdown Timer",
        description: "Visual 12-minute preparation timers to keep average food dispatch time under 15 minutes.",
        badge: "Prep Timer",
      },
    ],
    appCapabilities: [
      {
        title: "Raw Material Reorder Alerts",
        description: "Proactive warnings when chicken, oil, flour, or delivery boxes fall below safety thresholds.",
        tag: "Smart Stock",
      },
      {
        title: "Offline Standalone Core",
        description: "Kitchen order printers and KDS keep working even if internet connectivity flickers.",
        tag: "Zero Downtime",
      },
      {
        title: "Shift Profit & Food Waste Logs",
        description: "Track daily cooked food wastage and staff meal allocations to maintain high profit margins.",
        tag: "P&L Reports",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Orders Arrive Across 3 Brands", detail: "Zomato Biryani order + Swiggy Burger order arrive on unified POS screen." },
      { step: "02", title: "Station KOT & Bag Stickers Printed", detail: "Rice station & Fryer station print tickets; adhesive box labels printed." },
      { step: "03", title: "Rider Handover in 12 Minutes", detail: "Rider scans bag barcode; order marked dispatched in under 15 minutes." },
    ],
    metrics: [
      { label: "Dispatch Speed", value: "13 Mins Avg", subtext: "Fastest kitchen cycle time" },
      { label: "Food Cost Margin", value: "+18% Profit", subtext: "Via strict BOM inventory tracking" },
      { label: "Wrong Deliveries", value: "0.01%", subtext: "Through barcode bag verification" },
    ],
    testimonial: {
      quote: "We operate 6 virtual brands in a 400 sq.ft kitchen. SaaSzo consolidated all brands into one screen and cut our order prep time by 40%.",
      author: "Farhan Qureshi",
      business: "Kitchen Craft Multi-Brand Cloud Hub",
      location: "Chennai, Tamil Nadu",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I manage separate inventories for each brand, or shared raw materials?",
        answer: "Both! You can share common ingredients (onions, oil, rice) across brands while keeping brand packaging separate.",
      },
      {
        question: "Can we print sticky adhesive labels for food delivery containers?",
        answer: "Yes! Supports TVS and TSC thermal sticker printers for container lid labels and safety seals.",
      },
    ],
  },
  {
    slug: "large-chain",
    title: "Large Chains & Multi-Outlet Franchises",
    shortName: "Large Chain",
    categoryGroup: "restaurant",
    categoryGroupLabel: "Food & Hospitality",
    heroBadge: "CENTRAL ERP & FRANCHISE ENGINE",
    headline: "Central Menu Control, Inter-Branch Transfer & Consolidated P&L",
    tagline: "Scale from 5 to 500+ outlets with central recipe management, warehouse-to-store stock transfers, franchise royalty settlements, and enterprise analytics.",
    description: "Enterprise multi-outlet POS & supply chain management designed for high-growth retail and restaurant chains expanding across cities and states.",
    iconSvg: "large-chain",
    accentColor: "#6451f1",
    bgGradient: "from-slate-950 via-indigo-950 to-slate-950",
    keyFeatures: [
      {
        title: "Central Menu & Price Push in 1 Click",
        description: "Update prices, introduce new seasonal dishes, or modify combos across 200+ outlets in 10 seconds.",
        badge: "Master Menu",
      },
      {
        title: "Central Warehouse to Branch Stock Transfers",
        description: "Generate dispatch challans, track goods in transit, and confirm store delivery with barcode audit.",
        badge: "Stock Transfer",
      },
      {
        title: "Franchise Royalty & Revenue Reconciliation",
        description: "Automate franchisee billing cuts, software royalties, and monthly settlement statements.",
        badge: "Franchise Engine",
      },
      {
        title: "Consolidated Real-Time Group P&L",
        description: "View top performing outlets, regional sales comparisons, and store profitability on 1 dashboard.",
        badge: "Group P&L",
      },
      {
        title: "Role-Based Multi-Tier Staff Permissions",
        description: "Granular access control: Cashiers can bill, Store Managers can view day logs, HQ controls masters.",
        badge: "Role Access",
      },
      {
        title: "Local SQLite Failover for Every Branch",
        description: "Every store operates 100% offline locally and syncs automatically with central HQ database.",
        badge: "Zero Downtime",
      },
    ],
    appCapabilities: [
      {
        title: "Inter-Branch Stock Requests",
        description: "Store managers can request stock from nearby outlets or central commissary when low.",
        tag: "Supply Chain",
      },
      {
        title: "E-Way Bill & E-Invoice Generation",
        description: "1-click government portal integration for B2B warehouse-to-franchise shipments.",
        tag: "Compliance",
      },
      {
        title: "Centralized Customer Loyalty",
        description: "Customers earn and redeem loyalty points across any outlet in your nationwide chain.",
        tag: "National Loyalty",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "HQ Publishes New Summer Menu", detail: "Head office updates prices and pushes menu to 150 outlets simultaneously." },
      { step: "02", title: "Outlets Receive Central Stock", detail: "Branch manager scans incoming warehouse shipment; stock updates automatically." },
      { step: "03", title: "Consolidated Daily Reporting", detail: "HQ directors view live chain-wide revenue, profit margins, and inventory levels." },
    ],
    metrics: [
      { label: "Chain Scale", value: "250+ Outlets", subtext: "Managed from 1 central dashboard" },
      { label: "Menu Update Speed", value: "10 Seconds", subtext: "Nationwide instant price sync" },
      { label: "Franchise Audit", value: "100% Transparent", subtext: "Automated royalty calculation" },
    ],
    testimonial: {
      quote: "Managing 45 outlets across 8 cities was chaos before SaaSzo. Now central price pushes take 10 seconds, and our warehouse stock transfers are 100% auditable.",
      author: "Rajesh Khandelwal",
      business: "Chai King Enterprise Chain",
      location: "Pan-India",
      rating: "5.0",
    },
    faqs: [
      {
        question: "If an outlet's internet disconnects, can they continue billing?",
        answer: "Yes! Every single store has its own local SQLite database and operates 100% independently without internet.",
      },
      {
        question: "Can we set different pricing tiers for Tier-1, Tier-2, and airport outlets?",
        answer: "Yes! You can group outlets by region or tier and push localized price lists effortlessly.",
      },
    ],
  },

  // ==========================================
  // RETAIL, WHOLESALE & SUPPLY CHAIN GROUP
  // ==========================================
  {
    slug: "retailers-kirana",
    title: "Retailers & Kirana Stores",
    shortName: "Retail & Kirana",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "FAST BARCODE SCANNING & KHATA",
    headline: "Fast Barcode Billing, Customer Khata & Offline SQLite POS",
    tagline: "Create GST bills in 8 seconds, scan items with phone camera or laser scanner, track customer udhar/khata, and print instant thermal receipts.",
    description: "The #1 billing software for Indian grocery stores, kirana shops, supermarkets, and FMCG retailers who want blazing speed, zero downtime, and customer trust.",
    iconSvg: "retailers-kirana",
    accentColor: "#6451f1",
    bgGradient: "from-emerald-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "8-Second Touch & Barcode Scanning Checkout",
        description: "Scan barcodes via USB/Bluetooth scanner or built-in mobile camera for instant item addition.",
        badge: "8s Bill",
      },
      {
        title: "Customer Khata (Credit Ledger) with Auto Reminders",
        description: "Maintain customer udhar records with 1-tap WhatsApp payment reminders containing live UPI links.",
        badge: "Khata Ledger",
      },
      {
        title: "100% Offline SQLite Billing",
        description: "Never stop billing when broadband fails or power cuts occur. All data stored securely locally.",
        badge: "100% Offline",
      },
      {
        title: "Bluetooth & USB Thermal Receipt Auto-Print",
        description: "Print professional 2-inch or 3-inch thermal receipts with shop logo, GSTIN, and UPI payment QR.",
        badge: "Thermal Print",
      },
      {
        title: "Low Stock & Reorder Level Proactive Alerts",
        description: "Get automated alerts when fast-moving items like Atta, Oil, Sugar fall below safety thresholds.",
        badge: "Stock Alerts",
      },
      {
        title: "Cash Drawer Tally & Shift Closure",
        description: "Reconcile daily cash in drawer against sales at closing with zero calculation mistakes.",
        badge: "Cash Tally",
      },
    ],
    appCapabilities: [
      {
        title: "Barcode Price Label Generator",
        description: "Generate and print custom barcode stickers for loose grains and in-house packaged dry goods.",
        tag: "Barcode Print",
      },
      {
        title: "Electronic Weighing Scale Link",
        description: "Connect USB scale to weigh vegetables, fruits, and grains with instant auto-price calculation.",
        tag: "Weigh Scale",
      },
      {
        title: "Multi-Language WhatsApp Bills",
        description: "Share bills on WhatsApp in Hindi, Gujarati, Marathi, Tamil, Telugu, and English.",
        tag: "Regional Bills",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Cashier Scans 5 Grocery Items", detail: "Scans Barcode on Atta, Oil, Biscuit; total ₹840 calculated in 5 seconds." },
      { step: "02", title: "Payment via UPI QR or Khata", detail: "Customer scans UPI QR on counter display or adds ₹840 to monthly Khata ledger." },
      { step: "03", title: "Thermal Print & WhatsApp Receipt", detail: "Thermal receipt prints instantly; detailed GST invoice sent to customer WhatsApp." },
    ],
    metrics: [
      { label: "Checkout Speed", value: "3.5x Faster", subtext: "Zero item search delay" },
      { label: "Khata Recovery", value: "92% on Time", subtext: "Through WhatsApp UPI reminders" },
      { label: "Offline Uptime", value: "99.99%", subtext: "Local SQLite engine reliability" },
    ],
    testimonial: {
      quote: "Our billing speed tripled during evening rush hours. The WhatsApp Khata reminders helped us recover over ₹2 Lakhs in pending customer udhar.",
      author: "Anand Patel",
      business: "Shree Ganesh Supermarket",
      location: "Ahmedabad, Gujarat",
      rating: "4.9",
    },
    faqs: [
      {
        question: "Can I use my mobile phone camera to scan barcodes?",
        answer: "Yes! SaaSzo turns any smartphone camera into a high-speed barcode scanner with zero hardware cost.",
      },
      {
        question: "What happens when internet disconnects?",
        answer: "SaaSzo continues working 100% offline with zero lag. All bills sync automatically when connection returns.",
      },
    ],
  },
  {
    slug: "wholesalers-distributors",
    title: "Wholesalers & Distributors",
    shortName: "Wholesale & Distribution",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "B2B KHATA & MULTI-GODOWN",
    headline: "Party Credit Limits, Tiered Rate Lists & E-Way Bills",
    tagline: "Manage bulk B2B distribution orders with customer-specific pricing slabs, multi-godown stock transfers, E-Way bills, and automated payment recovery.",
    description: "Engineered for wholesale traders, distributors, and C&F agents handling high-value invoices, credit terms, transport challans, and GST compliance.",
    iconSvg: "wholesalers-distributors",
    accentColor: "#6451f1",
    bgGradient: "from-blue-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Party-Wise Custom Pricing & Bulk Slabs",
        description: "Set different wholesale rates and volume discounts for Retailers, Sub-Distributors, and VIPs.",
        badge: "Rate Lists",
      },
      {
        title: "Outstanding Credit Limit & Aging Analysis",
        description: "Set max credit limits (e.g. ₹5 Lakhs, 30 Days); auto-block billing when limit is breached.",
        badge: "Credit Limits",
      },
      {
        title: "Multi-Godown Stock Transfer & Challans",
        description: "Track inventory across 5+ godowns and branches with official dispatch delivery challans.",
        badge: "Godowns",
      },
      {
        title: "1-Click E-Way Bill & E-Invoice Generation",
        description: "Direct government portal integration for instant E-Way bill JSON and IRN QR code printing.",
        badge: "E-Way Bill",
      },
      {
        title: "Automated WhatsApp Ledger Statements",
        description: "Send monthly PDF statements of accounts with pending invoices and payment links in 1 click.",
        badge: "Ledgers",
      },
      {
        title: "Salesman Order Booking Mobile App",
        description: "Field sales agents book orders in market with live stock visibility and geo-tagged routes.",
        badge: "Field Sales",
      },
    ],
    appCapabilities: [
      {
        title: "GSTR-1, GSTR-3B Auto Reports",
        description: "Audit-ready B2B sales summaries with HSN/SAC breakdowns for instant CA filing.",
        tag: "CA Ready",
      },
      {
        title: "Transport & Vehicle Details Printing",
        description: "Print Transporter ID, LR Number, Vehicle No., and Delivery Address on invoice headers.",
        tag: "Logistics",
      },
      {
        title: "Cheque & Bank Reconciliation",
        description: "Track post-dated cheques (PDC), cleared payments, and bank deposit vouchers.",
        tag: "Banking",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Salesman Books Bulk B2B Order", detail: "Agent selects Party 'Agrawal Traders', 50 Cartons Oil at Wholesale Tier-2 rate." },
      { step: "02", title: "E-Way Bill & Challan Generated", detail: "1-click generates E-Way bill IRN and Godown-3 dispatch packing slip." },
      { step: "03", title: "Delivery & Ledger Auto-Updated", detail: "Goods delivered; invoice added to party ledger; payment reminder scheduled." },
    ],
    metrics: [
      { label: "Payment Recovery", value: "94% on Time", subtext: "Automated WhatsApp ledger reminders" },
      { label: "Invoice Processing", value: "80% Faster", subtext: "1-Click E-Way and E-Invoice" },
      { label: "Stock Accuracy", value: "99.8%", subtext: "Across all regional godowns" },
    ],
    testimonial: {
      quote: "We distribute FMCG to over 400 retail stores. SaaSzo's party rate lists and 1-click E-Way bill generation saved our back-office 3 hours every single day.",
      author: "Mahaveer Kothari",
      business: "Kothari Trading & Distribution Co.",
      location: "Surat, Gujarat",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Does SaaSzo generate E-Way Bills and E-Invoices directly from the software?",
        answer: "Yes! Integrates seamlessly with the GST portal to generate IRN QR codes and E-Way bills in 1 click.",
      },
      {
        question: "Can we restrict credit sales if a party has overdue invoices older than 45 days?",
        answer: "Yes! Automatic credit lock prevents billing defaulting parties until pending dues are cleared.",
      },
    ],
  },
  {
    slug: "manufacturers",
    title: "Manufacturers & Production Units",
    shortName: "Manufacturers",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "BILL OF MATERIALS & BATCH PRODUCTION",
    headline: "Bill of Materials (BOM), Raw Material Tracking & Job Work",
    tagline: "Track raw material consumption, manage multi-level production batches, calculate accurate unit costs, and issue job work delivery challans.",
    description: "Built for small and medium manufacturing enterprises (MSMEs), packaging units, and fabrication workshops needing precise production inventory control.",
    iconSvg: "manufacturers",
    accentColor: "#6451f1",
    bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
    keyFeatures: [
      {
        title: "Multi-Level Bill of Materials (BOM)",
        description: "Define exact raw material recipes (steel, plastic, chemicals, packaging) required for 1 finished unit.",
        badge: "BOM Recipe",
      },
      {
        title: "Raw Material to Finished Goods Auto-Conversion",
        description: "Manufacture 500 units; system automatically deducts raw materials and increases finished stock.",
        badge: "Production Log",
      },
      {
        title: "Production Batch Numbering & Quality Logs",
        description: "Assign batch codes with manufacturing date and quality inspection certification notes.",
        badge: "Batch Codes",
      },
      {
        title: "Job Work Inward & Outward Challans",
        description: "Track semi-finished goods sent to third-party vendors for powder coating, polishing, or assembly.",
        badge: "Job Work",
      },
      {
        title: "Factory Overhead & Unit Cost Calculator",
        description: "Factor labor, electricity, and packaging costs into the cost of production for accurate pricing.",
        badge: "Costing",
      },
      {
        title: "B2B Tax Invoicing & E-Invoicing",
        description: "Full GST compliance with E-Invoice IRN, E-Way bills, HSN codes, and TCS/TDS deductions.",
        badge: "E-Invoice",
      },
    ],
    appCapabilities: [
      {
        title: "Wastage & Scrap Logging",
        description: "Record production scrap and salvage value to maintain 100% accurate raw material books.",
        tag: "Scrap Audit",
      },
      {
        title: "100% Offline SQLite Core",
        description: "Factory floor terminals record production batches without relying on broadband stability.",
        tag: "Factory Floor",
      },
      {
        title: "Audit-Ready P&L & Stock Valuations",
        description: "FIFO and Weighted Average stock valuation reports ready for annual CA balance sheet audits.",
        tag: "Valuation",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Production Order Created", detail: "Supervisor enters production order for 1,000 Plastic Bottles." },
      { step: "02", title: "BOM Raw Material Deducted", detail: "50kg Polymer Granules + 5kg Masterbatch auto-deducted from raw stock." },
      { step: "03", title: "Finished Goods Invoiced", detail: "Batch #PB-2026 generated; B2B Tax Invoice with E-Way bill created for client." },
    ],
    metrics: [
      { label: "Inventory Leakage", value: "Zero Unaccounted", subtext: "Strict raw material BOM tracking" },
      { label: "Costing Precision", value: "100% Accurate", subtext: "True production cost per unit" },
      { label: "Job Work Control", value: "Complete Audit", subtext: "Zero lost goods at vendor workshops" },
    ],
    testimonial: {
      quote: "Tracking raw plastic granules to finished packaged bottles was always a guessing game. SaaSzo's BOM auto-conversion made our factory audit 100% accurate.",
      author: "Dinesh Mehta",
      business: "Apex Polymers & Packaging",
      location: "Pune, Maharashtra",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can we track job work sent to external vendors?",
        answer: "Yes! SaaSzo generates GST-compliant Job Work Challans (Form ITC-04 ready) to track items at vendor locations.",
      },
      {
        question: "Does it support multi-stage production processes?",
        answer: "Yes! You can define intermediate sub-assemblies and final finished product BOM recipes.",
      },
    ],
  },
  {
    slug: "pharmacy-chemist",
    title: "Pharmacies & Medical Chemists",
    shortName: "Pharmacy & Chemist",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "BATCH & EXPIRY SAFE MEDICAL POS",
    headline: "Batch Number & Expiry Tracking with Salt / Generic Search",
    tagline: "Never sell expired medicine. Proactive 30/60/90-day expiry loss alerts, salt composition search, Schedule H compliance register, and doctor history.",
    description: "Engineered specifically for medical stores, retail pharmacies, and pharmaceutical distributors who require strict drug batch control and regulatory compliance.",
    iconSvg: "pharmacy-chemist",
    accentColor: "#6451f1",
    bgGradient: "from-cyan-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Batch Number, Expiry Date & MRP on Scan",
        description: "Barcode scan auto-detects Batch No, Expiry Month/Year, and MRP with zero manual typing.",
        badge: "Batch Scan",
      },
      {
        title: "Proactive 30/60/90 Day Expiry Loss Alerts",
        description: "Receive advance warning lists of near-expiry medicines to return to distributors before losses occur.",
        badge: "Expiry Alert",
      },
      {
        title: "Salt & Generic Medicine Substitute Search",
        description: "Search by chemical composition (e.g. Paracetamol 650mg) to instantly suggest generic alternatives.",
        badge: "Salt Search",
      },
      {
        title: "Schedule H & H1 Drug Audit Register",
        description: "Maintain mandatory government drug compliance registers with doctor name and patient details.",
        badge: "Schedule H",
      },
      {
        title: "Strip, Tablet & Syrup Fraction Billing",
        description: "Sell loose tablets from a strip or fractional quantities; stock deducts accurately.",
        badge: "Loose Tablets",
      },
      {
        title: "Patient Prescription & Refill Reminders",
        description: "Store chronic medication history (Diabetes, BP) and send automated refill reminders on WhatsApp.",
        badge: "Refill CRM",
      },
    ],
    appCapabilities: [
      {
        title: "Doctor-Wise Sales Reports",
        description: "Track prescription trends and revenue generated per consulting physician.",
        tag: "Doctor Analytics",
      },
      {
        title: "100% Offline SQLite Core",
        description: "Keep counter billing active 24/7 even during hospital Wi-Fi outages.",
        tag: "Zero Downtime",
      },
      {
        title: "Direct Thermal Print with Medical Rx",
        description: "Print clean bills with Doctor Name, Patient Name, Dosage Instructions, and GSTIN.",
        tag: "Rx Print",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Barcode Scanned on Strip", detail: "Batch #D2409, Exp: 12/27, MRP ₹120 auto-populates in 1 second." },
      { step: "02", title: "Schedule H Patient Details Entered", detail: "Doctor Name & Patient Phone logged for regulatory audit." },
      { step: "03", title: "Bill Settled & Refill Scheduled", detail: "Thermal receipt printed; WhatsApp bill sent with 30-day refill reminder." },
    ],
    metrics: [
      { label: "Expired Stock Loss", value: "Zero Losses", subtext: "Via proactive 60-day expiry dump alerts" },
      { label: "Audit Readiness", value: "100% Compliant", subtext: "Automated Schedule H & H1 registers" },
      { label: "Billing Speed", value: "6 Seconds/Bill", subtext: "Instant batch & MRP auto-fill" },
    ],
    testimonial: {
      quote: "Before SaaSzo we lost over ₹40,000 every year in expired medicines. Now the 60-day expiry alert lets us return near-expiry stock to stockists with zero loss.",
      author: "Dr. Alok Verma",
      business: "Apex Chemist & Healthcare",
      location: "Chandigarh",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I sell loose tablets from a strip (e.g. 4 tablets out of 10)?",
        answer: "Yes! SaaSzo supports fractional packaging and automatically recalculates remaining loose tablet inventory.",
      },
      {
        question: "Does it generate Schedule H1 sales reports for drug inspector audits?",
        answer: "Yes! Full exportable Schedule H, H1, and Narcotic drug sales registers with doctor and patient details in 1 click.",
      },
    ],
  },
  {
    slug: "electronics-hardware",
    title: "Electronics & Hardware Stores",
    shortName: "Electronics & Hardware",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "IMEI & SERIAL TRACKING WITH WARRANTY",
    headline: "Serial & IMEI Tracking, Warranty Billing & Service Intake",
    tagline: "Track smartphones and appliances by individual Serial/IMEI numbers, print brand warranty terms, manage repair service tickets, and handle multiple GST tax slabs.",
    description: "Designed for mobile shops, electronics showrooms, electrical hardware dealers, and appliance retailers requiring serialized stock control.",
    iconSvg: "electronics-hardware",
    accentColor: "#6451f1",
    bgGradient: "from-indigo-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Individual Serial & IMEI Number Scanning",
        description: "Scan dual IMEI barcodes on purchase and sale invoices for 100% serialized traceability.",
        badge: "IMEI Scan",
      },
      {
        title: "Automated Brand Warranty Terms on Invoice",
        description: "Print official 1-Year / 2-Year warranty clauses and brand service center contacts on bill footers.",
        badge: "Warranty Slip",
      },
      {
        title: "Service & Repair Intake Job Cards",
        description: "Record device intake for screen repair with customer signature, issue checklist, and status SMS.",
        badge: "Repair Cards",
      },
      {
        title: "Multiple Tax Slabs (18%, 28%) with Input Credit",
        description: "Accurate GST routing for mobile phones (18%), air conditioners (28%), and accessories.",
        badge: "Multi-Tax",
      },
      {
        title: "Old Device Exchange Value Deduction",
        description: "Accept customer trade-ins/exchange phones with automatic valuation deduction on new purchase bill.",
        badge: "Exchange",
      },
      {
        title: "Technician Commission & Labor Charges",
        description: "Itemize repair parts and technician labor service charges with separate tax breakdown.",
        badge: "Labor Billing",
      },
    ],
    appCapabilities: [
      {
        title: "100% Offline SQLite Core",
        description: "Never stall expensive customer checkouts during festive season broadband disruptions.",
        tag: "Zero Downtime",
      },
      {
        title: "Instant Serial History Search",
        description: "Search any IMEI number to view original purchase date, supplier invoice, and customer bill in 1 second.",
        tag: "IMEI Lookup",
      },
      {
        title: "A4 / A5 Laser & Thermal Print",
        description: "Print professional multi-copy A4 laser invoices with GST details or 3-inch thermal receipts.",
        tag: "Custom Invoices",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "New Smartphone Sold", detail: "Cashier scans IMEI 1 & IMEI 2 barcodes from mobile box." },
      { step: "02", title: "Warranty Auto-Applied", detail: "System adds '1-Year Official Brand Warranty until Sept 2027'." },
      { step: "03", title: "GST Invoice Issued", detail: "Tax Invoice with IMEI numbers printed on A4 paper & sent to customer WhatsApp." },
    ],
    metrics: [
      { label: "Warranty Disputes", value: "90% Reduction", subtext: "Due to printed IMEI warranty slips" },
      { label: "IMEI Search Time", value: "1 Second", subtext: "Instant customer purchase lookup" },
      { label: "GST Input Match", value: "100% Accurate", subtext: "Automatic 18% & 28% tax segregation" },
    ],
    testimonial: {
      quote: "When customers come for warranty claims, finding their bill used to take 20 minutes. With SaaSzo we just scan the phone IMEI and the bill appears in 1 second.",
      author: "Vikram Malhotra",
      business: "Digital World Mobile Showroom",
      location: "Indore, Madhya Pradesh",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I scan multiple IMEI numbers for dual-SIM phones?",
        answer: "Yes! SaaSzo supports primary IMEI, secondary IMEI, and Serial numbers per unit.",
      },
      {
        question: "Can we create job cards for customer repairs with estimated delivery dates?",
        answer: "Yes! Full repair service ticketing module with status SMS: 'Device Ready for Pickup'.",
      },
    ],
  },
  {
    slug: "apparel-footwear",
    title: "Apparel, Clothing & Footwear",
    shortName: "Apparel & Footwear",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "SIZE-COLOR-FIT MATRIX & BARCODES",
    headline: "Size-Color-Fit Matrix, Barcode Printing & Promotional Schemes",
    tagline: "Manage apparel fashion inventory across sizes, colors, and brands, print custom garment tags, run 'Buy 2 Get 1' promotional offers, and handle trial room hold bills.",
    description: "Purpose-built for clothing boutiques, shoe stores, fashion chains, and ethnic wear showrooms requiring multi-variant matrix stock and promotional discount engines.",
    iconSvg: "apparel-footwear",
    accentColor: "#6451f1",
    bgGradient: "from-rose-950 via-slate-900 to-slate-950",
    keyFeatures: [
      {
        title: "Size-Color-Fit Matrix Variant Grid",
        description: "Manage 1 shirt design across sizes (S, M, L, XL, XXL) and colors (Blue, Black, White) on 1 master SKU.",
        badge: "Size Matrix",
      },
      {
        title: "Custom Garment Barcode Price Tag Printing",
        description: "Print branded price tags with your logo, style code, size, MRP, and scannable barcode.",
        badge: "Barcode Tags",
      },
      {
        title: "Promotional 'Buy 2 Get 1' & % Discount Schemes",
        description: "Auto-apply seasonal promotional schemes, flat discounts, and bill-value coupons at checkout.",
        badge: "Discounts",
      },
      {
        title: "Trial Room Hold-Bill & Fast Recall",
        description: "Hold bills while customers try more clothes; instantly recall cart when they reach the billing desk.",
        badge: "Hold Bill",
      },
      {
        title: "Slow Moving & Dead Stock Aging Reports",
        description: "Identify non-selling fashion items after 60/90 days to launch clearance sales before season ends.",
        badge: "Stock Aging",
      },
      {
        title: "Exchange & Return Credit Notes in 1 Click",
        description: "Process size exchange or generate store credit vouchers instantly without accounting headaches.",
        badge: "Credit Notes",
      },
    ],
    appCapabilities: [
      {
        title: "Festive Multi-Counter Billing",
        description: "Deploy extra billing terminals on laptops and tablets during Diwali & Eid rush.",
        tag: "Festive Rush",
      },
      {
        title: "100% Offline SQLite Core",
        description: "Operates 100% locally with instant checkout speed even in basement boutique locations.",
        tag: "Zero Downtime",
      },
      {
        title: "WhatsApp Loyalty Vouchers",
        description: "Send personalized birthday discount coupons directly to customer WhatsApp automatically.",
        tag: "VIP Marketing",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Customer Selects 3 Garments", detail: "Cashier scans barcode tags on Cotton Shirt (L-Blue) and Denim Jeans (32)." },
      { step: "02", title: "Auto Festive Discount Applied", detail: "System auto-applies 'Buy 2 Get 10% Off' festive promotional discount." },
      { step: "03", title: "Instant Thermal Receipt & VIP Points", detail: "Customer pays ₹2,499 via UPI; receives digital bill + ₹120 loyalty reward points." },
    ],
    metrics: [
      { label: "Inventory Audit", value: "85% Faster", subtext: "Via barcode tag scanner audit" },
      { label: "Festive Checkout", value: "3x Faster", subtext: "Zero trial room queue bottlenecks" },
      { label: "Repeat Sales", value: "+38% Growth", subtext: "Via personalized WhatsApp coupons" },
    ],
    testimonial: {
      quote: "Managing size and color variants used to be a mess in our boutique. SaaSzo's matrix grid and custom barcode tag printing made stock audits effortless.",
      author: "Radhika Mehra",
      business: "Vogue Trends Fashion Boutique",
      location: "Jaipur, Rajasthan",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I print barcode hang tags for clothing with our own shop logo?",
        answer: "Yes! SaaSzo supports barcode tag printers to print professional price tags with size, color, and MRP.",
      },
      {
        question: "Does it support complex discount schemes like 'Buy 2 Get 1 Free'?",
        answer: "Yes! Configurable promotional discount engine auto-applies offers at checkout automatically.",
      },
    ],
  },
  {
    slug: "services-agencies",
    title: "Services, Consultancies & Digital Agencies",
    shortName: "Services & Agencies",
    categoryGroup: "retail_wholesale",
    categoryGroupLabel: "Retail & Supply Chain",
    heroBadge: "QUOTATIONS, RETAINERS & GST INVOICING",
    headline: "Estimates to Invoices, Monthly Retainers & TDS Calculations",
    tagline: "Convert project quotations to tax invoices in 1 click, automate recurring monthly client retainers, calculate TDS/RCM, and accept instant UPI & bank payments.",
    description: "Tailor-made for IT companies, digital marketing agencies, legal & accounting consultancies, freelancers, and B2B service providers.",
    iconSvg: "services-agencies",
    accentColor: "#6451f1",
    bgGradient: "from-slate-950 via-indigo-950 to-slate-950",
    keyFeatures: [
      {
        title: "1-Click Quotation / Estimate to Tax Invoice",
        description: "Create professional client proposals; convert approved estimates to GST invoices with 1 tap.",
        badge: "Estimates",
      },
      {
        title: "Automated Monthly / Quarterly Retainer Billing",
        description: "Set up auto-recurring invoices for retainers; system sends PDF bills on the 1st of every month.",
        badge: "Auto Retainers",
      },
      {
        title: "SAC Service Codes & TDS / RCM Computations",
        description: "Accurate Service Accounting Codes (SAC 9983) with TDS deduction tracking and Reverse Charge.",
        badge: "SAC / TDS",
      },
      {
        title: "Milestone & Advance Payment Receipts",
        description: "Record 50% advance deposit and issue project milestone invoices with clear balance dues.",
        badge: "Milestones",
      },
      {
        title: "Professional PDF Invoices with Bank QR",
        description: "Clean modern PDF invoices with company letterhead, signature, bank account NEFT/RTGS, and UPI QR.",
        badge: "Branded PDF",
      },
      {
        title: "WhatsApp Payment Follow-Up Automation",
        description: "Send gentle polite payment reminder messages with attached PDF invoice and pay link.",
        badge: "Payment Links",
      },
    ],
    appCapabilities: [
      {
        title: "Multi-Currency Invoicing",
        description: "Bill international export clients in USD, EUR, GBP, AED with INR conversion rate tracking.",
        tag: "Export Ready",
      },
      {
        title: "Audit-Ready GSTR-1 Summaries",
        description: "Clean B2B and B2C service revenue reports ready for monthly CA tax filings.",
        tag: "CA Filing",
      },
      {
        title: "Client Payment Aging Reports",
        description: "Track 30/60/90 days outstanding receivables to maintain healthy cash flow.",
        tag: "Receivables",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Quotation Sent to Client", detail: "Agency generates ₹75,000 Website Development proposal with SAC code." },
      { step: "02", title: "Approved -> Converted to Invoice", detail: "Client approves -> 1-click converts to official Tax Invoice with 50% advance receipt." },
      { step: "03", title: "Milestone Paid via Bank Transfer", detail: "Client pays via NEFT/UPI; receipt voucher generated automatically." },
    ],
    metrics: [
      { label: "Payment Time", value: "80% Faster", subtext: "Via automated WhatsApp retainers" },
      { label: "Admin Overhead", value: "Zero Hours", subtext: "1-Click estimate to invoice conversion" },
      { label: "TDS Reconciliation", value: "100% Matched", subtext: "Automated TDS deduction ledgers" },
    ],
    testimonial: {
      quote: "Generating recurring client retainers and tracking TDS deductions used to take 2 days every month. SaaSzo automated our retainer invoicing completely.",
      author: "Arjun Nambiar",
      business: "Pixel & Code Digital Agency",
      location: "Gurugram, Haryana",
      rating: "5.0",
    },
    faqs: [
      {
        question: "Can I generate recurring invoices automatically on the 1st of every month?",
        answer: "Yes! Recurring retainer invoices are automatically generated and emailed/WhatsApped to clients.",
      },
      {
        question: "Does it support export invoices in foreign currency (USD, EUR)?",
        answer: "Yes! Full export of services invoicing with LUT (Letter of Undertaking) and currency conversion.",
      },
    ],
  },
];

export function getIndustryBySlug(slug: string): IndustrySolution | undefined {
  return INDUSTRY_SOLUTIONS.find((ind) => ind.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return INDUSTRY_SOLUTIONS.map((ind) => ind.slug);
}

export const RESTAURANT_INDUSTRIES = INDUSTRY_SOLUTIONS.filter(
  (ind) => ind.categoryGroup === "restaurant"
);

export const RETAIL_WHOLESALE_INDUSTRIES = INDUSTRY_SOLUTIONS.filter(
  (ind) => ind.categoryGroup === "retail_wholesale"
);

