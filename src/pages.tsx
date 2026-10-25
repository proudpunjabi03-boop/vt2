import { useEffect, useState } from "react"
import { Link, useLocation, useParams, useSearchParams } from "react-router"
import UI, { usePlatform } from "./components"
import { contentRepository, images, venuePath, type Venue } from "./content"

const {
  Icon,
  VenueCard,
  BlogCard,
  SectionHeading,
  TripPlanner,
  JourneyMap,
  BookingModal,
} = UI
const venues = contentRepository.listVenues()
const articles = contentRepository.listArticles()
const heroStories = [
  {
    headline: (
      <>
        Charge.
        <br />
        Dine.
        <br />
        <em>Explore.</em>
      </>
    ),
    image: images.night,
    alt: "An electric vehicle charging beneath station lights at night",
    label: "THE ART OF A BETTER STOP",
    caption: "A little charge. A world of possibility.",
  },
  {
    headline: (
      <>
        Your journey
        <br />
        deserves
        <br />
        <em>better stops.</em>
      </>
    ),
    image: images.road,
    alt: "A winding Indian highway beneath green mountains",
    label: "TAKE THE LONG WAY",
    caption: "For the miles. And the moments between.",
  },
  {
    headline: (
      <>
        Turn charging
        <br />
        time into
        <br />
        <em>travel time.</em>
      </>
    ),
    image: images.table,
    alt: "A beautifully lit dining terrace at sunset",
    label: "PLUG IN DINE OUT.",
    caption: "Find a table worth taking your time at.",
  },
  {
    headline: (
      <>
        Discover
        <br />
        what’s along
        <br />
        <em>the way.</em>
      </>
    ),
    image: images.forest,
    alt: "An aerial view of a winding road through lush forest",
    label: "FOLLOW YOUR CURIOSITY",
    caption: "Not every discovery needs a detour.",
  },
]

function Hero() {
  const [slide, setSlide] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (
      !playing ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    const timer = setInterval(
      () => setSlide((current) => (current + 1) % 4),
      8000,
    )
    return () => clearInterval(timer)
  }, [playing])
  return (
    <section className="cinematic-hero" aria-label="The VoltStops journey">
      <div className="hero-image" key={slide}>
        <img
          src={heroStories[slide].image}
          alt={heroStories[slide].alt}
          fetchPriority={slide === 0 ? "high" : "auto"}
        />
        <div className="hero-shade" />
      </div>
      <div className="hero-topline">
        <span>PLUG IN DINE OUT.</span>
        <span>MADE FOR THE JOURNEY, NOT JUST THE DESTINATION.</span>
      </div>
      <div className="hero-content" key={`text-${slide}`}>
        <span className="eyebrow">
          <i className="status-dot" /> THE EV TRAVEL PLATFORM
        </span>
        <h1>{heroStories[slide].headline}</h1>
        <p>
          Find the right charger, the right stop, and everything worth
          discovering along the way.
        </p>
        <div className="hero-actions">
          <Link className="button light" to="/plan">
            Plan your journey <Icon />
          </Link>
          <Link className="button outline" to="/explore">
            Explore stops <Icon name="compass" size={17} />
          </Link>
        </div>
      </div>
      <div className="hero-side-note">
        <span>{heroStories[slide].label}</span>
        <p>{heroStories[slide].caption}</p>
        <small>
          PHOTOGRAPHY FOR THE JOURNEY
          <br />
          TEMPORARY EDITORIAL IMAGERY
        </small>
      </div>
      <div className="hero-bottom">
        <a href="#plan-start" className="scroll-cue">
          <span /> SCROLL TO EXPLORE
        </a>
        <div className="story-controls">
          {heroStories.map((story, index) => (
            <button
              key={story.label}
              className={slide === index ? "active" : ""}
              aria-label={`Show story ${index + 1}`}
              aria-pressed={slide === index}
              onClick={() => setSlide(index)}
            >
              <span>0{index + 1}</span>
              <i />
            </button>
          ))}
          <button
            className="play-control"
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? "Pause stories" : "Play stories"}
          >
            {playing ? "Ⅱ" : "▷"}
          </button>
        </div>
      </div>
    </section>
  )
}

function JourneyExperience() {
  const [selected, setSelected] = useState("v2")
  const selectedVenue = venues.find((venue) => venue.id === selected)!
  return (
    <section className="journey-section section-wrap">
      <SectionHeading
        label="05 / THE JOURNEY, CONNECTED"
        title={
          <>
            Plan the journey.
            <br />
            <em>Not just the charge.</em>
          </>
        }
        description="A little planning. A lot more possibility. See how charging, food and rest can fit into one considered journey."
        link="/plan"
        linkText="Shape your route"
      />
      <div className="journey-layout">
        <JourneyMap selected={selected} onSelect={setSelected} />
        <div className="journey-story">
          <span className="eyebrow">DELHI → AMRITSAR · SAMPLE ITINERARY</span>
          <h3>
            Northbound.
            <br />
            With time to spare.
          </h3>
          <div className="timeline">
            {venues.slice(0, 4).map((venue, index) => (
              <button
                key={venue.id}
                onClick={() => setSelected(venue.id)}
                aria-pressed={selected === venue.id}
                className={selected === venue.id ? "active" : ""}
              >
                <span>0{index + 1}</span>
                <div>
                  <small>
                    {venue.kind === "hotel"
                      ? "REST"
                      : venue.kind === "restaurant"
                        ? "DINE + CHARGE"
                        : "CHARGE"}
                  </small>
                  <strong>{venue.name}</strong>
                  <p>
                    {venue.location} · {venue.speed} kW
                  </p>
                </div>
                <Icon />
              </button>
            ))}
          </div>
          <Link className="text-link" to={venuePath(selectedVenue)}>
            Explore {selectedVenue.name}
            <Icon />
          </Link>
          <small className="concept-label">
            Schematic only. Not a navigable or optimized route.
          </small>
        </div>
      </div>
    </section>
  )
}

function PartnerSection({ full = false }: { full?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section
      className={`partner-section section-wrap ${full ? "partner-full" : ""}`}
    >
      <div className="partner-main">
        <span className="eyebrow">07 / GROW WITH THE JOURNEY</span>
        <h2>
          Turn your location
          <br />
          into a <em>destination.</em>
        </h2>
        <p>
          For charging operators, restaurants, hotels, cafés, dhabas and highway
          businesses. Put your place in the path of a better EV journey.
        </p>
        <div className="hero-actions">
          <Link className="button lime" to="/partners#partner-enquiry">
            Become a partner <Icon />
          </Link>
          <Link className="button outline" to="/partners#partner-enquiry">
            List your business <Icon />
          </Link>
        </div>
        <span className="partner-types">
          CPOs / RESTAURANTS / HOTELS / HIGHWAY STOPS
        </span>
      </div>
      <div className="partner-photo">
        <img
          src={images.plug}
          alt="An EV driver connecting a charger in warm sunlight"
          loading="lazy"
        />
        <span>GOOD LOCATIONS. BETTER CONNECTIONS.</span>
      </div>
      {full && (
        <>
          <div className="partner-explainer">
            <span className="eyebrow">A SHARED OPPORTUNITY</span>
            <h3>
              Power the journey.
              <br />
              We’ll help travellers discover it.
            </h3>
            <p>
              VoltStops is designed to connect charging operators with
              hospitality and highway hosts. Operators would install and run
              charging infrastructure; hosts would offer places to eat, rest or
              explore.
            </p>
            <p>
              Potential benefits include discovery, digital visibility and new
              customer visits. Bookings, reviews and live operator integrations
              are planned features, not currently connected services.
              Participation does not guarantee traffic or revenue.
            </p>
            <div className="partner-benefits">
              <span>01 · Charging infrastructure</span>
              <span>02 · Hospitality & dwell time</span>
              <span>03 · Travel discovery</span>
            </div>
          </div>
          <form
            id="partner-enquiry"
            className="partner-enquiry"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            <h3>Start a conversation.</h3>
            <label>
              Your name
              <input required name="name" placeholder="Full name" />
            </label>
            <label>
              Business name
              <input
                required
                name="business"
                placeholder="Your place or company"
              />
            </label>
            <label>
              Work email
              <input
                required
                type="email"
                name="email"
                placeholder="you@company.com"
              />
            </label>
            <label>
              Business type
              <select name="type">
                <option>Charging operator</option>
                <option>Restaurant / Café / Dhaba</option>
                <option>Hotel</option>
                <option>Highway destination</option>
              </select>
            </label>
            <button className="button lime">
              Preview enquiry <Icon />
            </button>
            <p role="status">
              {submitted
                ? "Preview complete. No details were sent or saved. Please contact info@voltstops.com to enquire."
                : "Demo form · no enquiry delivery or storage connected."}
            </p>
            <a href="mailto:info@voltstops.com">Contact info@voltstops.com ↗</a>
          </form>
        </>
      )}
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <div id="plan-start" className="floating-planner">
        <TripPlanner />
      </div>
      <section className="charging-section section-wrap">
        <SectionHeading
          label="01 / CHARGE, WITHOUT THE COMPROMISE"
          title={
            <>
              Charging
              <br />
              <em>made effortless.</em>
            </>
          }
          description="Find the right kind of charge, with somewhere worth spending the time. Less of an interruption. More of the journey."
          link="/chargers"
          linkText="Discover chargers"
        />
        <div className="charger-editorial">
          <div className="charger-feature">
            <Link to="/charger/northbound-charge">
              <img
                src={images.night}
                alt="An electric car connected to a night-time charging station"
                loading="lazy"
              />
            </Link>
            <div className="charger-feature-caption">
              <span>FAST CHARGING / AMBALA, HARYANA</span>
              <h3>
                A pause.
                <br />
                Not a compromise.
              </h3>
              <div>
                <span>
                  180 <small>kW DC · CCS2</small>
                </span>
                <Link
                  to="/charger/northbound-charge"
                  className="round-button"
                  aria-label="View Northbound Charge"
                >
                  <Icon />
                </Link>
              </div>
            </div>
            <span className="photo-note">
              SAMPLE STATION · LIVE STATUS NOT CONNECTED
            </span>
          </div>
          <div className="charger-list">
            {[
              [
                "Fast chargers",
                "For the road ahead.",
                "180 kW DC",
                "/charger/northbound-charge",
              ],
              [
                "Restaurant chargers",
                "A full battery. A good meal.",
                "150 kW DC",
                "/restaurant/the-highway-table",
              ],
              [
                "Hotel chargers",
                "Rest easy. Recharge slowly.",
                "22 kW AC",
                "/hotel/the-orchard-retreat",
              ],
              [
                "Destination chargers",
                "Stay for more than a charge.",
                "60 kW DC",
                "/restaurant/fieldnotes-cafe",
              ],
            ].map(([title, description, speed, path], index) => (
              <Link key={title} to={path}>
                <span className="list-number">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <small>{speed} · SAMPLE LISTING</small>
                </div>
                <Icon />
              </Link>
            ))}
            <p className="disclaimer">
              Compatibility, availability and prices must be confirmed with
              operators. These listings are demonstration content.
            </p>
          </div>
        </div>
      </section>
      <section className="dine-section">
        <div className="dine-image">
          <img
            src={images.table}
            alt="An intimate terrace with tables set for dinner at sunset"
            loading="lazy"
          />
          <span>02 / DINE & CHARGE</span>
        </div>
        <div className="dine-copy">
          <span className="eyebrow">
            GOOD FOOD. GOOD COMPANY. A LITTLE CHARGE.
          </span>
          <h2>
            Why just charge
            <br />
            when you can
            <br />
            <em>enjoy the stop?</em>
          </h2>
          <p>
            Find a table, not just a charging point. From a favourite dhaba to a
            café you haven’t discovered yet, make the pause part of the
            pleasure.
          </p>
          <Link to="/restaurants" className="button dark">
            Find your next table <Icon />
          </Link>
          <div className="dine-details">
            <span>
              THE HIGHWAY TABLE
              <small>Karnal, Haryana · Sample destination</small>
            </span>
            <span>
              150 kW<small>PUNJABI / NORTH INDIAN</small>
            </span>
          </div>
        </div>
      </section>
      <section className="explore-section section-wrap">
        <SectionHeading
          label="03 / A LITTLE OFF THE USUAL ROUTE"
          title={
            <>
              Don’t just
              <br />
              <em>follow the route.</em>
            </>
          }
          description="The view you didn’t expect. The café you’ll tell your friends about. The stay that turns a drive into a getaway."
          link="/explore"
          linkText="Explore along the way"
        />
        <div className="discovery-grid">
          <Link
            className="discovery-image discovery-large"
            to="/destination/the-scenic-detour"
          >
            <img
              src={images.road}
              alt="A winding mountain road surrounded by lush scenery in India"
              loading="lazy"
            />
            <span>
              <small>01 / EXPLORE</small>
              <strong>The scenic way.</strong>
              <p>Himachal foothills · Destination idea</p>
            </span>
            <Icon />
          </Link>
          <Link className="discovery-image" to="/hotel/the-orchard-retreat">
            <img
              src={images.pool}
              alt="A hotel pool with quiet sun loungers"
              loading="lazy"
            />
            <span>
              <small>02 / STAY</small>
              <strong>Let the day slow down.</strong>
              <p>Patiala, Punjab · Sample stay</p>
            </span>
            <Icon />
          </Link>
          <Link
            className="discovery-image discovery-wide"
            to="/restaurant/fieldnotes-cafe"
          >
            <img
              src={images.plug}
              alt="An EV being charged in natural sunlight beside greenery"
              loading="lazy"
            />
            <span>
              <small>03 / PAUSE</small>
              <strong>One more coffee. One more mile.</strong>
              <p>Ludhiana, Punjab · Sample café</p>
            </span>
            <Icon />
          </Link>
        </div>
      </section>
      <JourneyExperience />
      <section className="featured-section section-wrap">
        <SectionHeading
          label="06 / PLACES WITH A LITTLE MORE"
          title={
            <>
              Worth stopping <em>for.</em>
            </>
          }
          link="/explore"
          linkText="All destinations"
        />
        <div className="venue-grid">
          {[venues[0], venues[2], venues[5]].map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>
      <section className="brand-statement">
        <span className="eyebrow">ONE PLATFORM. THE WHOLE JOURNEY.</span>
        <h2>
          Charge. Dine.
          <br />
          <em>Rest. Explore.</em>
        </h2>
        <div>
          <p>
            Your battery needs a charge.
            <br />
            Your journey deserves a little more.
          </p>
          <span>
            NO INVENTED NUMBERS.
            <br />
            JUST A BETTER IDEA OF THE ROAD.
          </span>
        </div>
      </section>
      <PartnerSection />
      <section className="journal-section section-wrap">
        <SectionHeading
          label="08 / VOLTSTOPS JOURNAL"
          title={
            <>
              Stories for
              <br />
              <em>the road ahead.</em>
            </>
          }
          description="Field notes on electric travel, great stops, and the quiet art of taking your time."
          link="/journal"
          linkText="Read the journal"
        />
        <div className="journal-grid">
          {articles.slice(0, 3).map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  )
}

const allFilters = [
  "Fast charging",
  "Food",
  "Wi-Fi",
  "Restrooms",
  "Parking",
  "Pet friendly",
  "Family friendly",
]
function Explore() {
  const { pathname } = useLocation()
  const defaultKind =
    pathname === "/chargers"
      ? "Chargers"
      : pathname === "/restaurants"
        ? "Restaurants"
        : pathname === "/hotels"
          ? "Hotels"
          : "All stops"
  const [category, setCategory] = useState(defaultKind)
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("All regions")
  const [filters, setFilters] = useState<string[]>([])
  const [showMap, setShowMap] = useState(pathname === "/map")
  const [selected, setSelected] = useState("v1")
  useEffect(() => {
    setCategory(defaultKind)
    setShowMap(pathname === "/map")
  }, [pathname, defaultKind])
  const results = venues.filter(
    (venue) =>
      (category === "All stops" ||
        (category === "Chargers" && venue.speed > 0) ||
        (category === "Restaurants" && venue.kind === "restaurant") ||
        (category === "Hotels" && venue.kind === "hotel") ||
        (category === "Cafés" && venue.category.includes("Coffee")) ||
        (category === "Dhabas" && venue.category.includes("Dhaba")) ||
        (category === "Attractions" && venue.kind === "destination")) &&
      (region === "All regions" || venue.region === region) &&
      `${venue.name} ${venue.location} ${venue.category}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      filters.every((filter) =>
        filter === "Fast charging"
          ? venue.speed >= 60
          : venue.amenities.includes(filter),
      ),
  )
  return (
    <div className="inner-page">
      <section className="page-intro section-wrap">
        <span className="eyebrow">THE ROAD IS FULL OF POSSIBILITIES</span>
        <h1>
          {defaultKind === "Hotels" ? (
            <>
              Rest. Recharge.
              <br />
              <em>Stay a little longer.</em>
            </>
          ) : defaultKind === "Restaurants" ? (
            <>
              A good charge.
              <br />
              <em>A better table.</em>
            </>
          ) : defaultKind === "Chargers" ? (
            <>
              Power for
              <br />
              <em>the road ahead.</em>
            </>
          ) : (
            <>
              Find your
              <br />
              <em>next great stop.</em>
            </>
          )}
        </h1>
        <p>
          Discover charging, food, stays and something a little unexpected along
          the way.
        </p>
      </section>
      <section className="directory section-wrap">
        <div className="demo-banner">
          CURATED DEMO COLLECTION · Fictional listings with illustrative
          locations, prices and specifications. Photography is representational.
          No live availability.
        </div>
        <div className="directory-search">
          <label>
            <Icon name="search" />
            <input
              placeholder="Search a place, city or experience"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search stops"
            />
          </label>
          <select
            aria-label="Filter by region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option>All regions</option>
            <option>Punjab</option>
            <option>Haryana</option>
            <option>Himachal Pradesh</option>
          </select>
          <button
            className={`button ${showMap ? "dark" : "bordered"}`}
            onClick={() => setShowMap(!showMap)}
          >
            <Icon name="map" />
            {showMap ? "List view" : "Map view"}
          </button>
        </div>
        <div className="category-tabs">
          {[
            "All stops",
            "Chargers",
            "Restaurants",
            "Hotels",
            "Cafés",
            "Dhabas",
            "Attractions",
          ].map((label) => (
            <button
              key={label}
              aria-pressed={category === label}
              className={category === label ? "active" : ""}
              onClick={() => setCategory(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-row">
          {allFilters.map((filter) => (
            <button
              key={filter}
              className={filters.includes(filter) ? "selected" : ""}
              aria-pressed={filters.includes(filter)}
              onClick={() =>
                setFilters(
                  filters.includes(filter)
                    ? filters.filter((entry) => entry !== filter)
                    : [...filters, filter],
                )
              }
            >
              {filter}
              {filters.includes(filter) && " ✓"}
            </button>
          ))}
          {filters.length > 0 && (
            <button onClick={() => setFilters([])}>Clear filters</button>
          )}
        </div>
        <div className="results-caption">
          <span>{results.length} CONSIDERED STOPS</span>
          <span>YOUR NEXT STOP SHOULD BE WORTH THE DRIVE.</span>
        </div>
        {showMap && (
          <div className="directory-map">
            <JourneyMap
              selected={selected}
              onSelect={setSelected}
              stops={results}
            />
            {results.find((venue) => venue.id === selected) && (
              <VenueCard
                venue={results.find((venue) => venue.id === selected)!}
                compact
              />
            )}
          </div>
        )}
        <div className="venue-grid">
          {results.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="empty-state">
            <h2>A little too specific?</h2>
            <p>No demo stops match these filters. Try a wider search.</p>
            <button
              className="button dark"
              onClick={() => {
                setQuery("")
                setRegion("All regions")
                setFilters([])
                setCategory("All stops")
              }}
            >
              Reset search <Icon />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function Plan() {
  const [params] = useSearchParams()
  const hasPlan = params.has("from") && params.has("to")
  const { book, notify } = usePlatform()
  const corridorStops = venues.filter((venue) => venue.speed > 0)
  const [stage, setStage] =
    useState<"journey" | "results" | "charge" | "payment" | "confirmed">(
      hasPlan ? "results" : "journey",
    )
  const [from, setFrom] = useState(params.get("from") || "Chandigarh")
  const [to, setTo] = useState(params.get("to") || "Delhi")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Venue>(
    corridorStops.find((venue) => venue.id === "v2") || corridorStops[0],
  )
  const [energy, setEnergy] = useState(15)
  const [payment, setPayment] = useState("UPI app")
  const rate = Number(selected.price.match(/\d+/)?.[0] || 18)
  const amount = rate * energy
  const cities = [
    ["Chandigarh", "0 km"],
    ["Ambala", "55 km"],
    ["Kurukshetra", "100 km"],
    ["Karnal", "130 km"],
    ["Panipat", "170 km"],
    ["Delhi", "250 km"],
  ]
  const filteredStops = corridorStops.filter((venue) =>
    `${venue.name} ${venue.location} ${venue.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const chooseStop = (venue: Venue) => {
    setSelected(venue)
    setEnergy(venue.speed <= 22 ? 20 : 15)
    setStage("charge")
  }
  const finish = () => {
    book({
      id: `demo-${Date.now()}`,
      venueId: selected.id,
      date: new Date().toLocaleDateString("en-CA"),
      time: "14:30",
      connector: `${selected.connectors[0]} · ${energy} kWh demo`,
      status: "demo",
    })
    setStage("confirmed")
    notify("Demo charging slot saved in this browser. No payment was taken.")
  }
  const goBack = () => {
    if (stage === "results") setStage("journey")
    if (stage === "charge") setStage("results")
    if (stage === "payment") setStage("charge")
    if (stage === "confirmed") setStage("results")
  }
  return (
    <div className="inner-page corridor-page">
      <header className="corridor-hero section-wrap">
        <span className="eyebrow">VOLTSTOPS / PLUG IN. DINE OUT.</span>
        <h1>
          The road, <em>recharged.</em>
        </h1>
        <p>
          A demo journey planner for considered charging, memorable food and
          worthwhile pauses.
        </p>
      </header>
      <section className="corridor-shell section-wrap" aria-live="polite">
        <div className="corridor-topline">
          {stage !== "journey" ? (
            <button className="corridor-back" onClick={goBack}>
              <Icon name="arrow" size={16} /> Back
            </button>
          ) : (
            <span className="eyebrow">NH44 / SAMPLE CORRIDOR</span>
          )}
          <span>
            0
            {["journey", "results", "charge", "payment", "confirmed"].indexOf(
              stage,
            ) + 1}{" "}
            / 05
          </span>
        </div>

        {stage === "journey" && (
          <div className="corridor-panel journey-picker">
            <span className="eyebrow">START WITH THE ROAD</span>
            <h2>Plan your journey.</h2>
            <p>
              Choose a start and destination. We’ll reveal demo partner stops
              imagined along the way.
            </p>
            <fieldset>
              <legend>Starting from</legend>
              <div className="city-options">
                {cities.slice(0, 5).map(([city, distance]) => (
                  <button
                    key={city}
                    className={from === city ? "active" : ""}
                    onClick={() => setFrom(city)}
                  >
                    <strong>{city}</strong>
                    <span>{distance}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Going to</legend>
              <div className="city-options">
                {cities.slice(1).map(([city, distance]) => (
                  <button
                    key={city}
                    className={to === city ? "active" : ""}
                    onClick={() => setTo(city)}
                  >
                    <strong>{city}</strong>
                    <span>{distance}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="corridor-note">
              {corridorStops.length} curated demo stops · illustrative corridor
              only
            </div>
            <button
              className="button dark corridor-primary"
              disabled={from === to}
              onClick={() => setStage("results")}
            >
              Find charging stops <Icon />
            </button>
          </div>
        )}

        {stage === "results" && (
          <div className="corridor-panel">
            <span className="eyebrow">CHARGE / DINE / REST</span>
            <h2>Charging stops.</h2>
            <p>
              On the illustrative route from {from} to {to}. Live distance,
              status and navigation are not connected.
            </p>
            <label className="corridor-search">
              <Icon name="search" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, town or experience"
              />
            </label>
            <div className="corridor-filters" aria-label="Applied filters">
              <span>Fits my car</span>
              <span>Food on site</span>
              <span>Open now · unverified</span>
            </div>
            <span className="results-count">
              {filteredStops.length} DEMO STOPS
            </span>
            <div className="corridor-results">
              {filteredStops.map((venue, index) => (
                <article className="corridor-stop" key={venue.id}>
                  <div className="road-marker">
                    <small>NH44</small>
                    <strong>{12 + index * 43}</strong>
                    <span>km</span>
                  </div>
                  <div>
                    <span className="eyebrow">{venue.category}</span>
                    <h3>{venue.name}</h3>
                    <p>{venue.location}</p>
                    <div className="stop-tags">
                      <span>
                        {venue.speed} kW {venue.connectors[0]}
                      </span>
                      <span>
                        {venue.amenities.includes("Food")
                          ? "Food"
                          : "Travel pause"}
                      </span>
                    </div>
                    <div className="stop-status">
                      <span>
                        <i /> {venue.ports} sample points
                      </span>
                      <strong>{venue.price}</strong>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => chooseStop(venue)}
                    >
                      Configure demo stop <Icon />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {stage === "charge" && (
          <div className="corridor-panel charge-config">
            <span className="eyebrow">CHARGING STOP / DEMO</span>
            <h2>{selected.name}</h2>
            <p>{selected.location}</p>
            <div className="stop-summary">
              <div>
                <strong>{selected.speed} kW</strong>
                <span>{selected.connectors[0]}</span>
              </div>
              <div>
                <strong>{selected.ports}</strong>
                <span>sample points</span>
              </div>
              <div>
                <strong>{selected.price}</strong>
                <span>illustrative rate</span>
              </div>
            </div>
            <h3>Choose a charging point.</h3>
            <button className="connector-choice active">
              <span className="radio-dot" />
              <span>
                <strong>
                  {selected.connectors[0]} · {selected.speed} kW
                </strong>
                <small>Compatibility and status unverified</small>
              </span>
              <strong>{selected.price}</strong>
            </button>
            <button className="connector-choice" disabled>
              <span className="radio-dot" />
              <span>
                <strong>Alternative connector</strong>
                <small>Not configured for this demo vehicle</small>
              </span>
            </button>
            <h3>How much charge?</h3>
            <div className="energy-picker">
              <button
                aria-label="Reduce energy"
                onClick={() => setEnergy(Math.max(5, energy - 5))}
              >
                −
              </button>
              <div>
                <strong>{energy} kWh</strong>
                <span>Illustrative energy request</span>
              </div>
              <button
                aria-label="Increase energy"
                onClick={() => setEnergy(Math.min(80, energy + 5))}
              >
                +
              </button>
            </div>
            <div className="energy-presets">
              {[10, 20, 40].map((value) => (
                <button key={value} onClick={() => setEnergy(value)}>
                  {value} kWh
                </button>
              ))}
            </div>
            <div className="demo-banner">
              Estimated demo total: ₹{amount}. You pay only a real operator’s
              final metered amount; this preview does not reserve energy or
              guarantee price, speed or availability.
            </div>
            <button
              className="button dark corridor-primary"
              onClick={() => setStage("payment")}
            >
              Review demo payment <Icon />
            </button>
          </div>
        )}

        {stage === "payment" && (
          <div className="corridor-panel payment-panel">
            <span className="eyebrow">CHECKOUT PREVIEW / NO CHARGE</span>
            <h2>Review your slot.</h2>
            <div className="payment-summary">
              <h3>{selected.name}</h3>
              <p>{selected.location}</p>
              <dl>
                <div>
                  <dt>Slot</dt>
                  <dd>Today, 2:30 pm · demo</dd>
                </div>
                <div>
                  <dt>Point</dt>
                  <dd>
                    {selected.connectors[0]} {selected.speed} kW
                  </dd>
                </div>
                <div>
                  <dt>Energy</dt>
                  <dd>{energy} kWh</dd>
                </div>
                <div>
                  <dt>Illustrative rate</dt>
                  <dd>₹{rate} per kWh</dd>
                </div>
                <div className="payment-total">
                  <dt>Demo amount</dt>
                  <dd>₹{amount}</dd>
                </div>
              </dl>
            </div>
            <h3>How would you like to pay?</h3>
            <div className="payment-options">
              {["UPI app", "UPI ID", "Card", "VOLTSTOPS wallet"].map(
                (option) => (
                  <button
                    key={option}
                    className={payment === option ? "active" : ""}
                    onClick={() => setPayment(option)}
                  >
                    <span className="radio-dot" /> {option}
                  </button>
                ),
              )}
            </div>
            <div className="demo-banner">
              Demo checkout. Nothing is charged and no bank, card or UPI service
              is contacted.
            </div>
            <button className="button dark corridor-primary" onClick={finish}>
              Save demo slot · ₹{amount} <Icon name="check" />
            </button>
          </div>
        )}

        {stage === "confirmed" && (
          <div className="corridor-panel confirmation-panel">
            <span className="confirmation-mark">
              <Icon name="check" size={30} />
            </span>
            <span className="eyebrow">SAVED ON THIS DEVICE</span>
            <h2>Your pause is planned.</h2>
            <p>
              The demo slot at {selected.name} has been saved locally. No real
              reservation or payment was made.
            </p>
            <Link className="button dark" to="/bookings">
              View demo bookings <Icon />
            </Link>
            <button className="text-link" onClick={() => setStage("results")}>
              Explore another stop <Icon />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function VenueDetail() {
  const { slug } = useParams()
  const venue = contentRepository.getVenue(slug || "")
  const [booking, setBooking] = useState(false)
  const [menu, setMenu] = useState(false)
  const { saved, save, notify } = usePlatform()
  if (!venue) return <NotFound />
  return (
    <div className="inner-page venue-detail">
      <div className="detail-hero">
        <img src={venue.image} alt={venue.imageAlt} fetchPriority="high" />
        <div />
        <section>
          <Link className="eyebrow" to="/explore">
            EXPLORE / {venue.kind.toUpperCase()}
          </Link>
          <h1>{venue.name}</h1>
          <p>
            <Icon name="pin" size={15} />
            {venue.location} <span>·</span> {venue.category}
          </p>
        </section>
      </div>
      <section className="detail-body section-wrap">
        <div className="detail-story">
          <span className="eyebrow">A STOP WORTH IMAGINING</span>
          <h2>
            A little more
            <br />
            <em>than a stop.</em>
          </h2>
          <p>{venue.description}</p>
          <div className="demo-banner">
            Fictional demo listing. Photos are representative, not photos of
            this location. Prices, hours and specifications are illustrative.
            Availability is not verified.
          </div>
          <h3>The details that matter.</h3>
          <div className="amenities">
            {venue.amenities.map((amenity) => (
              <span key={amenity}>
                <Icon name="check" size={14} />
                {amenity}
              </span>
            ))}
          </div>
          <dl className="detail-facts">
            <div>
              <dt>Location</dt>
              <dd>{venue.address}</dd>
            </div>
            <div>
              <dt>Hours · illustrative</dt>
              <dd>{venue.hours}</dd>
            </div>
            <div>
              <dt>Distance · illustrative</dt>
              <dd>{venue.distance}</dd>
            </div>
            {venue.speed > 0 && (
              <>
                <div>
                  <dt>Connector types</dt>
                  <dd>{venue.connectors.join(" / ")}</dd>
                </div>
                <div>
                  <dt>Charging ports · sample</dt>
                  <dd>{venue.ports} ports · live status not connected</dd>
                </div>
              </>
            )}
          </dl>
          {venue.menu && (
            <>
              <button
                className="button bordered"
                onClick={() => setMenu(!menu)}
                aria-expanded={menu}
              >
                {menu ? "Close sample menu" : "View sample menu"}
                <Icon name="food" />
              </button>
              {menu && (
                <div className="sample-menu">
                  <span className="eyebrow">
                    ILLUSTRATIVE MENU · NOT VERIFIED
                  </span>
                  {venue.menu.map((item) => (
                    <p key={item.name}>
                      {item.name}
                      <span>{item.price}</span>
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
          {venue.rooms && (
            <>
              <h3>Room ideas.</h3>
              {venue.rooms.map((room) => (
                <p key={room}>{room}</p>
              ))}
            </>
          )}
          <h3>Traveller reviews.</h3>
          <p>No verified reviews yet. We don’t publish invented ratings.</p>
          <h3>Nearby in the demo collection.</h3>
          <div className="nearby-links">
            {venues
              .filter(
                (entry) =>
                  entry.id !== venue.id && entry.region === venue.region,
              )
              .slice(0, 2)
              .map((entry) => (
                <Link to={venuePath(entry)} key={entry.id}>
                  {entry.name}
                  <Icon />
                </Link>
              ))}
          </div>
        </div>
        <aside className="detail-booking">
          <span className="eyebrow">YOUR NEXT PAUSE</span>
          <strong>
            {venue.speed ? venue.speed : "A scenic"}{" "}
            <em>{venue.speed ? "kW" : "detour"}</em>
          </strong>
          <p>
            {venue.connectors.join(" / ") || "Destination idea"}
            <br />
            {venue.price} · illustrative
          </p>
          <span className="availability">
            <i />
            Live availability not connected
          </span>
          {venue.speed > 0 && (
            <button className="button dark" onClick={() => setBooking(true)}>
              Preview charging reservation <Icon />
            </button>
          )}
          <button
            className="button bordered"
            aria-pressed={saved.includes(venue.id)}
            onClick={() => save(venue.id)}
          >
            {saved.includes(venue.id)
              ? "Saved to your journey"
              : "Add to journey"}
            <Icon name="bookmark" />
          </button>
          <button
            className="text-link"
            onClick={() =>
              notify(
                "This is an illustrative location. Turn-by-turn directions are not available.",
              )
            }
          >
            Directions preview <Icon />
          </button>
          <small>
            Demo only. No payment, live booking or directions service is
            connected.
          </small>
        </aside>
      </section>
      {booking && (
        <BookingModal venue={venue} close={() => setBooking(false)} />
      )}
    </div>
  )
}

function Journal() {
  const [category, setCategory] = useState("All stories")
  const categories = [
    "All stories",
    "EV travel",
    "Highway stories",
    "Destination guides",
    "EV guides",
  ]
  const filtered = articles.filter(
    (article) => category === "All stories" || article.category === category,
  )
  return (
    <div className="inner-page">
      <section className="page-intro section-wrap journal-intro">
        <span className="eyebrow">THE VOLTSTOPS JOURNAL / ISSUE 01</span>
        <h1>
          For the miles.
          <br />
          <em>And the moments.</em>
        </h1>
        <p>
          Electric travel, thoughtful stops, and stories from the road ahead.
        </p>
      </section>
      <section className="section-wrap journal-page">
        <Link className="journal-feature" to={`/journal/${articles[0].slug}`}>
          <img
            src={articles[0].image}
            alt={articles[0].imageAlt}
            fetchPriority="high"
          />
          <div>
            <span className="eyebrow">THE LONG READ / EV TRAVEL</span>
            <h2>
              The future of
              <br />
              <em>the EV road trip.</em>
            </h2>
            <p>
              Less waiting for the battery. More making something of the moment.
            </p>
            <span>
              VOLTSTOPS EDITORIAL · 3 MIN READ <Icon />
            </span>
          </div>
        </Link>
        <div className="category-tabs">
          {categories.map((label) => (
            <button
              key={label}
              onClick={() => setCategory(label)}
              className={category === label ? "active" : ""}
              aria-pressed={category === label}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="journal-grid">
          {filtered.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  )
}
function BlogArticle() {
  const { slug } = useParams()
  const article = contentRepository.getArticle(slug || "")
  if (!article) return <NotFound />
  return (
    <div className="inner-page article-page">
      <header className="article-header section-wrap">
        <Link to="/journal" className="eyebrow">
          VOLTSTOPS JOURNAL / {article.category.toUpperCase()}
        </Link>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <div>
          {article.author}
          <span>03 OCTOBER 2026</span>
          <span>{article.readingTime}</span>
        </div>
      </header>
      <figure className="article-hero">
        <img src={article.image} alt={article.imageAlt} fetchPriority="high" />
        <figcaption>
          Imagery for the journey. Representative editorial photography.
        </figcaption>
      </figure>
      <article className="article-body">
        {article.sections.map((section, index) => (
          <section key={section.heading}>
            <span className="eyebrow">0{index + 1} / FIELD NOTES</span>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {index === 0 && <blockquote>“{article.quote}”</blockquote>}
          </section>
        ))}
        <div className="article-checklist">
          <h3>Before you leave</h3>
          <ul>
            <li>
              Confirm connector compatibility and your vehicle’s charging
              limits.
            </li>
            <li>Check live station status and keep a backup within reach.</li>
            <li>Verify opening hours, payment methods and amenities.</li>
            <li>Leave a comfortable battery margin for unexpected changes.</li>
          </ul>
        </div>
        <p className="disclaimer">
          Editorial guidance only. Not a verified station guide or substitute
          for current operator and navigation information.
        </p>
        <Link to="/plan" className="button dark">
          Start your journey canvas <Icon />
        </Link>
      </article>
      <section className="section-wrap">
        <SectionHeading
          label="KEEP THE CURIOSITY GOING"
          title={
            <>
              More from
              <br />
              <em>the journal.</em>
            </>
          }
          link="/journal"
        />
        <div className="journal-grid">
          {articles
            .filter((entry) => entry.id !== article.id)
            .map((entry) => (
              <BlogCard key={entry.id} article={entry} />
            ))}
        </div>
      </section>
    </div>
  )
}

function Bookings() {
  const { bookings, cancel } = usePlatform()
  return (
    <div className="inner-page">
      <section className="page-intro section-wrap">
        <span className="eyebrow">YOUR JOURNEY / DEMO RESERVATIONS</span>
        <h1>
          Something to
          <br />
          <em>look forward to.</em>
        </h1>
        <p>
          Reservation previews saved on this device. No real charger has been
          booked and no payment has been taken.
        </p>
      </section>
      <section className="section-wrap booking-list">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <Icon name="clock" size={36} />
            <h2>Your road is still open.</h2>
            <p>Choose a demo location to try the reservation experience.</p>
            <Link className="button dark" to="/chargers">
              Explore charging stops <Icon />
            </Link>
          </div>
        ) : (
          bookings.map((booking) => {
            const venue = venues.find((entry) => entry.id === booking.venueId)
            if (!venue) return null
            return (
              <article key={booking.id}>
                <img src={venue.image} alt={venue.imageAlt} loading="lazy" />
                <div>
                  <span className="eyebrow">
                    DEMO ONLY · NOT A REAL BOOKING
                  </span>
                  <h3>{venue.name}</h3>
                  <p>
                    {booking.date} · {booking.time} · {booking.connector}
                  </p>
                  <Link className="text-link" to={venuePath(venue)}>
                    View stop <Icon />
                  </Link>
                </div>
                <button
                  className="button bordered"
                  onClick={() => cancel(booking.id)}
                >
                  Remove preview
                </button>
              </article>
            )
          })
        )}
      </section>
    </div>
  )
}
function Profile() {
  const { saved } = usePlatform()
  return (
    <div className="inner-page">
      <section className="page-intro section-wrap">
        <span className="eyebrow">YOUR PERSONAL JOURNEY COLLECTION</span>
        <h1>
          Keep the good
          <br />
          <em>stops close.</em>
        </h1>
        <p>
          No account required for this demo. Your saved stops and reservation
          previews stay in this browser only.
        </p>
        <Link className="text-link" to="/bookings">
          Your demo reservations <Icon />
        </Link>
      </section>
      <section className="section-wrap">
        <div className="venue-grid">
          {venues
            .filter((venue) => saved.includes(venue.id))
            .map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
        </div>
        {!saved.length && (
          <div className="empty-state">
            <h2>A collection waiting to happen.</h2>
            <p>Tap the bookmark on a place that catches your eye.</p>
            <Link to="/explore" className="button dark">
              Find your first stop <Icon />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
function Partners() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash)
      setTimeout(
        () =>
          document
            .getElementById("partner-enquiry")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      )
  }, [location.hash])
  return (
    <div className="inner-page">
      <PartnerSection full />
    </div>
  )
}
function About() {
  return (
    <div className="inner-page">
      <section className="about-page section-wrap">
        <span className="eyebrow">THE IDEA BEHIND VOLTSTOPS</span>
        <h1>
          The stop is
          <br />
          <em>part of the story.</em>
        </h1>
        <img
          src={images.road}
          alt="An open Indian mountain road"
          loading="lazy"
        />
        <div>
          <h2>
            Plug in.
            <br />
            <em>Dine out.</em>
          </h2>
          <div>
            <p>
              VoltStops began with a simple thought: charging should not feel
              like time taken away from a journey. It can be time to eat well,
              stretch your legs, rest or discover something new.
            </p>
            <p>
              Founded by Bhupinder Singh in Patiala, Punjab, VoltStops is being
              shaped around the people and places that make EV travel more
              enjoyable.
            </p>
            <p>
              This release is an interactive platform demonstration. Operator
              connections, real reservations, payments and account services are
              not yet live.
            </p>
            <div className="founder-credit">
              <strong>Bhupinder Singh</strong>
              <span>CEO & Founder · VOLTSTOPS</span>
              <a href="mailto:info@voltstops.com">info@voltstops.com</a>
              <a href="tel:+919971633972">+91 99716 33972</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
function Legal() {
  const { pathname } = useLocation()
  const privacy = pathname === "/privacy"
  const { notify } = usePlatform()
  return (
    <div className="inner-page">
      <section className="legal-page section-wrap">
        <span className="eyebrow">
          PLATFORM DEMONSTRATION / {privacy ? "PRIVACY" : "TERMS"}
        </span>
        <h1>{privacy ? "Your data." : "A clear understanding."}</h1>
        <p>
          These notices describe this demonstration, not final legal policies
          for a live commercial service.
        </p>
        <h2>
          {privacy
            ? "What stays in your browser"
            : "An illustrative experience"}
        </h2>
        <p>
          {privacy
            ? "Saved stops and demo reservations are stored in local browser storage. Newsletter and partner forms do not send or save their contents. No authentication, payment processing or analytics service is connected."
            : "Listings, venue specifications, prices and route diagrams are sample content. They must not be used to navigate, confirm availability or make real charging or travel decisions. No booking, payment or business outcome is guaranteed."}
        </p>
        <h2>External services</h2>
        <p>
          Fonts and website imagery are served locally. Opening Instagram or an
          email link takes you to an external service with its own policies.
        </p>
        {privacy && (
          <button
            className="button dark"
            onClick={() => {
              try {
                localStorage.removeItem("voltstops-demo-bookings")
                localStorage.removeItem("voltstops-saved")
                window.location.reload()
              } catch {
                notify(
                  "Browser storage could not be cleared. Please clear this site’s data through browser settings.",
                )
              }
            }}
          >
            Clear local demo data
          </button>
        )}
        <h2>Questions about VoltStops</h2>
        <a className="text-link" href="mailto:info@voltstops.com">
          info@voltstops.com <Icon />
        </a>
        <p className="disclaimer">
          Production privacy and terms require legal review before live launch.
        </p>
      </section>
    </div>
  )
}
function NotFound() {
  return (
    <div className="inner-page">
      <section className="empty-state section-wrap">
        <span className="eyebrow">404 / AN UNEXPECTED DETOUR</span>
        <h1>
          Let’s get back
          <br />
          <em>to the journey.</em>
        </h1>
        <p>This stop isn’t in our collection.</p>
        <Link to="/" className="button dark">
          Back to VoltStops <Icon />
        </Link>
      </section>
    </div>
  )
}

export default {
  Home,
  Explore,
  Plan,
  VenueDetail,
  Journal,
  BlogArticle,
  Partners,
  About,
  Bookings,
  Profile,
  Legal,
  NotFound,
}
