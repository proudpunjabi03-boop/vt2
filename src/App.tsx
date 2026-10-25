import { createBrowserRouter, RouterProvider } from "react-router"
import type Pages from "./pages"

const page = (name: keyof typeof Pages) => async () => ({
  Component: (await import("./pages")).default[name],
})

const router = createBrowserRouter(
  [
    {
      lazy: async () => ({ Component: (await import("./components")).default.Shell }),
      children: [
        { index: true, lazy: page("Home") },
        ...["explore", "chargers", "restaurants", "hotels", "map"].map(
          (path) => ({ path, lazy: page("Explore") }),
        ),
        { path: "plan", lazy: page("Plan") },
        ...["charger", "restaurant", "hotel", "destination"].map((kind) => ({
          path: `${kind}/:slug`,
          lazy: page("VenueDetail"),
        })),
        { path: "journal", lazy: page("Journal") },
        { path: "journal/:slug", lazy: page("BlogArticle") },
        { path: "partners", lazy: page("Partners") },
        { path: "about", lazy: page("About") },
        { path: "bookings", lazy: page("Bookings") },
        { path: "profile", lazy: page("Profile") },
        { path: "privacy", lazy: page("Legal") },
        { path: "terms", lazy: page("Legal") },
        { path: "*", lazy: page("NotFound") },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)

export default function App() {
  return <RouterProvider router={router} />
}
