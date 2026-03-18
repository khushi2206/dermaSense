import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Routine = () => {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 py-10 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Skin Routine Finder
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Answer a quick cosmetic + skincare quiz to get routine and product matches.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold tracking-widest text-muted-foreground">
                  QUIZ (UI DEMO)
                </div>
                <div className="text-xs text-muted-foreground">Step 1 / 15</div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/4" style={{ background: "var(--gradient-primary)" }} />
              </div>

              <div className="mt-6 text-lg md:text-xl font-extrabold text-foreground">
                What describes your main goal right now?
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Hydration", "Glow", "Acne care", "Oil control"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="rounded-xl border border-border bg-white px-4 py-4 text-left font-semibold text-foreground transition hover:bg-muted/30"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  to="/products"
                  className="rounded-md border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/30"
                >
                  Skip to products
                </Link>
                <button type="button" className="btn-gradient px-6 py-3 text-sm">
                  Next →
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">HOW IT WORKS</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                In ~15 questions we learn your skin type, sensitivity, goals and routine preference.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  "Skin type + concerns",
                  "Sensitivity & triggers",
                  "Makeup habits",
                  "Lifestyle + climate",
                ].map((x) => (
                  <div
                    key={x}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm font-semibold text-foreground"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {x}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
                  alt="Cosmetic products"
                  className="h-36 w-full rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Routine;
