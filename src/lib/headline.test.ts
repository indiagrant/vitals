import { headlineForScore } from "./headline";

describe("headlineForScore", () => {
  it("returns the strong-sprint headline at the top of the scale", () => {
    expect(headlineForScore(5)).toEqual({ eyebrow: "A strong sprint", line: "Most things felt right." });
  });

  it("returns the heavy-sprint headline at the bottom of the scale", () => {
    expect(headlineForScore(1)).toEqual({ eyebrow: "A heavy sprint", line: "Worth sitting with what's wearing on you." });
  });

  it("is inclusive at each bucket boundary", () => {
    expect(headlineForScore(4.3).eyebrow).toBe("A strong sprint");
    expect(headlineForScore(3.5).eyebrow).toBe("A steady sprint");
    expect(headlineForScore(2.8).eyebrow).toBe("A quiet sprint");
    expect(headlineForScore(2.79).eyebrow).toBe("A heavy sprint");
  });
});
