import { bench, describe } from "vitest";
import { sha256 as sha256Node } from "../src/node/sha256.ts";
import { sha256 as sha256Web } from "../src/web/sha256.ts";

describe("sha256", () => {
  const data = new TextEncoder().encode(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  );

  bench("node", () => {
    sha256Node(data);
  });

  bench("web", async () => {
    await sha256Web(data);
  });
});
