import { describe, it, expect } from "vitest";
import { describeCount } from "./summarize";

describe("describeCount", () => {
  it("pluralizes correctly", () => {
    expect(describeCount(0, "page")).toBe("0 nodes in page");
    expect(describeCount(1, "selection")).toBe("1 node in selection");
    expect(describeCount(5, "page")).toBe("5 nodes in page");
  });
});
