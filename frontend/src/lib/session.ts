import type { CatalogProduct } from "@/lib/catalog";

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
}

export interface LocalSkinProfile {
  id: number;
  userId: number;
  skinType: string;
  concern: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const USER_KEY = "dermasense.user";
const CART_KEY = "dermasense.cart";
const PROFILES_KEY = "dermasense.profiles";

const canUseStorage = () => typeof window !== "undefined";

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser(): SessionUser | null {
  return readJson<SessionUser | null>(USER_KEY, null);
}

export function setCurrentUser(user: SessionUser) {
  writeJson(USER_KEY, user);
}

export function getNextLocalId(key: "user" | "profile"): number {
  const counterKey = `dermasense.counter.${key}`;
  const current = readJson<number>(counterKey, key === "user" ? 1000 : 1);
  writeJson(counterKey, current + 1);
  return current;
}

export function getCartItems(): CartItem[] {
  return readJson<CartItem[]>(CART_KEY, []);
}

export function saveCartItems(items: CartItem[]) {
  writeJson(CART_KEY, items);
}

export function addToCart(product: CatalogProduct) {
  const items = getCartItems();
  const existing = items.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += 1;
    saveCartItems(items);
    return;
  }

  items.push({
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
  });

  saveCartItems(items);
}

export function getLocalProfilesByUser(userId: number): LocalSkinProfile[] {
  const all = readJson<LocalSkinProfile[]>(PROFILES_KEY, []);
  return all.filter((p) => p.userId === userId);
}

export function saveLocalProfile(profile: Omit<LocalSkinProfile, "id">) {
  const all = readJson<LocalSkinProfile[]>(PROFILES_KEY, []);
  all.unshift({ ...profile, id: getNextLocalId("profile") });
  writeJson(PROFILES_KEY, all);
}
