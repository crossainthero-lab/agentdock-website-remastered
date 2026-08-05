import { getDb, type DbEnv, type D1Database } from "./http";
import type { ValidBlogPostInput } from "./validation";

type ColumnInfo = {
  name: string;
  type: string;
  pk: number;
};

type BlogSchema = {
  db: D1Database;
  columns: Set<string>;
  idIsInteger: boolean;
};

export async function getBlogSchema(env: DbEnv): Promise<BlogSchema> {
  const db = getDb(env);
  const columns = await db.prepare("PRAGMA table_info(blog_posts)").all<ColumnInfo>();
  const infos = columns.results || [];
  const idColumn = infos.find((column) => column.name === "id");
  return {
    db,
    columns: new Set(infos.map((column) => column.name)),
    idIsInteger: Boolean(idColumn?.type?.toUpperCase().includes("INT") && idColumn.pk),
  };
}

export function blogSelect(schema: BlogSchema, includeContent: boolean) {
  const excerpt = schema.columns.has("excerpt")
    ? "blog_posts.excerpt AS excerpt"
    : schema.columns.has("description")
      ? "blog_posts.description AS excerpt"
      : "NULL AS excerpt";
  const content = includeContent && schema.columns.has("content_markdown")
    ? "blog_posts.content_markdown AS content_markdown"
    : "'' AS content_markdown";
  const contentBlocks = schema.columns.has("content_blocks")
    ? "COALESCE(blog_post_blocks.content_blocks, blog_posts.content_blocks) AS content_blocks"
    : "blog_post_blocks.content_blocks AS content_blocks";
  const author = schema.columns.has("author") ? "blog_posts.author AS author" : "NULL AS author";

  return [
    "blog_posts.id AS id",
    "blog_posts.slug AS slug",
    "blog_posts.title AS title",
    excerpt,
    content,
    contentBlocks,
    "blog_posts.status AS status",
    author,
    "blog_posts.published_at AS published_at",
    "blog_posts.created_at AS created_at",
    "blog_posts.updated_at AS updated_at",
  ].join(", ");
}

export async function saveBlogBlocks(db: D1Database, postId: string | number, blocks: ValidBlogPostInput["contentBlocks"]) {
  await db.prepare(
    `INSERT INTO blog_post_blocks (post_id, content_blocks, updated_at)
     VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     ON CONFLICT(post_id) DO UPDATE SET
       content_blocks = excluded.content_blocks,
       updated_at = excluded.updated_at`,
  )
    .bind(String(postId), blocks ? JSON.stringify(blocks) : null)
    .run();
}

export async function insertBlogPost(schema: BlogSchema, id: string, post: ValidBlogPostInput, publishedAt: string | null) {
  const db = schema.db;
  const excerptColumn = schema.columns.has("excerpt") ? "excerpt" : "description";
  const columns = ["slug", "title", excerptColumn, "content_markdown", "status", "published_at"];
  const values: unknown[] = [post.slug, post.title, post.excerpt || "", post.contentMarkdown, post.status, publishedAt];

  if (!schema.idIsInteger) {
    columns.unshift("id");
    values.unshift(id);
  }
  if (schema.columns.has("content_blocks")) {
    columns.push("content_blocks");
    values.push(post.contentBlocks ? JSON.stringify(post.contentBlocks) : null);
  }
  if (schema.columns.has("author")) {
    columns.push("author");
    values.push(post.author);
  }

  await db.prepare(
    `INSERT INTO blog_posts (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
  )
    .bind(...values)
    .run();

  const saved = await db.prepare("SELECT id FROM blog_posts WHERE slug = ?").bind(post.slug).first<{ id: string | number }>();
  const savedId = saved?.id ?? id;
  await saveBlogBlocks(db, savedId, post.contentBlocks);
  return savedId;
}

export async function updateBlogPost(
  schema: BlogSchema,
  id: string,
  post: ValidBlogPostInput,
  publishedAt: string | null,
) {
  const db = schema.db;
  const assignments = [
    "slug = ?",
    "title = ?",
    `${schema.columns.has("excerpt") ? "excerpt" : "description"} = ?`,
    "content_markdown = ?",
    "status = ?",
    "published_at = ?",
    "updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')",
  ];
  const values: unknown[] = [post.slug, post.title, post.excerpt || "", post.contentMarkdown, post.status, publishedAt];

  if (schema.columns.has("content_blocks")) {
    assignments.splice(4, 0, "content_blocks = ?");
    values.splice(4, 0, post.contentBlocks ? JSON.stringify(post.contentBlocks) : null);
  }
  if (schema.columns.has("author")) {
    assignments.splice(assignments.length - 2, 0, "author = ?");
    values.splice(values.length - 1, 0, post.author);
  }

  await db.prepare(`UPDATE blog_posts SET ${assignments.join(", ")} WHERE id = ?`)
    .bind(...values, id)
    .run();
  await saveBlogBlocks(db, id, post.contentBlocks);
}
