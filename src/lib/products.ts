// The shop's catalogue. Prices in LKR. Images live in public/images.
// ponytail: static list; move to a CMS/sheet when the owner edits prices daily.

export type L = { en: string; ta: string };
export type CategoryId = "vegetables" | "fruits" | "coconut" | "greens" | "grocery";

export type Category = { id: CategoryId; name: L; count: L; image: string };
export type Product = {
  id: string;
  name: L;
  unit: L;
  price: number;
  category: CategoryId;
  image: string;
  featured?: boolean;
};

export const CATEGORIES: Category[] = [
  { id: "vegetables", name: { en: "Vegetables", ta: "காய்கறிகள்" }, count: { en: "150+ products", ta: "150+ பொருட்கள்" }, image: "/images/categories/vegetables.jpg" },
  { id: "fruits", name: { en: "Fruits", ta: "பழங்கள்" }, count: { en: "100+ products", ta: "100+ பொருட்கள்" }, image: "/images/categories/fruits.jpg" },
  { id: "coconut", name: { en: "Tender Coconut", ta: "இளநீர்" }, count: { en: "Fresh tender coconut", ta: "புதிய இளநீர்" }, image: "/images/categories/coconut.jpg" },
  { id: "greens", name: { en: "Greens", ta: "கீரைகள்" }, count: { en: "50+ varieties", ta: "50+ வகைகள்" }, image: "/images/categories/greens.jpg" },
  { id: "grocery", name: { en: "Groceries", ta: "மளிகை பொருட்கள்" }, count: { en: "200+ products", ta: "200+ பொருட்கள்" }, image: "/images/categories/grocery.jpg" },
];

const kg = { en: "1 kg", ta: "1 கிலோ" };
const halfKg = { en: "500 g", ta: "500 கிராம்" };
const each = { en: "1 piece", ta: "1 பெரியது" };
const bunch = { en: "1 bunch", ta: "1 கட்டு" };
const dozen = { en: "1 dozen", ta: "1 டசன்" };

const p = (id: string, en: string, ta: string, unit: L, price: number, category: CategoryId, featured = false): Product => ({
  id, name: { en, ta }, unit, price, category, image: `/images/products/${id}.jpg`, featured,
});

export const PRODUCTS: Product[] = [
  // Featured row, in the design's order.
  p("tomato", "Tomato", "தக்காளி", kg, 120, "vegetables", true),
  p("onion", "Big Onion", "வெங்காயம்", kg, 100, "vegetables", true),
  p("potato", "Potato", "உருளைக்கிழங்கு", kg, 90, "vegetables", true),
  p("green-chilli", "Green Chilli", "பச்சை மிளகாய்", kg, 150, "vegetables", true),
  p("banana", "Banana", "வாழைப்பழம்", dozen, 180, "fruits", true),
  p("tender-coconut", "Tender Coconut", "இளநீர்", each, 150, "coconut", true),
  // The rest of the shelf.
  p("carrot", "Carrot", "கேரட்", kg, 160, "vegetables"),
  p("beans", "Beans", "பீன்ஸ்", halfKg, 140, "vegetables"),
  p("brinjal", "Brinjal", "கத்தரிக்காய்", kg, 130, "vegetables"),
  p("cabbage", "Cabbage", "முட்டைக்கோஸ்", kg, 110, "vegetables"),
  p("mango", "Mango", "மாம்பழம்", kg, 450, "fruits"),
  p("papaya", "Papaya", "பப்பாளி", each, 220, "fruits"),
  p("pineapple", "Pineapple", "அன்னாசி", each, 350, "fruits"),
  p("orange", "Orange", "ஆரஞ்சு", kg, 600, "fruits"),
  p("king-coconut", "King Coconut", "செவ்விளநீர்", each, 170, "coconut"),
  p("coconut", "Coconut", "தேங்காய்", each, 130, "coconut"),
  p("spinach", "Spinach", "பசலைக் கீரை", bunch, 80, "greens"),
  p("ponnanganni", "Ponnanganni", "பொன்னாங்கண்ணி", bunch, 70, "greens"),
  p("curry-leaves", "Curry Leaves", "கறிவேப்பிலை", bunch, 40, "greens"),
  p("vallarai", "Vallarai", "வல்லாரை", bunch, 80, "greens"),
  p("rice", "Samba Rice", "சம்பா அரிசி", kg, 280, "grocery"),
  p("dhal", "Red Dhal", "பருப்பு", kg, 390, "grocery"),
  p("coconut-oil", "Coconut Oil", "தேங்காய் எண்ணெய்", { en: "1 L", ta: "1 லீட்டர்" }, 950, "grocery"),
  p("sugar", "Sugar", "சீனி", kg, 290, "grocery"),
];

export const formatPrice = (n: number) => `Rs. ${n.toLocaleString("en-LK")}`;
export const productById = (id: string) => PRODUCTS.find((x) => x.id === id);
