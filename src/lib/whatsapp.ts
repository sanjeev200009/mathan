// Orders go to the shop on WhatsApp as a ready-written message (wa.me link).
// No online payment: the customer pays cash on delivery or at the shop.
import type { Lang } from "./i18n";
import { formatPrice, productById } from "./products";

// Shop number in international form, digits only. Change it here only.
export const STORE_PHONE = "94761234567";
export const STORE_PHONE_DISPLAY = "+94 76 123 4567";
export const DELIVERY_FEE = 200; // LKR, waived from FREE_DELIVERY_FROM
export const FREE_DELIVERY_FROM = 3000;

export const waLink = (text: string) => `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(text)}`;

export type CartLine = { id: string; qty: number };
export type Customer = {
  name: string;
  phone: string;
  method: "delivery" | "pickup";
  address: string;
  area: string;
  time: string; // preferred time, free text
  notes: string;
};

export const subtotalOf = (lines: CartLine[]) =>
  lines.reduce((s, l) => s + (productById(l.id)?.price ?? 0) * l.qty, 0);

export const deliveryFeeOf = (subtotal: number, method: Customer["method"]) =>
  method === "pickup" || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;

/** One product, straight from a product card. */
export function productMessage(id: string, qty: number, lang: Lang) {
  const p = productById(id);
  if (!p) return "";
  return lang === "ta"
    ? `வணக்கம் பசுமை ஃப்ரெஷ்! 🌿\nநான் ஆர்டர் செய்ய விரும்புகிறேன்:\n• ${p.name.ta} (${p.unit.ta}) × ${qty} = ${formatPrice(p.price * qty)}\nதயவுசெய்து உறுதிப்படுத்தவும்.`
    : `Hello Pasumai Fresh! 🌿\nI would like to order:\n• ${p.name.en} (${p.unit.en}) × ${qty} = ${formatPrice(p.price * qty)}\nPlease confirm.`;
}

/** A general hello for buttons that are not about one product (hero, floating button). */
export const helloMessage = (lang: Lang) =>
  lang === "ta"
    ? "வணக்கம் பசுமை ஃப்ரெஷ்! 🌿 நான் ஆர்டர் செய்ய விரும்புகிறேன்."
    : "Hello Pasumai Fresh! 🌿 I would like to place an order.";

/** The whole cart with the customer's details, from checkout. */
export function orderMessage(lines: CartLine[], c: Customer, lang: Lang, orderNo: string) {
  const ta = lang === "ta";
  const sub = subtotalOf(lines);
  const fee = deliveryFeeOf(sub, c.method);
  const items = lines
    .flatMap((l) => {
      const p = productById(l.id);
      return p ? [{ p, qty: l.qty }] : [];
    })
    .map(({ p, qty }, i) => `${i + 1}. ${p.name[lang]} (${p.unit[lang]}) × ${qty} = ${formatPrice(p.price * qty)}`)
    .join("\n");

  const rows = [
    ta ? `🛒 *புதிய ஆர்டர் — ${orderNo}*` : `🛒 *New order — ${orderNo}*`,
    "",
    ta ? "*பொருட்கள்:*" : "*Items:*",
    items,
    "",
    `${ta ? "மொத்தம்" : "Subtotal"}: ${formatPrice(sub)}`,
    `${ta ? "விநியோக கட்டணம்" : "Delivery"}: ${fee === 0 ? (ta ? "இலவசம்" : "Free") : formatPrice(fee)}`,
    `*${ta ? "செலுத்த வேண்டியது" : "Total"}: ${formatPrice(sub + fee)}*`,
    "",
    ta ? "*வாடிக்கையாளர்:*" : "*Customer:*",
    `${ta ? "பெயர்" : "Name"}: ${c.name}`,
    `${ta ? "தொலைபேசி" : "Phone"}: ${c.phone}`,
    `${ta ? "முறை" : "Method"}: ${c.method === "delivery" ? (ta ? "வீட்டுக்கு விநியோகம்" : "Home delivery") : ta ? "கடையில் பெறுதல்" : "Store pickup"}`,
    c.method === "delivery" ? `${ta ? "முகவரி" : "Address"}: ${c.address}${c.area ? `, ${c.area}` : ""}` : null,
    c.time ? `${ta ? "விரும்பும் நேரம்" : "Preferred time"}: ${c.time}` : null,
    `${ta ? "கட்டணம்" : "Payment"}: ${
      c.method === "delivery"
        ? ta ? "பணமாக (Cash on Delivery)" : "Cash on Delivery"
        : ta ? "கடையில் பெறும்போது பணமாக" : "Pay at the store on pickup"
    }`,
    c.notes ? `${ta ? "குறிப்பு" : "Notes"}: ${c.notes}` : null,
    "",
    ta ? "தயவுசெய்து ஆர்டரை உறுதிப்படுத்தவும். நன்றி! 🙏" : "Please confirm my order. Thank you! 🙏",
  ];
  // Optional rows are null and simply left out; "" rows are the blank lines between blocks.
  return rows.filter((r) => r !== null).join("\n").trim();
}
