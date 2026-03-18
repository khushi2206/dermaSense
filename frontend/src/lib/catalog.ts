export interface CatalogProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  tag: string;
  image: string;
  description: string;
  ingredients: string;
  benefits: string[];
}

export const CATEGORIES = ["All", "Skincare", "Makeup", "Bodycare", "Fragrance"] as const;

export const PRODUCTS: CatalogProduct[] = [
  {
    id: 1,
    name: "Hyaluronic Serum",
    category: "Skincare",
    price: 45,
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    description:
      "A high-potency restorative serum engineered with triple-weight hyaluronic molecules for multi-depth cellular hydration and architectural skin support.",
    ingredients: "Sodium Hyaluronate (3 molecular weights), Ceramide NP, Panthenol, Niacinamide",
    benefits: ["Deep multi-layer hydration", "Plumps fine lines", "Strengthens skin barrier", "Suitable for all skin types"],
  },
  {
    id: 2,
    name: "Vitamin C Complex",
    category: "Skincare",
    price: 65,
    tag: "New",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    description:
      "Bio-available 20% Vitamin C complex combined with ferulic acid and vitamin E for visible brightening and oxidative stress protection.",
    ingredients: "L-Ascorbic Acid 20%, Ferulic Acid, Tocopherol, Rosa Canina Extract",
    benefits: ["Visibly reduces dark spots", "Boosts collagen synthesis", "Antioxidant protection", "Evens skin tone"],
  },
  {
    id: 3,
    name: "Matte Foundation",
    category: "Makeup",
    price: 52,
    tag: "",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068f044?auto=format&fit=crop&w=1200&q=80",
    description:
      "Skin-matching foundation with invisible coverage and a breathable, second-skin matte finish that lasts all day.",
    ingredients: "Aqua, Cyclopentasiloxane, SPF 15, Kaolin, Hyaluronic Acid",
    benefits: ["All-day wear", "Breathable formula", "SPF 15 protection", "20 shades available"],
  },
  {
    id: 4,
    name: "Body Oil Tint",
    category: "Bodycare",
    price: 38,
    tag: "",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1200&q=80",
    description:
      "A sheer, luminous body oil with a soft tint that hydrates, nourishes and imparts structural luster.",
    ingredients: "Argan Oil, Jojoba Esters, Iron Oxides, Vitamin E, Rosehip Seed Oil",
    benefits: ["24h hydration", "Natural luminance", "Non-greasy absorption", "Vegan formula"],
  },
  {
    id: 5,
    name: "Niacinamide Toner",
    category: "Skincare",
    price: 34,
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?auto=format&fit=crop&w=1200&q=80",
    description:
      "10% Niacinamide concentration for visible pore refinement, sebum regulation and skin barrier restoration.",
    ingredients: "Niacinamide 10%, Zinc PCA, Hyaluronic Acid, Allantoin",
    benefits: ["Minimises pore appearance", "Controls excess sebum", "Evens skin texture", "Brightens complexion"],
  },
  {
    id: 6,
    name: "Satin Lip Treatment",
    category: "Makeup",
    price: 22,
    tag: "New",
    image: "https://images.unsplash.com/photo-1631730486134-c99a59e2ebea?auto=format&fit=crop&w=1200&q=80",
    description: "Tinted moisture with a satin finish that conditions, plumps and defines lips throughout the day.",
    ingredients: "Shea Butter, Vitamin E, Rosehip Oil, Natural Pigments, Hyaluronic Acid",
    benefits: ["Plumping effect", "12h moisture", "8 natural shades", "Cruelty-free"],
  },
  {
    id: 7,
    name: "Peptide Eye Cream",
    category: "Skincare",
    price: 72,
    tag: "",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Multi-peptide complex targeting fine lines, dark circles and puffiness in the delicate periorbital zone.",
    ingredients: "Argireline, Leuphasyl, Caffeine, Vitamin K, Hyaluronic Acid",
    benefits: ["Reduces crow's feet", "Diminishes dark circles", "Depuffs eye area", "Clinically tested"],
  },
  {
    id: 8,
    name: "Rose Facial Mist",
    category: "Skincare",
    price: 28,
    tag: "",
    image: "https://images.unsplash.com/photo-1607748851687-ba9a10438621?auto=format&fit=crop&w=1200&q=80",
    description: "Antioxidant thermal mist with pure rose water for instant hydration and skin-setting throughout the day.",
    ingredients: "Rosa Damascena Water, Glycerin, Aloe Vera, Panthenol, Centella Extract",
    benefits: ["Instant skin reset", "Sets makeup", "Antioxidant boost", "Travel-friendly 100ml"],
  },
];
