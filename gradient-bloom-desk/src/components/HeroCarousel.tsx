import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  img: string;
  tag?: string;
};

const slides: Slide[] = [
  {
    title: "Makeup essentials",
    subtitle: "Base, blush, and glow—everyday staples.",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    tag: "NEW",
  },
  {
    title: "Skincare heroes",
    subtitle: "Cleansers, serums, moisturizers & SPF.",
    img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1600&q=80",
    tag: "TRENDING",
  },
  {
    title: "Fragrance & body",
    subtitle: "Soft scents and silky finishes.",
    img: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1600&q=80",
    tag: "EDITOR'S PICK",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div key={s.title} className="min-w-0 flex-[0_0_100%]">
              <div className="relative h-[220px] sm:h-[280px] md:h-[320px]">
                <img
                  src={s.img}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-6 sm:p-8 flex items-end">
                  <div className="max-w-xl text-white">
                    {s.tag ? (
                      <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                        {s.tag}
                      </div>
                    ) : null}
                    <div className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {s.title}
                    </div>
                    <div className="mt-2 text-sm sm:text-base text-white/85">
                      {s.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                selectedIndex === i ? "bg-foreground" : "bg-muted-foreground/30"
              }`}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedIndex + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
}

