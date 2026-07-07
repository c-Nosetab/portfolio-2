import groq from "groq";

/**
 * Shared building blocks. Drafts never render publicly (draft != true).
 * Ordering: orderRank (drag-to-reorder string rank) wins, then the legacy
 * integer order field, then title. coalesce pushes unranked docs last.
 */
const PROJECT_FILTER = /* groq */ `_type == "project" && draft != true`;

const PROJECT_ORDER = /* groq */ `order(coalesce(orderRank, "~") asc, coalesce(order, 999) asc, title asc)`;

const CARD_PROJECTION = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  type,
  featured,
  summary,
  stack,
  tags,
  links,
  cover,
  publishedAt,
  timeline
}`;

/** All non-draft projects, ordered, card shape. */
export const PROJECTS_QUERY = groq`*[${PROJECT_FILTER}] | ${PROJECT_ORDER} ${CARD_PROJECTION}`;

/** Featured projects for the home grid, capped at 4. */
export const FEATURED_PROJECTS_QUERY = groq`*[${PROJECT_FILTER} && featured == true] | ${PROJECT_ORDER} [0...4] ${CARD_PROJECTION}`;

/** Products hub. */
export const PRODUCT_PROJECTS_QUERY = groq`*[${PROJECT_FILTER} && type == "product"] | ${PROJECT_ORDER} ${CARD_PROJECTION}`;

/** Lab / experiments. */
export const EXPERIMENT_PROJECTS_QUERY = groq`*[${PROJECT_FILTER} && type == "experiment"] | ${PROJECT_ORDER} ${CARD_PROJECTION}`;

/** Full case study by slug ($slug param). */
export const PROJECT_BY_SLUG_QUERY = groq`*[${PROJECT_FILTER} && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  type,
  featured,
  summary,
  stack,
  tags,
  links,
  cover,
  publishedAt,
  role,
  timeline,
  outcome,
  metrics,
  demo,
  body,
  client
}`;

/** Slugs for generateStaticParams. */
export const PROJECT_SLUGS_QUERY = groq`*[${PROJECT_FILTER} && defined(slug.current)].slug.current`;
