/**
 * Design pre-flight hard ban: no em/en dashes in visible copy (hyphen only).
 * CMS fields are author-editable, so every Sanity-sourced string is
 * normalized at render time instead of trusting the dataset.
 */

/** Em dashes become " - "; en/figure dashes and the horizontal bar become
 * plain hyphens so ranges like "2024-2025" stay tight. */
export function stripBannedDashes(text: string): string {
  return text.replace(/\s*—\s*/g, " - ").replace(/[‒–―]/g, "-");
}

/**
 * Normalizes the text spans of Portable Text blocks (non-block members such
 * as inline images pass through untouched).
 */
export function stripBannedDashesDeep<T>(blocks: T[]): T[] {
  return blocks.map((block) => {
    if (
      typeof block !== "object" ||
      block === null ||
      (block as { _type?: string })._type !== "block"
    ) {
      return block;
    }
    const children = (block as { children?: unknown }).children;
    if (!Array.isArray(children)) return block;
    return {
      ...block,
      children: children.map((child: unknown) =>
        typeof child === "object" &&
        child !== null &&
        typeof (child as { text?: unknown }).text === "string"
          ? { ...child, text: stripBannedDashes((child as { text: string }).text) }
          : child,
      ),
    };
  });
}
