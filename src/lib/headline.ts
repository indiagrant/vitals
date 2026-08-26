export interface Headline {
  eyebrow: string;
  line: string;
}

// Buckets a 1-5 average score into the app's warm, non-clinical headline
// voice. Shared by Sprint page's hero and History's per-sprint entries, so
// the same sprint reads with the same words in both places.
export function headlineForScore(score: number): Headline {
  if (score >= 4.3) return { eyebrow: "A strong sprint",  line: "Most things felt right." };
  if (score >= 3.5) return { eyebrow: "A steady sprint",  line: "Some bright spots, some edges." };
  if (score >= 2.8) return { eyebrow: "A quiet sprint",   line: "Nothing on fire, but nothing lifted either." };
  return              { eyebrow: "A heavy sprint",        line: "Worth sitting with what's wearing on you." };
}
