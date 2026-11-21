/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- plain Node script (node --experimental-strip-types), not part of the app build.
// Self-check for the WhatsApp order message.
// Run: node --experimental-strip-types src/lib/whatsapp.check.ts
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// The app's imports have no ".ts" ending (bundler style); add it for plain Node.
registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if (spec.startsWith(".")) return next(spec + ".ts", ctx);
      throw e;
    }
  },
});

const w = await import("./whatsapp.ts");
const base = { name: "Kumar", phone: "0771234567", address: "12 Main St", area: "Jaffna", time: "", notes: "" };

// Small order, delivery: fee charged, address shown.
const small = [{ id: "tomato", qty: 2 }]; // 240
let m = w.orderMessage(small, { ...base, method: "delivery" }, "en", "PF-1");
assert.equal(w.subtotalOf(small), 240);
assert.match(m, /Delivery: Rs\. 200/);
assert.match(m, /\*Total: Rs\. 440\*/);
assert.match(m, /Address: 12 Main St, Jaffna/);
assert.match(m, /Cash on Delivery/);

// Same order, pickup: no fee, no address, pay at the store, no blank line inside the customer block.
m = w.orderMessage(small, { ...base, method: "pickup" }, "en", "PF-1");
assert.equal(w.deliveryFeeOf(240, "pickup"), 0);
assert.match(m, /Delivery: Free/);
assert.match(m, /\*Total: Rs\. 240\*/);
assert.doesNotMatch(m, /Address/);
assert.match(m, /Method: Store pickup\nPayment: Pay at the store on pickup/);
assert.doesNotMatch(m, /\n\n\n/);

// Free delivery from the threshold, not one rupee before.
assert.equal(w.deliveryFeeOf(w.FREE_DELIVERY_FROM, "delivery"), 0);
assert.equal(w.deliveryFeeOf(w.FREE_DELIVERY_FROM - 1, "delivery"), w.DELIVERY_FEE);
const big = [{ id: "coconut-oil", qty: 4 }]; // 3800
m = w.orderMessage(big, { ...base, method: "delivery" }, "ta", "PF-2");
assert.match(m, /இலவசம்/);
assert.match(m, /PF-2/);

// Unknown products are left out, not printed as blank lines.
m = w.orderMessage([{ id: "nope", qty: 1 }, ...small], { ...base, method: "pickup" }, "en", "PF-3");
assert.match(m, /\*Items:\*\n1\. Tomato/);

console.log("whatsapp.check: ok");
