/**
 * Pure helper — no Figma dependency, so it can be unit-tested directly. This
 * demonstrates the "test seam" convention: keep the decision-making logic pure
 * and let the Figma-bound code (logic.ts) stay a thin adapter around it.
 */
export function describeCount(count: number, scope: string): string {
  return `${count} node${count === 1 ? "" : "s"} in ${scope}`;
}
