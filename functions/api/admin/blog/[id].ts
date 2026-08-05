import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, json, readJson, type DbEnv, type PagesFunction } from "../../../_shared/http";
import { blogSelect, getBlogSchema, updateBlogPost } from "../../../_shared/blogStorage";
import { serializeBlogPost } from "../../../_shared/serializers";
import { validateBlogPostInput } from "../../../_shared/validation";

type Env = DbEnv;

type Params = { id: string };

export const onRequestGet: PagesFunction<Env & AdminAuthEnv, Params> = async ({ request, env, params }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const schema = await getBlogSchema(env);
  const post = await schema.db.prepare(
    `SELECT ${blogSelect(schema, true)}
     FROM blog_posts
     LEFT JOIN blog_post_blocks ON blog_post_blocks.post_id = CAST(blog_posts.id AS TEXT)
     WHERE id = ?`,
  )
    .bind(params.id)
    .first();

  if (!post) return json({ message: "Post not found." }, 404);
  return json({ post: serializeBlogPost(post as Record<string, unknown>) });
};

export const onRequestPatch: PagesFunction<Env & AdminAuthEnv, Params> = async ({ request, env, params }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const parsed = await readJson<unknown>(request, 240000);
  if (parsed.ok === false) return parsed.response;

  const validation = validateBlogPostInput(parsed.data);
  if (validation.ok === false) {
    return json({ success: false, message: "Please check the post and try again.", errors: validation.errors }, 400);
  }

  const schema = await getBlogSchema(env);
  const existing = await schema.db.prepare("SELECT id, published_at FROM blog_posts WHERE id = ?")
    .bind(params.id)
    .first<{ id: string; published_at: string | null }>();
  if (!existing) return json({ message: "Post not found." }, 404);

  const publishedAt =
    validation.data.status === "published" ? existing.published_at || new Date().toISOString() : null;

  try {
    await updateBlogPost(schema, params.id, validation.data, publishedAt);

    return json({ success: true, id: params.id, slug: validation.data.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("UNIQUE constraint failed")) {
      return json({ success: false, message: "A post with that slug already exists.", errors: { slug: "Slug already exists." } }, 409);
    }
    return json({ success: false, message: "The post could not be saved." }, 500);
  }
};
