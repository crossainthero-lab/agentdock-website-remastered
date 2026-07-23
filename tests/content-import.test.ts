import assert from "node:assert/strict";
import { filenameTitle, parseMarkdownImport, slugify } from "../src/lib/contentImport";

{
  const imported = parseMarkdownImport(
    `---
title: "Launch Notes"
slug: custom-launch
description: AgentDock update
category: Release
cover_image: /images/launch.png
---
# Ignored Heading

Body copy.`,
    "fallback.md",
  );

  assert.equal(imported.title, "Launch Notes");
  assert.equal(imported.slug, "custom-launch");
  assert.equal(imported.description, "AgentDock update");
  assert.equal(imported.category, "Release");
  assert.equal(imported.coverImage, "/images/launch.png");
  assert.equal(imported.markdown, "# Ignored Heading\n\nBody copy.");
  console.log("ok - markdown import reads front matter");
}

{
  const imported = parseMarkdownImport("# Technical Overview\n\nArchitecture details.", "technical-overview.md");

  assert.equal(imported.title, "Technical Overview");
  assert.equal(imported.slug, "technical-overview");
  assert.equal(imported.markdown, "# Technical Overview\n\nArchitecture details.");
  console.log("ok - markdown import derives title and slug from heading");
}

{
  const imported = parseMarkdownImport(
    `# Task Graph

The graph coordinates work.

\`\`\`mermaid
flowchart LR
  A --> B
\`\`\`

More notes.`,
    "task-graph.md",
    { extractMermaid: true },
  );

  assert.equal(imported.title, "Task Graph");
  assert.equal(imported.mermaidSource, "flowchart LR\n  A --> B");
  assert.equal(imported.markdown, "# Task Graph\n\nThe graph coordinates work.\n\n\n\nMore notes.");
  console.log("ok - technical import extracts fenced Mermaid");
}

{
  assert.equal(filenameTitle("shared_context.md"), "Shared Context");
  assert.equal(slugify("Shared Context: Agent Handoffs!"), "shared-context-agent-handoffs");
  console.log("ok - filename title and slug helpers normalise content names");
}
