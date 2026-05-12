/**
 * Safe JSON-LD payload for Next.js `<script type="application/ld+json">`.
 * Prevents `</script>`-style breaks if user content ever includes `<`.
 */
export function jsonLdScriptContent(data: unknown): string {
   return JSON.stringify(data).replace(/</g, "\\u003c");
}
