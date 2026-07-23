import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  createPost,
  createTechnicalSection,
  deletePost,
  deleteTechnicalSection,
  getPublishedPost,
  handleLogin,
  handleLogout,
  listAdminPosts,
  listPublishedPosts,
  listTechnicalSections,
  requireAdminSession,
  updatePost,
  updateTechnicalSection,
  type CmsDatabase,
} from "../functions/_lib/cms";
import { onRequestGet as getPublicBlogPost } from "../functions/api/blog/[slug]";

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  cover_image: string | null;
  content_markdown: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type TechnicalRow = {
  id: number;
  section_key: string;
  title: string;
  content_markdown: string;
  mermaid_source: string | null;
  sort_order: number;
  is_visible: number;
  created_at: string;
  updated_at: string;
};

type AttemptRow = {
  attempt_key: string;
  failed_count: number;
  locked_until: string | null;
  updated_at: string;
};

class MockCmsDb implements CmsDatabase {
  private nextBlogId = 1;
  private nextTechnicalId = 2;
  private tick = 0;
  public blogPosts: BlogRow[] = [];
  public technicalSections: TechnicalRow[] = [
    {
      id: 1,
      section_key: "overview",
      title: "Technical overview",
      content_markdown: "Existing seeded content",
      mermaid_source: null,
      sort_order: 10,
      is_visible: 1,
      created_at: this.timestamp(),
      updated_at: this.timestamp(),
    },
  ];
  public attempts: AttemptRow[] = [];

  prepare(query: string) {
    const db = this;
    let values: unknown[] = [];

    return {
      bind(...bound: unknown[]) {
        values = bound;
        return this;
      },
      async first<T>() {
        return db.first(query, values) as T | null;
      },
      async all<T>() {
        return { success: true, results: db.all(query) as T[], meta: db.meta(0) };
      },
      async run<T>() {
        return { success: true, results: [] as T[], meta: db.run(query, values) };
      },
    };
  }

  private first(query: string, values: unknown[]) {
    if (query.includes("FROM admin_login_attempts")) {
      return this.attempts.find((attempt) => attempt.attempt_key === values[0]) ?? null;
    }

    if (query.includes("FROM blog_posts") && query.includes("WHERE id = ?1")) {
      return this.blogPosts.find((post) => post.id === Number(values[0])) ?? null;
    }

    if (query.includes("FROM blog_posts") && query.includes("WHERE slug = ?1 AND status = 'published'")) {
      return this.blogPosts.find((post) => post.slug === values[0] && post.status === "published") ?? null;
    }

    if (query.includes("FROM blog_posts") && query.includes("WHERE slug = ?1")) {
      return this.blogPosts.find((post) => post.slug === values[0]) ?? null;
    }

    if (query.includes("FROM technical_content") && query.includes("WHERE id = ?1")) {
      return this.technicalSections.find((section) => section.id === Number(values[0])) ?? null;
    }

    return null;
  }

  private all(query: string) {
    if (query.includes("FROM blog_posts") && query.includes("WHERE status = 'published'")) {
      return [...this.blogPosts]
        .filter((post) => post.status === "published")
        .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
    }

    if (query.includes("FROM blog_posts")) {
      return [...this.blogPosts].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    }

    if (query.includes("FROM technical_content") && query.includes("WHERE is_visible = 1")) {
      return [...this.technicalSections]
        .filter((section) => section.is_visible === 1)
        .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
    }

    if (query.includes("FROM technical_content")) {
      return [...this.technicalSections].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
    }

    return [];
  }

  private run(query: string, values: unknown[]) {
    if (query.includes("INSERT INTO admin_login_attempts")) {
      const existing = this.attempts.find((attempt) => attempt.attempt_key === values[0]);
      if (existing) {
        existing.failed_count = Number(values[1]);
        existing.locked_until = values[2] as string | null;
        existing.updated_at = this.timestamp();
      } else {
        this.attempts.push({
          attempt_key: values[0] as string,
          failed_count: Number(values[1]),
          locked_until: values[2] as string | null,
          updated_at: this.timestamp(),
        });
      }
      return this.meta(1);
    }

    if (query.includes("DELETE FROM admin_login_attempts")) {
      this.attempts = this.attempts.filter((attempt) => attempt.attempt_key !== values[0]);
      return this.meta(1);
    }

    if (query.includes("INSERT INTO blog_posts")) {
      const slug = values[0] as string;
      if (this.blogPosts.some((post) => post.slug === slug)) {
        throw new Error("UNIQUE constraint failed: blog_posts.slug");
      }
      const now = this.timestamp();
      const row: BlogRow = {
        id: this.nextBlogId++,
        slug,
        title: values[1] as string,
        description: values[2] as string,
        category: values[3] as string | null,
        cover_image: values[4] as string | null,
        content_markdown: values[5] as string,
        status: values[6] as "draft" | "published",
        published_at: values[7] as string | null,
        created_at: now,
        updated_at: now,
      };
      this.blogPosts.push(row);
      return { ...this.meta(1), last_row_id: row.id };
    }

    if (query.includes("UPDATE blog_posts")) {
      const id = Number(values[8]);
      const row = this.blogPosts.find((post) => post.id === id);
      if (!row) return this.meta(0);
      const slug = values[0] as string;
      if (this.blogPosts.some((post) => post.slug === slug && post.id !== id)) {
        throw new Error("UNIQUE constraint failed: blog_posts.slug");
      }
      row.slug = slug;
      row.title = values[1] as string;
      row.description = values[2] as string;
      row.category = values[3] as string | null;
      row.cover_image = values[4] as string | null;
      row.content_markdown = values[5] as string;
      row.status = values[6] as "draft" | "published";
      row.published_at = values[7] as string | null;
      row.updated_at = this.timestamp();
      return this.meta(1);
    }

    if (query.includes("DELETE FROM blog_posts")) {
      const before = this.blogPosts.length;
      this.blogPosts = this.blogPosts.filter((post) => post.id !== Number(values[0]));
      return this.meta(before - this.blogPosts.length);
    }

    if (query.includes("INSERT INTO technical_content")) {
      const sectionKey = values[0] as string;
      if (this.technicalSections.some((section) => section.section_key === sectionKey)) {
        throw new Error("UNIQUE constraint failed: technical_content.section_key");
      }
      const now = this.timestamp();
      this.technicalSections.push({
        id: this.nextTechnicalId++,
        section_key: sectionKey,
        title: values[1] as string,
        content_markdown: values[2] as string,
        mermaid_source: values[3] as string | null,
        sort_order: Number(values[4]),
        is_visible: Number(values[5]),
        created_at: now,
        updated_at: now,
      });
      return this.meta(1);
    }

    if (query.includes("UPDATE technical_content")) {
      const id = Number(values[6]);
      const row = this.technicalSections.find((section) => section.id === id);
      if (!row) return this.meta(0);
      const sectionKey = values[0] as string;
      if (this.technicalSections.some((section) => section.section_key === sectionKey && section.id !== id)) {
        throw new Error("UNIQUE constraint failed: technical_content.section_key");
      }
      row.section_key = sectionKey;
      row.title = values[1] as string;
      row.content_markdown = values[2] as string;
      row.mermaid_source = values[3] as string | null;
      row.sort_order = Number(values[4]);
      row.is_visible = Number(values[5]);
      row.updated_at = this.timestamp();
      return this.meta(1);
    }

    if (query.includes("DELETE FROM technical_content")) {
      const before = this.technicalSections.length;
      this.technicalSections = this.technicalSections.filter((section) => section.id !== Number(values[0]));
      return this.meta(before - this.technicalSections.length);
    }

    return this.meta(0);
  }

  private timestamp() {
    this.tick += 1;
    return new Date(1_800_000_000_000 + this.tick * 1000).toISOString();
  }

  private meta(changes: number) {
    return {
      duration: 1,
      size_after: 1,
      rows_read: 0,
      rows_written: changes,
      last_row_id: changes,
      changed_db: changes > 0,
      changes,
    };
  }
}

function passwordHash(password: string) {
  const salt = randomBytes(16);
  const hash = createHash("sha256").update(salt).update("\0").update(password).digest();
  return `sha256$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

function jsonRequest(url: string, body: unknown, cookie?: string) {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "cms-test",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function responseJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function basePost(slug = "first-post") {
  return {
    title: "First Post",
    slug,
    description: "A real update.",
    category: "News",
    coverImage: "/agentdock-screenshot.png",
    contentMarkdown: "# Hello\n\nThis is a post.",
    status: "draft",
    publishedAt: null,
  };
}

function baseSection(sectionKey = "new-section") {
  return {
    sectionKey,
    title: "New section",
    contentMarkdown: "Technical content.",
    mermaidSource: "flowchart LR\n  A --> B",
    sortOrder: 20,
    isVisible: true,
  };
}

const tests: Array<[string, () => Promise<void>]> = [
  [
    "authentication accepts correct password and creates signed session",
    async () => {
      const db = new MockCmsDb();
      const secret = "test-session-secret";
      const response = await handleLogin(jsonRequest("https://example.com/api/admin/auth/login", { password: "correct-password" }), {
        WAITLIST_DB: db,
        ADMIN_PASSWORD_HASH: passwordHash("correct-password"),
        ADMIN_SESSION_SECRET: secret,
      });
      assert.equal(response.status, 200);
      const setCookie = response.headers.get("Set-Cookie") ?? "";
      assert.match(setCookie, /admin_session=/);
      assert.match(setCookie, /HttpOnly/);
      assert.match(setCookie, /Secure/);
      assert.match(setCookie, /SameSite=Strict/);

      const session = await requireAdminSession(new Request("https://example.com/api/admin/blog", { headers: { Cookie: setCookie } }), {
        WAITLIST_DB: db,
        ADMIN_SESSION_SECRET: secret,
      });
      assert.deepEqual(session, { ok: true });
    },
  ],
  [
    "authentication rejects incorrect password",
    async () => {
      const db = new MockCmsDb();
      const response = await handleLogin(jsonRequest("https://example.com/api/admin/auth/login", { password: "wrong-password" }), {
        WAITLIST_DB: db,
        ADMIN_PASSWORD_HASH: passwordHash("correct-password"),
        ADMIN_SESSION_SECRET: "secret",
      });
      assert.equal(response.status, 401);
    },
  ],
  [
    "missing session is rejected",
    async () => {
      const session = await requireAdminSession(new Request("https://example.com/api/admin/blog"), {
        WAITLIST_DB: new MockCmsDb(),
        ADMIN_SESSION_SECRET: "secret",
      });
      assert.equal("response" in session ? session.response.status : 200, 401);
    },
  ],
  [
    "invalid session is rejected",
    async () => {
      const session = await requireAdminSession(new Request("https://example.com/api/admin/blog", { headers: { Cookie: "admin_session=invalid" } }), {
        WAITLIST_DB: new MockCmsDb(),
        ADMIN_SESSION_SECRET: "secret",
      });
      assert.equal("response" in session ? session.response.status : 200, 401);
    },
  ],
  [
    "logout clears the session cookie",
    async () => {
      const response = await handleLogout(new Request("https://example.com/api/admin/auth/logout"));
      assert.equal(response.status, 200);
      assert.match(response.headers.get("Set-Cookie") ?? "", /Max-Age=0/);
    },
  ],
  [
    "protected route rejection uses missing session response",
    async () => {
      const session = await requireAdminSession(new Request("https://example.com/api/admin/technical-architecture"), {
        WAITLIST_DB: new MockCmsDb(),
        ADMIN_SESSION_SECRET: "secret",
      });
      assert.equal("response" in session ? (await responseJson(session.response)).ok : true, false);
    },
  ],
  [
    "blog create, edit, publish, unpublish, and delete",
    async () => {
      const db = new MockCmsDb();
      const create = await createPost(db, basePost());
      assert.equal(create.status, 201);
      let post = (await listAdminPosts(db))[0];
      assert.equal(post.status, "draft");

      const edit = await updatePost(db, post.id, { ...basePost(), title: "Edited Post", updatedAt: post.updatedAt });
      assert.equal(edit.status, 200);
      post = (await listAdminPosts(db))[0];
      assert.equal(post.title, "Edited Post");

      const publish = await updatePost(db, post.id, { ...basePost(), title: "Edited Post", status: "published", updatedAt: post.updatedAt });
      assert.equal(publish.status, 200);
      assert.equal((await listPublishedPosts(db)).length, 1);

      post = (await listAdminPosts(db))[0];
      const unpublish = await updatePost(db, post.id, { ...basePost(), title: "Edited Post", status: "draft", updatedAt: post.updatedAt });
      assert.equal(unpublish.status, 200);
      assert.equal((await listPublishedPosts(db)).length, 0);

      post = (await listAdminPosts(db))[0];
      const deleted = await deletePost(db, post.id);
      assert.equal(deleted.status, 200);
      assert.equal((await listAdminPosts(db)).length, 0);
    },
  ],
  [
    "duplicate blog slug is rejected",
    async () => {
      const db = new MockCmsDb();
      await createPost(db, basePost("same-slug"));
      const duplicate = await createPost(db, basePost("same-slug"));
      assert.equal(duplicate.status, 409);
    },
  ],
  [
    "invalid blog slug is rejected",
    async () => {
      const response = await createPost(new MockCmsDb(), basePost("!!!"));
      assert.equal(response.status, 400);
    },
  ],
  [
    "public blog excludes drafts",
    async () => {
      const db = new MockCmsDb();
      await createPost(db, basePost("draft-post"));
      assert.equal((await listPublishedPosts(db)).length, 0);
      assert.equal(await getPublishedPost(db, "draft-post"), null);
    },
  ],
  [
    "markdown sanitisation rejects unsafe markdown",
    async () => {
      const response = await createPost(new MockCmsDb(), {
        ...basePost("unsafe-post"),
        contentMarkdown: "Hello <script>alert(1)</script>",
      });
      assert.equal(response.status, 400);
      assert.equal((await responseJson(response)).error, "Markdown contains unsafe HTML.");
    },
  ],
  [
    "missing public blog post returns 404",
    async () => {
      const response = await getPublicBlogPost({
        env: { WAITLIST_DB: new MockCmsDb() },
        params: { slug: "missing-post" },
      });
      assert.equal(response.status, 404);
    },
  ],
  [
    "technical content read, edit, add, reorder, hide, and delete",
    async () => {
      const db = new MockCmsDb();
      assert.equal((await listTechnicalSections(db, true)).length, 1);

      let section = (await listTechnicalSections(db, true))[0];
      const edit = await updateTechnicalSection(db, section.id, {
        ...baseSection("overview"),
        title: "Updated overview",
        sortOrder: 30,
        updatedAt: section.updatedAt,
      });
      assert.equal(edit.status, 200);

      const add = await createTechnicalSection(db, baseSection("task-graph"));
      assert.equal(add.status, 201);
      assert.equal((await listTechnicalSections(db, true)).length, 2);

      section = (await listTechnicalSections(db, true)).find((item) => item.sectionKey === "task-graph")!;
      const hide = await updateTechnicalSection(db, section.id, {
        ...baseSection("task-graph"),
        sortOrder: 5,
        isVisible: false,
        updatedAt: section.updatedAt,
      });
      assert.equal(hide.status, 200);
      assert.equal((await listTechnicalSections(db, false)).some((item) => item.sectionKey === "task-graph"), false);

      const deleted = await deleteTechnicalSection(db, section.id);
      assert.equal(deleted.status, 200);
      assert.equal((await listTechnicalSections(db, true)).length, 1);
    },
  ],
  [
    "invalid Mermaid is rejected",
    async () => {
      const response = await createTechnicalSection(new MockCmsDb(), {
        ...baseSection("bad-diagram"),
        mermaidSource: "not a mermaid graph",
      });
      assert.equal(response.status, 400);
    },
  ],
  [
    "public technical API excludes hidden sections",
    async () => {
      const db = new MockCmsDb();
      await createTechnicalSection(db, { ...baseSection("hidden-section"), isVisible: false });
      assert.equal((await listTechnicalSections(db, false)).some((section) => section.sectionKey === "hidden-section"), false);
    },
  ],
  [
    "technical seed migration does not overwrite existing content",
    async () => {
      const migration = readFileSync("migrations/0002_create_cms_tables.sql", "utf8");
      assert.match(migration, /WHERE NOT EXISTS \(SELECT 1 FROM technical_content\)/);
    },
  ],
];

for (const [name, run] of tests) {
  await run();
  console.log(`ok - ${name}`);
}
