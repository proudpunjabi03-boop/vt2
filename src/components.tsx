import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router"
import {
  articles,
  images,
  venues,
  venuePath,
  type Article,
  type Booking,
  type Venue,
} from "./content"

type AppState = {
  bookings: Booking[]
  saved: string[]
  save: (id: string) => void
  book: (booking: Booking) => void
  cancel: (id: string) => void
  notify: (text: string) => void
}
const AppContext = createContext<AppState | null>(null)
export const usePlatform = () => useContext(AppContext)!
function readLocal<T extends unknown[]>(key: string, fallback: T): T {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null")
    return Array.isArray(parsed) ? parsed as T : fallback
  } catch {
    return fallback
  }
}

function Icon({ name = "arrow", size = 20 }: { name?: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    bolt: <path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    menu: <path d="M4 7h16M4 16h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    food: <path d="M4 3v6c0 3 6 3 6 0V3M7 3v18M18 3c-4 5-4 9 0 9V3v18" />,
    bed: (
      <>
        <path d="M3 18V8m18 10V8M3 15h18M3 10h18M7 10V6h10v4" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-3 5-5 3 3-5Z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    check: <path d="m5 12 4 4 10-10" />,
    map: <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15" />,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.arrow}
    </svg>
  )
}
function Wordmark() {
  return (
    <span className="brand">
      VOLT<span>STOPS</span>
      <i>↗</i>
    </span>
  )
}
const navigation = [
  ["Explore", "/explore"],
  ["Chargers", "/chargers"],
  ["Plan a Trip", "/plan"],
  ["Dine & Charge", "/restaurants"],
  ["Hotels", "/hotels"],
  ["Journal", "/journal"],
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", close)
    }
  }, [open])
  return (
    <header
      className={`navigation ${
        scrolled || location.pathname !== "/" ? "solid" : ""
      } ${open ? "menu-open" : ""}`}
    >
      <Link to="/" aria-label="VoltStops home">
        <Wordmark />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(([label, path]) => (
          <NavLink key={path} to={path}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Link className="nav-button" to="/chargers">
        Find a charger <Icon name="bolt" size={15} />
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          {navigation.map(([label, path], index) => (
            <Link key={path} to={path}>
              <small>0{index + 1}</small>
              {label}
              <Icon />
            </Link>
          ))}
          <p>PLUG IN DINE OUT.</p>
        </nav>
      )}
    </header>
  )
}

function Metadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const article = articles.find(
      (entry) => pathname === `/journal/${entry.slug}`,
    )
    const venue = venues.find((entry) => pathname === venuePath(entry))
    const label =
      pathname === "/"
        ? "Charge. Dine. Explore."
        : article?.title || venue?.name || pathname.slice(1).replace(/-/g, " ")
    document.title = `${label} | VOLTSTOPS`
    const description =
      article?.description ||
      venue?.description ||
      "A considered EV journey. Discover charging, dining, stays and places worth stopping for with VoltStops. Demo platform; live services are not connected."
    const setMeta = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name"
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement("meta")
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute("content", content)
    }
    setMeta("description", description)
    setMeta("og:title", document.title, true)
    setMeta("og:description", description, true)
    setMeta("og:type", article ? "article" : "website", true)
    setMeta(
      "og:image",
      new URL(
        article?.image || venue?.image || images.night,
        window.location.origin,
      ).href,
      true,
    )
    setMeta("og:url", window.location.href, true)
    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", document.title)
    setMeta("twitter:description", description)
    setMeta(
      "twitter:image",
      new URL(
        article?.image || venue?.image || images.night,
        window.location.origin,
      ).href,
    )
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.setAttribute("rel", "canonical")
      document.head.appendChild(canonical)
    }
    canonical.setAttribute("href", `${window.location.origin}${pathname}`)
    const schema = document.createElement("script")
    schema.type = "application/ld+json"
    const graph: object[] = [
      {
        "@type": "Organization",
        name: "VoltStops",
        url: window.location.origin,
        slogan: "PLUG IN DINE OUT.",
        founder: { "@type": "Person", name: "Bhupinder Singh" },
        email: "info@voltstops.com",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: window.location.origin,
          },
          ...(pathname === "/"
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: label,
                  item: `${window.location.origin}${pathname}`,
                },
              ]),
        ],
      },
    ]
    if (article)
      graph.push({
        "@type": "Article",
        headline: article.title,
        description: article.description,
        image: new URL(article.image, window.location.origin).href,
        datePublished: article.publishedAt,
        author: { "@type": "Organization", name: article.author },
        mainEntityOfPage: `${window.location.origin}${pathname}`,
      })
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    })
    document.head.appendChild(schema)
    return () => {
      schema.remove()
    }
  }, [pathname])
  return null
}

function Newsletter() {
  const { notify } = usePlatform()
  return (
    <section className="newsletter">
      <div>
        <span className="eyebrow">A NOTE FROM THE ROAD</span>
        <h2>
          Better journeys.
          <br />
          <em>In your inbox.</em>
        </h2>
      </div>
      <div>
        <p>
          Field notes, thoughtful stops and a little inspiration for the next
          drive.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            notify(
              "Newsletter preview only. Your email has not been sent or saved.",
            )
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Your email address"
            required
          />
          <button aria-label="Preview newsletter subscription">
            <Icon />
          </button>
        </form>
        <small>
          Newsletter concept · no email subscription service connected.
        </small>
      </div>
    </section>
  )
}
function Footer() {
  const { notify } = usePlatform()
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <h2>
          Your next stop
          <br />
          <em>starts here.</em>
        </h2>
        <Link
          className="round-button"
          to="/plan"
          aria-label="Plan your next trip"
        >
          <Icon size={32} />
        </Link>
      </div>
      <div className="footer-grid">
        <div>
          <Link to="/">
            <Wordmark />
          </Link>
          <p>PLUG IN DINE OUT.</p>
          <small>
            Created for the journey.
            <br />
            Founded by Bhupinder Singh.
          </small>
        </div>
        <div>
          <span>THE JOURNEY</span>
          {navigation.slice(0, 4).map(([label, path]) => (
            <Link to={path} key={path}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <span>THE COMPANY</span>
          <Link to="/partners">Partners</Link>
          <Link to="/about">About</Link>
          <a href="mailto:info@voltstops.com">Contact</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <div>
          <span>STAY CONNECTED</span>
          <a
            href="https://www.instagram.com/volt_stops/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
          <button
            onClick={() =>
              notify("The VoltStops LinkedIn channel is not connected yet.")
            }
          >
            LinkedIn ↗
          </button>
          <button
            onClick={() =>
              notify("The VoltStops YouTube channel is not connected yet.")
            }
          >
            YouTube ↗
          </button>
          <a href="mailto:info@voltstops.com">info@voltstops.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VOLTSTOPS</span>
        <span>
          Demo experience · listings, routes & reservations are illustrative.
        </span>
        <span>MADE FOR THE LONG WAY.</span>
      </div>
    </footer>
  )
}

function Shell() {
  const [bookings, setBookings] = useState<Booking[]>(() =>
    readLocal("voltstops-demo-bookings", []),
  )
  const [saved, setSaved] = useState<string[]>(() =>
    readLocal("voltstops-saved", []),
  )
  const [toast, setToast] = useState("")
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [location.pathname])
  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(""), 6000)
    return () => clearTimeout(timeout)
  }, [toast])
  const store = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      setToast(
        "Browser storage is unavailable. Changes last only for this session.",
      )
    }
  }
  const state: AppState = {
    bookings,
    saved,
    notify: setToast,
    save: (id) => {
      setSaved((current) => {
        const next = current.includes(id)
          ? current.filter((entry) => entry !== id)
          : [...current, id]
        store("voltstops-saved", next)
        return next
      })
    },
    book: (booking) => {
      setBookings((current) => {
        const next = [...current, booking]
        store("voltstops-demo-bookings", next)
        return next
      })
    },
    cancel: (id) => {
      setBookings((current) => {
        const next = current.filter((booking) => booking.id !== id)
        store("voltstops-demo-bookings", next)
        return next
      })
    },
  }
  return (
    <AppContext.Provider value={state}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Metadata />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Newsletter />
      <Footer />
      <nav className="bottom-nav" aria-label="Mobile quick navigation">
        {[
          ["Explore", "/explore", "compass"],
          ["Map", "/map", "map"],
          ["Plan", "/plan", "arrow"],
          ["Bookings", "/bookings", "clock"],
          ["Profile", "/profile", "user"],
        ].map(([label, path, icon]) => (
          <NavLink to={path} key={path}>
            <Icon name={icon} size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      {toast && (
        <div className="toast" role="status">
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </AppContext.Provider>
  )
}

function VenueCard({
  venue,
  compact = false,
}: {
  venue: Venue
  compact?: boolean
}) {
  const { saved, save } = usePlatform()
  return (
    <article className={`venue-card ${compact ? "compact" : ""}`}>
      <div className="venue-photo">
        <Link to={venuePath(venue)}>
          <img
            src={venue.image}
            alt={venue.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </Link>
        <span className="photo-badge">{venue.category}</span>
        <button
          className={`save-button ${saved.includes(venue.id) ? "saved" : ""}`}
          aria-label={`${
            saved.includes(venue.id) ? "Remove" : "Save"
          } ${venue.name}`}
          aria-pressed={saved.includes(venue.id)}
          onClick={() => save(venue.id)}
        >
          <Icon name="bookmark" size={18} />
        </button>
      </div>
      <div className="venue-meta">
        <span>
          <Icon name="pin" size={12} />
          {venue.location}
        </span>
        <span>{venue.speed ? `${venue.speed} kW` : "SCENIC STOP"}</span>
      </div>
      <h3>
        <Link to={venuePath(venue)}>{venue.name}</Link>
      </h3>
      <p>
        {venue.cuisine || venue.category} <span>·</span> {venue.distance}
      </p>
      <div className="venue-facts">
        <span>{venue.connectors.join(" / ") || "Destination idea"}</span>
        <span>Sample listing</span>
        <Link to={venuePath(venue)} aria-label={`View ${venue.name}`}>
          <Icon />
        </Link>
      </div>
    </article>
  )
}
function BlogCard({ article }: { article: Article }) {
  return (
    <article className="blog-card">
      <Link className="blog-image" to={`/journal/${article.slug}`}>
        <img src={article.image} alt={article.imageAlt} loading="lazy" />
      </Link>
      <div className="venue-meta">
        <span>{article.category}</span>
        <span>{article.readingTime}</span>
      </div>
      <h3>
        <Link to={`/journal/${article.slug}`}>{article.title}</Link>
      </h3>
      <p>{article.description}</p>
      <span className="article-credit">{article.author} · 03 OCT 2026</span>
    </article>
  )
}
function SectionHeading({
  label,
  title,
  description,
  link,
  linkText = "Explore all",
}: {
  label: string
  title: ReactNode
  description?: string
  link?: string
  linkText?: string
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{label}</span>
        <h2>{title}</h2>
      </div>
      <div>
        {description && <p>{description}</p>}
        {link && (
          <Link className="text-link" to={link}>
            {linkText}
            <Icon />
          </Link>
        )}
      </div>
    </div>
  )
}

function TripPlanner({ expanded = false }: { expanded?: boolean }) {
  const navigate = useNavigate()
  const [advanced, setAdvanced] = useState(expanded)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    navigate(
      `/plan?${new URLSearchParams(Array.from(data.entries()).map(([key, value]) => [key, String(value)])).toString()}`,
    )
  }
  return (
    <form
      className={`trip-search ${expanded ? "expanded" : ""}`}
      onSubmit={submit}
    >
      <div className="search-caption">
        <span className="eyebrow">WHERE ARE YOU GOING?</span>
        <span>Every good journey starts with a little curiosity.</span>
      </div>
      <div className="search-fields">
        <label>
          <span>FROM</span>
          <input
            name="from"
            placeholder="Starting point"
            defaultValue={expanded ? "Delhi" : ""}
            required
          />
        </label>
        <span className="route-arrow">
          <Icon />
        </span>
        <label>
          <span>TO</span>
          <input
            name="to"
            placeholder="Your next destination"
            defaultValue={expanded ? "Amritsar" : ""}
            required
          />
        </label>
        <label>
          <span>DEPARTURE</span>
          <input
            aria-label="Departure date"
            type="date"
            name="date"
            min={new Date().toLocaleDateString("en-CA")}
          />
        </label>
        <label>
          <span>YOUR EV</span>
          <select name="vehicle" defaultValue="Tata Nexon EV">
            <option>Tata Nexon EV</option>
            <option>MG ZS EV</option>
            <option>Hyundai Ioniq 5</option>
            <option>BYD Atto 3</option>
            <option>Other EV</option>
          </select>
        </label>
        <button className="button lime" type="submit">
          Plan journey <Icon />
        </button>
      </div>
      <div className="search-bottom">
        <span>
          <Icon name="bolt" size={13} /> Charging. Food. A little discovery.
        </span>
        <button
          type="button"
          onClick={() => setAdvanced(!advanced)}
          aria-expanded={advanced}
        >
          {advanced ? "Fewer" : "More"} preferences {advanced ? "−" : "+"}
        </button>
      </div>
      {advanced && (
        <div className="advanced-fields">
          <label>
            Battery %
            <input
              type="number"
              name="battery"
              min="1"
              max="100"
              defaultValue="80"
              required
            />
          </label>
          <label>
            Arrival battery %
            <input
              type="number"
              name="arrival"
              min="5"
              max="90"
              defaultValue="20"
              required
            />
          </label>
          <label>
            Charging preference
            <select name="charging">
              <option>Fast charging</option>
              <option>Destination charging</option>
              <option>Any compatible charger</option>
            </select>
          </label>
          <label>
            Maximum stops
            <select name="stops">
              <option>2</option>
              <option>1</option>
              <option>3</option>
              <option>4</option>
            </select>
          </label>
          <label>
            Dining preference
            <select name="dining">
              <option>Local & Punjabi</option>
              <option>Café</option>
              <option>Vegetarian</option>
              <option>No dining preference</option>
            </select>
          </label>
          <label>
            Stay preference
            <select name="stay">
              <option>No overnight stay</option>
              <option>Boutique hotel</option>
              <option>Family stay</option>
            </select>
          </label>
        </div>
      )}
      <small className="concept-label">
        PLANNER PREVIEW · ROUTES & CHARGING ESTIMATES ARE NOT LIVE
      </small>
    </form>
  )
}

function JourneyMap({
  selected,
  onSelect,
  stops = venues.slice(0, 4),
}: {
  selected: string
  onSelect: (id: string) => void
  stops?: Venue[]
}) {
  return (
    <div className="journey-map">
      <div className="map-top">
        <span>THE NORTHBOUND JOURNEY</span>
        <span>ILLUSTRATIVE MAP · NOT FOR NAVIGATION</span>
      </div>
      <svg
        className="map-art"
        viewBox="0 0 800 600"
        role="img"
        aria-label="Illustrative route diagram from Delhi through Haryana and Punjab"
      >
        <defs>
          <pattern
            id="map-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M60 0H0V60"
              fill="none"
              stroke="#c9c8bc"
              strokeWidth=".5"
            />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#map-grid)" />
        <path
          className="map-river"
          d="M610-20C560 90 680 140 610 250S540 410 650 620"
        />
        <path
          className="map-road"
          d="M-10 450 290 320 470 250 800 100M80 0 270 180 480 360 660 600M-10 120 360 130 800 400"
        />
        <path
          className="map-route"
          d="M425 525C450 435 370 390 330 295S410 220 375 150 300 130 340 70"
        />
        <text x="430" y="565">
          DELHI
        </text>
        <text x="440" y="418">
          KARNAL
        </text>
        <text x="220" y="310">
          AMBALA
        </text>
        <text x="430" y="187">
          LUDHIANA
        </text>
        <text x="250" y="52">
          AMRITSAR
        </text>
        <text x="70" y="220" className="region-label">
          PUNJAB
        </text>
        <text x="110" y="480" className="region-label">
          HARYANA
        </text>
        <text x="615" y="260" className="region-label">
          THE FOOTHILLS
        </text>
        <circle cx="425" cy="525" r="8" fill="#171716" />
      </svg>
      <div className="map-pins">
        {stops.map((venue, index) => (
          <button
            key={venue.id}
            className={`map-pin pin-${index} ${
              selected === venue.id ? "selected" : ""
            }`}
            aria-label={`Show ${venue.name}`}
            aria-pressed={selected === venue.id}
            onClick={() => onSelect(venue.id)}
          >
            <Icon
              name={
                venue.kind === "hotel"
                  ? "bed"
                  : venue.kind === "restaurant"
                    ? "food"
                    : "bolt"
              }
              size={18}
            />
          </button>
        ))}
      </div>
      <span className="map-scale">
        0 ───── 50 KM <small>SCHEMATIC</small>
      </span>
    </div>
  )
}

function BookingModal({ venue, close }: { venue: Venue; close: () => void }) {
  const [step, setStep] = useState(1)
  const [details, setDetails] = useState({
    date: "",
    time: "12:00",
    connector: venue.connectors[0] || "CCS2",
  })
  const { book } = usePlatform()
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    const prior = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", listener)
    const timer = setTimeout(
      () => document.getElementById("booking-close")?.focus(),
      0,
    )
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = prior
      window.removeEventListener("keydown", listener)
    }
  }, [close])
  const finish = () => {
    book({
      id: crypto.randomUUID(),
      venueId: venue.id,
      ...details,
      status: "demo",
    })
    setStep(3)
  }
  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button, a, input, select",
            ),
          )
          const first = focusable[0]
          const last = focusable.at(-1)
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
      >
        <button
          id="booking-close"
          className="modal-close"
          aria-label="Close reservation preview"
          onClick={close}
        >
          <Icon name="close" />
        </button>
        <span className="eyebrow">RESERVATION PREVIEW · 0{step} / 03</span>
        <h2 id="booking-title">
          {step === 3
            ? "A stop to look forward to."
            : "Make time for a better stop."}
        </h2>
        <p>
          {venue.name} · {venue.speed} kW
        </p>
        <div className="demo-banner">
          Demo only. No charger is reserved, no payment is taken and
          availability is not verified.
        </div>
        {step === 1 && (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const selectedTime = new Date(`${details.date}T${details.time}`)
              if (selectedTime <= new Date()) {
                event.currentTarget
                  .querySelector("input")
                  ?.setCustomValidity("Choose a future date and time.")
                event.currentTarget.reportValidity()
                return
              }
              setStep(2)
            }}
          >
            <label>
              Date
              <input
                type="date"
                required
                min={new Date().toLocaleDateString("en-CA")}
                value={details.date}
                onChange={(event) => {
                  event.target.setCustomValidity("")
                  setDetails({ ...details, date: event.target.value })
                }}
              />
            </label>
            <label>
              Time
              <input
                type="time"
                required
                value={details.time}
                onChange={(event) => {
                  event.currentTarget.form
                    ?.querySelector("input")
                    ?.setCustomValidity("")
                  setDetails({ ...details, time: event.target.value })
                }}
              />
            </label>
            <label>
              Connector
              <select
                value={details.connector}
                onChange={(event) =>
                  setDetails({ ...details, connector: event.target.value })
                }
              >
                {venue.connectors.map((connector) => (
                  <option key={connector}>{connector}</option>
                ))}
              </select>
            </label>
            <button className="button dark">
              Review demo stop <Icon />
            </button>
          </form>
        )}
        {step === 2 && (
          <div className="booking-review">
            <p>
              {details.date} at {details.time}
              <br />
              {details.connector} · Sample rate {venue.price}
            </p>
            <p>
              Final costs, compatibility and availability must be confirmed with
              a real operator.
            </p>
            <button className="button dark" onClick={finish}>
              Save demo reservation <Icon name="check" />
            </button>
            <button className="text-link" onClick={() => setStep(1)}>
              Edit details
            </button>
          </div>
        )}
        {step === 3 && (
          <>
            <p>Your demo reservation is saved in this browser only.</p>
            <Link className="button dark" to="/bookings" onClick={close}>
              View demo bookings <Icon />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default {
  Icon,
  Wordmark,
  Shell,
  Navbar,
  Footer,
  Newsletter,
  VenueCard,
  BlogCard,
  SectionHeading,
  TripPlanner,
  JourneyMap,
  BookingModal,
}
