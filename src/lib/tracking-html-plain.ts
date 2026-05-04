/**
 * API fields sometimes arrive with snippets like `<strong>La Habana</strong>` or `<br>`.
 */
export function timelineHtmlToPlain(html: string): string {
   if (html.trim() === "") {
      return "";
   }
   const withBreaks = html.replace(/<br\s*\/?>/gi, "\n");
   const stripped = withBreaks.replace(/<[^>]*>/g, "");
   return stripped.replace(/\u00a0/g, " ").trim();
}
