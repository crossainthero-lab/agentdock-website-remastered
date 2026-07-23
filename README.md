# AgentDock Website Remastered

The remastered official website for AgentDock, including downloads, AIgency information, technical architecture, and project updates.

## What is this?
This is the front-end marketing and documentation website for AgentDock—the desktop control layer for coding-agent command-line tools. It provides direct download links for releases, explains the core product, details the future planned AIgency architecture, and hosts a blog.

## Framework
The project is built with:
- React 19
- Vite
- Tailwind CSS v4
- React Router
- Lucide React (icons)
- Framer Motion (animations)
- Mermaid (diagrams)

## Installation
Ensure you have Node.js and npm installed, then install the dependencies:
```bash
npm install
```

## Development
Run the local development server:
```bash
npm run dev
```

To run the Cloudflare Pages build with Functions and local D1 bindings:
```bash
npm run db:migrate:local
npm run dev:pages
```

## Build
Create a production build:
```bash
npm run build
```
The output will be placed in the `dist` directory.

## Deployment
This project is configured for deployment on Cloudflare Pages.
You can deploy it using the Wrangler CLI:
```bash
npm run deploy
```
*(Requires Cloudflare authentication and Wrangler configuration in `wrangler.jsonc`)*

## AIgency Waitlist Backend
The AIgency waitlist API is implemented as a Cloudflare Pages Function at `POST /api/waitlist`. It uses the D1 binding `WAITLIST_DB` and stores submissions in `aigency_waitlist`.

If the D1 database needs to be created in a new Cloudflare account, run:
```bash
npx wrangler d1 create agentdock-waitlist
```
Then copy the returned `database_id` into the existing `d1_databases` entry in `wrangler.jsonc`. Do not commit credentials or secrets.

Apply the migration locally and remotely:
```bash
npm run db:migrate:local
npm run db:migrate:remote
```

For production Pages deployments, ensure the Pages project has a D1 database binding named `WAITLIST_DB`. The committed Wrangler config is the source of truth for CLI deployments; if configuring through the Cloudflare dashboard, use the same binding name and redeploy the Pages project.

Same-origin calls are accepted automatically. Local Vite development is allowed through `WAITLIST_ALLOWED_ORIGINS` in `wrangler.jsonc`; add the production custom origin there only if the form is ever called cross-origin.

To inspect entries safely, query only the columns needed and treat exported data as private user data:
```bash
npx wrangler d1 execute agentdock-waitlist --remote --command "SELECT id, name, email, use_case, source, created_at FROM aigency_waitlist ORDER BY created_at DESC LIMIT 50"
npx wrangler d1 export agentdock-waitlist --remote --output ./.private/waitlist-export.sql
```
Do not commit exports or share them publicly.

## Protected Content Management
The protected admin interface is available at:
```text
/admin
```

It is intentionally not linked from the public navigation. The admin system uses Cloudflare Pages Functions, the existing `WAITLIST_DB` D1 binding, signed `HttpOnly` cookies, and D1-backed content tables.

### Required Secrets
Set these as Cloudflare Pages secrets, not public variables:
```text
ADMIN_PASSWORD_HASH
ADMIN_SESSION_SECRET
```

Generate both values locally:
```bash
npm run admin:credentials -- "replace-with-a-long-admin-password"
```

For local Pages development, copy `.dev.vars.example` to `.dev.vars` and paste the generated values there. Do not commit `.dev.vars`.

For production, set the secrets in Cloudflare:
```bash
npx wrangler pages secret put ADMIN_PASSWORD_HASH
npx wrangler pages secret put ADMIN_SESSION_SECRET
```

### CMS Migrations
The CMS uses the existing D1 database and does not create a second database. Apply migrations locally and remotely:
```bash
npm run db:migrate:local
npm run db:migrate:remote
```

The migration creates:
- `blog_posts`
- `technical_content`
- `admin_login_attempts`

It also seeds the current AIgency Technical Architecture content only when `technical_content` is empty, so future admin edits are not overwritten by deployment.

### Local Admin Development
Run the Pages build with Functions and local D1:
```bash
npm run db:migrate:local
npm run dev:pages
```

Open the local Pages URL, then visit `/admin` and sign in with the password used to generate `ADMIN_PASSWORD_HASH`.

### Blog Publishing
From `/admin`:
1. Open Blog.
2. Create a new post.
3. Fill in title, slug, description, category, optional cover image, and Markdown content.
4. Use the live preview to check the public article layout.
5. Save draft or publish explicitly.

Draft posts are not returned from the public `/api/blog` endpoints. Publishing sets `status = published` and sets `published_at` the first time a post is published. Unpublishing returns the post to draft without deleting its content.

### Technical Architecture Editing
From `/admin`, open AIgency Technical Architecture. Each public section has a stable key, title, Markdown body, optional Mermaid source, sort order, and visibility setting.

Saving a technical section updates `/aigency/technical` immediately. Mermaid diagrams are previewed in the admin UI, and invalid Mermaid source is rejected before saving where possible.

### Backups
Treat CMS exports as private content and keep them outside Git:
```bash
npx wrangler d1 export agentdock-waitlist --remote --output ./.private/cms-backup.sql
npx wrangler d1 execute agentdock-waitlist --remote --command "SELECT id, slug, title, status, published_at, updated_at FROM blog_posts ORDER BY updated_at DESC"
npx wrangler d1 execute agentdock-waitlist --remote --command "SELECT id, section_key, title, sort_order, is_visible, updated_at FROM technical_content ORDER BY sort_order ASC"
```
The `.private/` directory is ignored by Git.

## Available Routes
- `/` - Homepage explaining AgentDock
- `/downloads` - Direct binary downloads for Windows, macOS, and Linux
- `/aigency` - Marketing overview of the planned AIgency coordination layer
- `/aigency/technical` - Deep dive into the technical architecture of AIgency
- `/blog` - AgentDock news and updates
- `/blog/:slug` - Individual blog posts
- `/admin` - Protected content management interface
