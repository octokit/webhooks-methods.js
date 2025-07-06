import { bench, describe } from "vitest";
import { timingSafeEqual as timingSafeEqualNode } from "../src/node/timing-safe-equal.ts";
import { timingSafeEqual as timingSafeEqualWeb } from "../src/web/timing-safe-equal.ts";

describe("timingSafeEqual", () => {
  const eventPayload = JSON.stringify({
    foo: "bar",
  });

  const payload = new TextEncoder().encode(eventPayload);
  const payload2 = new TextEncoder().encode(eventPayload);

  bench("node", () => {
    timingSafeEqualNode(payload, payload2);
  });

  bench("web", () => {
    timingSafeEqualWeb(payload, payload2);
  });
});
