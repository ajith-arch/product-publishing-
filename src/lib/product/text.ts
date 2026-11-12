/** Lowercase, hyphen-separated URL component. Pure ASCII a–z, 0–9 and single hyphens. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

export const URL_COMPONENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Plain-text view of an HTML string, for emptiness checks and character counts.
 * Not a sanitizer: never use the result to render HTML.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBlankHtml(html: string): boolean {
  return htmlToText(html).length === 0;
}
