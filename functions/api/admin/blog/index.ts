import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, json, readJson, type DbEnv, type PagesFunction } from "../../../_shared/http";
import { blogSelect, getBlogSchema, insertBlogPost } from "../../../_shared/blogStorage";
import { serializeBlogPost } from "../../../_shared/serializers";
import { createId, validateBlogPostInput } from "../../../_shared/validation";

type Env = DbEnv;

export const onRequestGet: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const schema = await getBlogSchema(env);
  const posts = await schema.db.prepare(
    `SELECT ${blogSelect(schema, false)}
     FROM blog_posts
     LEFT JOIN blog_post_blocks ON blog_post_blocks.post_id = CAST(blog_posts.id AS TEXT)
     ORDER BY datetime(updated_at) DESC
     LIMIT 200`,
  ).all();

  return json({ posts: (posts.results || []).map(serializeBlogPost) });
};

export const onRequestPost: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const parsed = await readJson<unknown>(request, 240000);
  if (parsed.ok === false) return parsed.response;

  const validation = validateBlogPostInput(parsed.data);
  if (validation.ok === false) {
    return json({ success: false, message: "Please check the post and try again.", errors: validation.errors }, 400);
  }

  const id = createId("post");
  const publishedAt = validation.data.status === "published" ? new Date().toISOString() : null;

  try {
    const schema = await getBlogSchema(env);
    const savedId = await insertBlogPost(schema, id, validation.data, publishedAt);

    return json({ success: true, id: savedId, slug: validation.data.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("UNIQUE constraint failed")) {
      return json({ success: false, message: "A post with that slug already exists.", errors: { slug: "Slug already exists." } }, 409);
    }
    return json({ success: false, message: "The post could not be saved." }, 500);
  }
};
