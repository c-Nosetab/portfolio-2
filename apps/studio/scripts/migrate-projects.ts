/**
 * One-shot generator: converts the reference MDX drafts in content/projects/
 * into apps/studio/scripts/projects.ndjson for `sanity dataset import`.
 *
 * Run from apps/studio: pnpm migrate
 *
 * Intentional decisions:
 * - draft: false — imported content goes live; the "TODO before publish" notes
 *   live only in the MDX reference files and are stripped here.
 * - cover is always omitted — the frontend renders a typographic fallback
 *   until real screenshots exist.
 */
import {randomUUID} from 'node:crypto'
import {readFileSync, readdirSync, writeFileSync} from 'node:fs'
import {basename, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {htmlToPortableText} from '@portabletext/html'
import matter from 'gray-matter'
import {JSDOM} from 'jsdom'
import {LexoRank} from 'lexorank'
import MarkdownIt from 'markdown-it'

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const contentDir = resolve(scriptDir, '../../../content/projects')
const outFile = join(scriptDir, 'projects.ndjson')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Frontmatter {
  title?: string
  slug?: string
  type?: string
  featured?: boolean
  order?: number
  summary?: string
  role?: string
  timeline?: string
  client?: string
  outcome?: string
  stack?: string[]
  tags?: string[]
  metrics?: Array<{label?: string; value?: string}>
  links?: Record<string, unknown>
  cover?: string
  demo?: string
  publishedAt?: string | Date
  [key: string]: unknown
}

interface ProjectDoc {
  _id: string
  _type: 'project'
  title: string | undefined
  slug: {_type: 'slug'; current: string}
  type: string | undefined
  featured: boolean
  order: number
  draft: false
  summary: string | undefined
  role: string | undefined
  timeline: string | undefined
  client?: string
  outcome: string | undefined
  stack: string[] | undefined
  tags: string[] | undefined
  metrics?: Array<{_key: string; label?: string; value?: string}>
  links?: Record<string, string>
  publishedAt: string | undefined
  demo?: {kind: string}
  body: ReturnType<typeof htmlToPortableText>
  orderRank?: string
}

/** Frontmatter keys the migration maps (or intentionally drops, e.g. cover). */
const HANDLED_KEYS = new Set([
  'title',
  'slug',
  'type',
  'featured',
  'order',
  'summary',
  'role',
  'timeline',
  'client',
  'outcome',
  'stack',
  'tags',
  'metrics',
  'links',
  'cover', // intentionally omitted — typographic fallback on the frontend
  'demo',
  'publishedAt',
])

// ---------------------------------------------------------------------------
// Body preprocessing
// ---------------------------------------------------------------------------

/**
 * Strip the trailing editorial TODO section: remove from the final horizontal
 * rule onward, but only if the text after it contains "TODO before publish".
 */
function stripTrailingTodo(body: string): string {
  const hr = /^ {0,3}-{3,}[ \t]*$/gm
  let lastMatch: RegExpExecArray | null = null
  let m: RegExpExecArray | null
  while ((m = hr.exec(body)) !== null) {
    lastMatch = m
  }
  if (!lastMatch) return body
  const after = body.slice(lastMatch.index + lastMatch[0].length)
  if (!/todo before publish/i.test(after)) return body
  return body.slice(0, lastMatch.index).trimEnd() + '\n'
}

/** Rewrite relative MDX links `](./name.mdx)` to site routes `](/work/name)`. */
function rewriteRelativeLinks(body: string): string {
  return body.replace(/\]\(\.\/([^)\s]+?)\.mdx\)/g, '](/work/$1)')
}

// ---------------------------------------------------------------------------
// Field mapping helpers
// ---------------------------------------------------------------------------

function normalizePublishedAt(value: string | Date | undefined): string | undefined {
  if (value === undefined) return undefined
  if (value instanceof Date) return value.toISOString()
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00.000Z`
  return value
}

function mapMetrics(
  metrics: Frontmatter['metrics'],
): ProjectDoc['metrics'] {
  if (!metrics || metrics.length === 0) return undefined
  return metrics.map((metric) => ({
    _key: randomUUID().slice(0, 8),
    label: metric.label,
    value: metric.value,
  }))
}

/** Drop empty-string link values; omit the whole object if nothing remains. */
function mapLinks(links: Frontmatter['links']): Record<string, string> | undefined {
  if (!links) return undefined
  const kept: Record<string, string> = {}
  for (const [key, value] of Object.entries(links)) {
    if (typeof value === 'string' && value.trim() !== '') {
      kept[key] = value
    }
  }
  return Object.keys(kept).length > 0 ? kept : undefined
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const md = new MarkdownIt()

  const files = readdirSync(contentDir)
    .filter((name) => name.endsWith('.mdx') && name !== '_index.md')
    .sort()

  if (files.length === 0) {
    console.error(`No .mdx files found in ${contentDir}`)
    process.exit(1)
  }

  const docs: ProjectDoc[] = []

  for (const file of files) {
    const raw = readFileSync(join(contentDir, file), 'utf8')
    const {data, content} = matter(raw)
    const fm = data as Frontmatter

    const unmapped = Object.keys(fm).filter((key) => !HANDLED_KEYS.has(key))
    if (unmapped.length > 0) {
      console.warn(`[warn] ${file}: unmapped frontmatter keys dropped: ${unmapped.join(', ')}`)
    }

    const slug = fm.slug ?? basename(file, '.mdx')

    const preprocessed = rewriteRelativeLinks(stripTrailingTodo(content))
    const html = md.render(preprocessed)
    const keyGenerator = () => randomUUID().slice(0, 8)
    const body = htmlToPortableText(html, {
      parseHtml: (input) => new JSDOM(input).window.document,
      keyGenerator,
      types: {
        // The project body schema only allows `block` and `image` — map fenced
        // code to a normal block with the `code` decorator so imports stay
        // schema-valid.
        code: ({value}) => ({
          _type: 'block',
          _key: keyGenerator(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: keyGenerator(),
              marks: ['code'],
              text: value.code.replace(/\n$/, ''),
            },
          ],
        }),
      },
    })

    console.log(`[info] ${file}: converted ${body.length} portable text blocks`)

    docs.push({
      _id: `project-${slug}`,
      _type: 'project',
      title: fm.title,
      slug: {_type: 'slug', current: slug},
      type: fm.type,
      featured: !!fm.featured,
      order: Number(fm.order ?? 0),
      draft: false,
      summary: fm.summary,
      role: fm.role,
      timeline: fm.timeline,
      client: fm.client,
      outcome: fm.outcome,
      stack: fm.stack,
      tags: fm.tags,
      metrics: mapMetrics(fm.metrics),
      links: mapLinks(fm.links),
      publishedAt: normalizePublishedAt(fm.publishedAt),
      demo: fm.demo ? {kind: fm.demo} : undefined,
      body,
    })
  }

  // orderRank: ascending frontmatter order → ascending lexorank
  docs.sort((a, b) => a.order - b.order)
  let rank = LexoRank.middle()
  for (const doc of docs) {
    doc.orderRank = rank.toString()
    rank = rank.genNext()
  }

  const ndjson = docs.map((doc) => JSON.stringify(doc)).join('\n') + '\n'
  writeFileSync(outFile, ndjson, 'utf8')

  console.log(`[done] wrote ${docs.length} documents to ${outFile}`)
}

main()
