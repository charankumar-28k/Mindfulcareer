import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  formatDate,
  getApplications,
  getSession,
  initials,
} from "@/lib/session";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const session = getSession();
    if (!session) throw redirect({ to: "/login" });
    if (session.role !== "user") throw redirect({ to: "/counsellor" });
  },
  head: () => ({
    meta: [
      { title: "My Dashboard — MINDFULCAREER" },
      {
        name: "description",
        content: "Your MINDFULCAREER student dashboard — profile and applications.",
      },
      { property: "og:title", content: "My Dashboard — MINDFULCAREER" },
      {
        property: "og:description",
        content: "Your MINDFULCAREER student dashboard — profile and applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UserDashboard,
});

function UserDashboard() {
  const session = getSession();
  if (!session) return null;

  const myApplications = getApplications().filter(
    (a) => a.email.toLowerCase() === session.email.toLowerCase(),
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <header data-reveal className="is-visible">
          <span className="inline-block rounded-full border border-steel px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-navy">
            STUDENT DASHBOARD
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-navy md:text-4xl">
            Welcome back, {session.name.split(/\s+/)[0]}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here is where your journey with MINDFULCAREER stands.
          </p>
        </header>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          {/* Profile card */}
          <section
            data-reveal
            className="is-visible rounded-3xl border border-steel bg-white p-8 text-center shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]"
          >
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy font-display text-2xl font-bold text-gold">
              {initials(session.name)}
            </span>
            <h2 className="mt-5 font-display text-lg font-bold text-navy">
              {session.name}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {session.email}
            </p>
            <span className="mt-4 inline-block rounded-full bg-gold px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-navy">
              Student Account
            </span>
            <p className="mt-5 border-t border-steel pt-4 text-xs text-muted-foreground">
              Member since {formatDate(session.joinedAt)}
            </p>
            <Link
              to="/"
              className="mt-6 block rounded-full bg-gold py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-navy transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(252,163,17,0.7)]"
            >
              Browse Open Roles
            </Link>
          </section>

          {/* Applications card */}
          <section
            data-reveal
            className="is-visible rounded-3xl border border-steel bg-white p-8 shadow-[0_8px_30px_-14px_rgba(20,33,61,0.18)]"
          >
            <h2 className="font-display text-lg font-bold text-navy">
              My Applications
            </h2>
            {myApplications.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-steel/40 px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  You haven't applied to any roles yet.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find a role you love on the{" "}
                  <a
                    href="/#jobs"
                    className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4"
                  >
                    careers page
                  </a>{" "}
                  and hit Apply Now.
                </p>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-steel">
                {myApplications.map((app) => (
                  <li
                    key={app.id}
                    className="flex min-w-0 items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold text-navy">
                        {app.position}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Applied {formatDate(app.date)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-steel px-3.5 py-1 text-[11px] font-semibold text-navy">
                      {app.status ?? "In review"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
