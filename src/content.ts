import night from "./assets/night-charge.webp"
import road from "./assets/india-road.webp"
import pool from "./assets/hotel-pool.webp"
import plug from "./assets/ev-plug-in.webp"
import cable from "./assets/ev-charging-closeup.webp"
import table from "./assets/luxury-dining.webp"
import forest from "./assets/forest-journey.webp"

export const images = { night, road, pool, plug, cable, table, forest }
export type VenueKind = "charger" | "restaurant" | "hotel" | "destination"
export interface Venue {
  id: string
  slug: string
  kind: VenueKind
  name: string
  location: string
  region: string
  image: string
  imageAlt: string
  description: string
  category: string
  speed: number
  connectors: string[]
  amenities: string[]
  distance: string
  price: string
  hours: string
  address: string
  ports: number
  cuisine?: string
  rooms?: string[]
  menu?: { name: string; price: string }[]
  coordinates: { x: number; y: number }
  sample: true
}
export interface Article {
  id: string
  slug: string
  title: string
  category: string
  description: string
  image: string
  imageAlt: string
  author: string
  publishedAt: string
  readingTime: string
  quote: string
  sections: { heading: string; paragraphs: string[] }[]
}
export interface Booking {
  id: string
  venueId: string
  date: string
  time: string
  connector: string
  status: "demo"
}
export interface Review {
  id: string
  venueId: string
  authorId: string
  rating: number
  body: string
  verified: boolean
}
export interface Partner {
  id: string
  businessName: string
  kind: string
  email: string
  status: "pending" | "approved"
}
export interface Journey {
  from: string
  to: string
  vehicle: string
  battery: number
  arrival: number
  stopIds: string[]
}

export const venues: Venue[] = [
  {
    id: "v1",
    slug: "the-highway-table",
    kind: "restaurant",
    name: "The Highway Table",
    location: "Karnal, Haryana",
    region: "Haryana",
    image: table,
    imageAlt: "A softly lit restaurant terrace at dusk",
    category: "Dine & charge",
    description:
      "A long lunch, a little local flavour, and a quieter kind of highway pause. This sample destination brings Punjabi cooking and a charging stop together.",
    speed: 150,
    connectors: ["CCS2"],
    amenities: ["Food", "Parking", "Restrooms", "Family friendly", "Wi-Fi"],
    distance: "2.4 km from route",
    price: "₹18 / kWh",
    hours: "08:00 – 23:00",
    address: "Illustrative location · NH44 corridor, Karnal",
    ports: 2,
    cuisine: "Punjabi · North Indian",
    menu: [
      { name: "Tandoori paneer & seasonal greens", price: "₹420" },
      { name: "Dal makhani with fresh naan", price: "₹360" },
      { name: "Masala chai", price: "₹90" },
    ],
    coordinates: { x: 48, y: 64 },
    sample: true,
  },
  {
    id: "v2",
    slug: "northbound-charge",
    kind: "charger",
    name: "Northbound Charge",
    location: "Ambala, Haryana",
    region: "Haryana",
    image: night,
    imageAlt:
      "An electric car plugged into an illuminated charging station at night",
    category: "DC fast charging",
    description:
      "A sample fast-charging stop for a northbound journey. Stretch your legs, take a coffee break, and get ready for the next stretch.",
    speed: 180,
    connectors: ["CCS2"],
    amenities: ["Parking", "Restrooms", "Food", "Wi-Fi"],
    distance: "0.8 km from route",
    price: "₹20 / kWh",
    hours: "24 hours",
    address: "Illustrative location · NH44 corridor, Ambala",
    ports: 4,
    coordinates: { x: 41, y: 48 },
    sample: true,
  },
  {
    id: "v3",
    slug: "the-orchard-retreat",
    kind: "hotel",
    name: "The Orchard Retreat",
    location: "Patiala, Punjab",
    region: "Punjab",
    image: pool,
    imageAlt: "A peaceful hotel swimming pool framed by patio umbrellas",
    category: "Stay & recharge",
    description:
      "A sample boutique stay imagined for slower journeys. A poolside afternoon, an unhurried breakfast, and overnight destination charging.",
    speed: 22,
    connectors: ["Type 2"],
    amenities: [
      "Parking",
      "Wi-Fi",
      "Food",
      "Pet friendly",
      "Family friendly",
      "Restrooms",
    ],
    distance: "12 km from route",
    price: "Rooms from ₹6,500 · sample",
    hours: "Check-in 14:00 · check-out 11:00",
    address: "Illustrative location · Patiala countryside",
    ports: 2,
    rooms: ["Garden room · sample ₹6,500", "Courtyard suite · sample ₹9,000"],
    coordinates: { x: 28, y: 38 },
    sample: true,
  },
  {
    id: "v4",
    slug: "fieldnotes-cafe",
    kind: "restaurant",
    name: "Fieldnotes Café",
    location: "Ludhiana, Punjab",
    region: "Punjab",
    image: plug,
    imageAlt:
      "An electric vehicle being plugged in beside greenery in warm sunlight",
    category: "Coffee & a little charge",
    description:
      "Good coffee and a moment away from the road. An illustrative café stop with destination charging and space to sit outside.",
    speed: 60,
    connectors: ["CCS2", "Type 2"],
    amenities: ["Food", "Wi-Fi", "Pet friendly", "Parking", "Restrooms"],
    distance: "1.6 km from route",
    price: "₹16 / kWh",
    hours: "07:00 – 21:00",
    address: "Illustrative location · Ludhiana outskirts",
    ports: 2,
    cuisine: "Café · Continental",
    menu: [
      { name: "Flat white", price: "₹190" },
      { name: "Sourdough toast & eggs", price: "₹320" },
    ],
    coordinates: { x: 47, y: 28 },
    sample: true,
  },
  {
    id: "v5",
    slug: "the-scenic-detour",
    kind: "destination",
    name: "The Scenic Detour",
    location: "Himachal foothills",
    region: "Himachal Pradesh",
    image: road,
    imageAlt: "A winding Indian mountain road beside green hills",
    category: "Nature & the open road",
    description:
      "A destination idea, not a verified attraction: take a little time for mountain views and a slower stretch of road. Check local conditions before you leave.",
    speed: 0,
    connectors: [],
    amenities: ["Parking", "Family friendly"],
    distance: "A little off the usual route",
    price: "Access conditions unverified",
    hours: "Check local access",
    address: "Illustrative destination · Himachal foothills",
    ports: 0,
    coordinates: { x: 74, y: 23 },
    sample: true,
  },
  {
    id: "v6",
    slug: "saanjh-highway-dhaba",
    kind: "restaurant",
    name: "Saanjh Highway Dhaba",
    location: "Rajpura, Punjab",
    region: "Punjab",
    image: table,
    imageAlt: "Warmly illuminated outdoor dining tables",
    category: "Dhaba · Dine & charge",
    description:
      "A sample stop inspired by the everyday pleasure of a Punjabi highway meal: hot rotis, seasonal sabzi, and chai before the road calls again.",
    speed: 60,
    connectors: ["CCS2"],
    amenities: ["Food", "Parking", "Restrooms", "Family friendly"],
    distance: "0.5 km from route",
    price: "₹16 / kWh",
    hours: "06:00 – 23:00",
    address: "Illustrative location · Rajpura highway corridor",
    ports: 2,
    cuisine: "Dhaba · Punjabi",
    menu: [
      { name: "Punjabi thali", price: "₹280" },
      { name: "Aloo paratha & curd", price: "₹160" },
    ],
    coordinates: { x: 35, y: 43 },
    sample: true,
  },
]

const articleSections = [
  {
    heading: "Start with the journey, not the charger",
    paragraphs: [
      "A good road trip begins with the places you want to see and the people you want to see them with. Charging belongs in that plan, but it need not become the entire itinerary.",
      "Before setting off, check your vehicle’s usable range, connector compatibility and charging limits. Weather, traffic, elevation and luggage can all change how far a battery takes you. Leave a sensible margin rather than building a route around an optimistic range figure.",
    ],
  },
  {
    heading: "Make the pause worth taking",
    paragraphs: [
      "A charging stop can also be lunch, a short walk or a quiet coffee. Look beyond the power rating and ask what the location offers: clean restrooms, safe parking, opening hours and food that suits your group.",
      "A high advertised charging speed is not a promise of what your car will receive. Battery temperature, state of charge, charger sharing and your vehicle’s limits all matter. Confirm current conditions directly with the operator.",
    ],
  },
  {
    heading: "Keep a second option",
    paragraphs: [
      "Have an alternative station within a comfortable reach. A connector can be occupied or unavailable, and a restaurant can close earlier than expected. A flexible plan makes these changes less stressful.",
      "Download the information you need before you leave, carry a suitable charging cable if your vehicle requires one, and make sure the operator’s payment method works for you. The best journeys leave room for a little uncertainty.",
    ],
  },
]
export const articles: Article[] = [
  {
    id: "a1",
    slug: "the-future-of-the-ev-road-trip",
    title: "The future of the EV road trip",
    category: "EV travel",
    description:
      "Less waiting for the battery. More making something of the moment.",
    image: road,
    imageAlt: "An open road winding through Indian mountain scenery",
    author: "VoltStops Editorial",
    publishedAt: "2026-10-03",
    readingTime: "3 min read",
    quote: "The best stop is the one you would have wanted to make anyway.",
    sections: articleSections,
  },
  {
    id: "a2",
    slug: "charge-eat-repeat",
    title: "Charge, eat, repeat.",
    category: "Highway stories",
    description: "Why a good meal belongs in the middle of a great drive.",
    image: table,
    imageAlt: "A restaurant terrace glowing at dusk",
    author: "VoltStops Editorial",
    publishedAt: "2026-10-03",
    readingTime: "3 min read",
    quote: "The road is better when you give yourself permission to stop.",
    sections: [
      {
        heading: "A table changes the pace",
        paragraphs: [
          "A meal gives a road trip a natural rhythm. Instead of watching a charging percentage tick upwards, choose a place where you can sit comfortably, drink some water and enjoy the time away from the wheel.",
          "Check restaurant hours independently from charger hours. An overnight charger may be accessible when the kitchen is closed. If you are travelling with family, confirm restroom access and safe parking before choosing your stop.",
        ],
      },
      ...articleSections.slice(1),
    ],
  },
  {
    id: "a3",
    slug: "delhi-to-amritsar-by-ev",
    title: "Northbound, with time to spare.",
    category: "Destination guides",
    description: "Thinking through an EV drive from Delhi to Amritsar.",
    image: forest,
    imageAlt: "A road weaving through green forest",
    author: "VoltStops Editorial",
    publishedAt: "2026-10-03",
    readingTime: "3 min read",
    quote: "Build a little breathing room into the itinerary.",
    sections: [
      {
        heading: "The NH44 journey",
        paragraphs: [
          "Delhi to Amritsar follows one of north India’s familiar highway corridors, passing the Karnal, Ambala and Ludhiana regions. Your exact distance and duration depend on departure point, traffic and the route you choose.",
          "This guide is a planning introduction, not a verified station itinerary. Use current navigation, check operator apps and identify backup charging locations before setting off.",
        ],
      },
      ...articleSections.slice(1),
    ],
  },
  {
    id: "a4",
    slug: "choosing-a-charger",
    title: "The right charger for the road ahead.",
    category: "EV guides",
    description:
      "Connectors, charging speeds and the details that actually matter.",
    image: cable,
    imageAlt: "A charging connector attached to a silver electric car",
    author: "VoltStops Editorial",
    publishedAt: "2026-10-03",
    readingTime: "3 min read",
    quote: "Compatibility first. Convenience next. A little margin, always.",
    sections: articleSections,
  },
]

export const venuePath = (venue: Venue) =>
  `/${venue.kind === "destination" ? "destination" : venue.kind}/${venue.slug}`
export const contentRepository = {
  listVenues: () => venues,
  getVenue: (slug: string) => venues.find((venue) => venue.slug === slug),
  listArticles: () => articles,
  getArticle: (slug: string) =>
    articles.find((article) => article.slug === slug),
}
