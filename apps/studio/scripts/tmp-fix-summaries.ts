/**
 * One-shot dataset patch (run once, then delete): rewrites project summaries
 * to remove em-dashes, per the design brief hard ban on visible em/en dashes.
 * Run from apps/studio: pnpm exec sanity exec scripts/tmp-fix-summaries.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-07-01'})

const fixes: Record<string, string> = {
  'project-squirrel-away':
    'A cloud document-management app with AI-powered search, OCR text extraction, and real-time file processing. Google Drive-like, built full-stack in TypeScript.',
  'project-task-board-manager':
    'A kanban-style task board with drag-and-drop columns, priorities, and due dates, built to show Angular + Express full-stack range and containerized deployment.',
  'project-bhs-pioneer-website':
    'The public website for the Pioneer District of the Barbershop Harmony Society, designed and built solo and now being re-platformed from Gatsby to a Next.js 15 + Sanity monorepo. Live in production since 2020.',
  'project-find-your-show':
    'A directory-first platform connecting audiences, venues, and performers in live entertainment. Full-stack TypeScript monorepo with a custom theatrical design system, in active development.',
  'project-wagervault':
    'A universal (iOS/Android/Web) mobile app for tracking gambling sessions, bankroll, and performance, with a personal-vs-global RTP engine, charted analytics, and year-end tax estimation. In active development.',
  'project-mix-chorus':
    'A compact site for the MI-X barbershop chorus (Pioneer District) to help singers discover the group and join. Built in Angular with GSAP animation.',
}

async function run(): Promise<void> {
  for (const [id, summary] of Object.entries(fixes)) {
    const result = await client.patch(id).set({summary}).commit()
    console.log(`[patched] ${result._id}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
