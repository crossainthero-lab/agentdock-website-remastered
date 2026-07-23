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

## Available Routes
- `/` - Homepage explaining AgentDock
- `/downloads` - Direct binary downloads for Windows, macOS, and Linux
- `/aigency` - Marketing overview of the planned AIgency coordination layer
- `/aigency/technical` - Deep dive into the technical architecture of AIgency
- `/blog` - AgentDock news and updates
- `/blog/:slug` - Individual blog posts
