import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";

const Index = () => {
  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />

      <main className="container mx-auto px-6">
        <section className="py-8 md:py-10 animate-fade-in">
          <HeroCarousel />

          <div className="mt-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Skincare, but smarter.
              </h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Discover routines and curated products designed for real skin.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/routine" className="btn-gradient text-sm md:text-base">
                Find My Routine →
              </Link>
              <Link
                to="/products"
                className="rounded-md border border-border bg-white px-5 py-3 text-sm md:text-base font-semibold text-foreground transition hover:bg-muted/40"
              >
                Shop Products
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Makeup",
                img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Skincare",
                img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Haircare",
                img: "https://images.unsplash.com/photo-1620916566399-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Fragrance",
                img: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80",
              },
            ].map((c) => (
              <Link
                key={c.title}
                to="/products"
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-bold tracking-wide text-foreground">{c.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Explore</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
