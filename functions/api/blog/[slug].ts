import { getDb, json, type DbEnv, type PagesFunction } from "../../_shared/http";
import { blogSelect, getBlogSchema } from "../../_shared/blogStorage";
import { serializeBlogPost } from "../../_shared/serializers";

type Env = DbEnv;

type Params = { slug: string };

export const onRequestGet: PagesFunction<Env, Params> = async ({ env, params }) => {
  const schema = await getBlogSchema(env);
  const post = await schema.db.prepare(
    `SELECT ${blogSelect(schema, true)}
     FROM blog_posts
     LEFT JOIN blog_post_blocks ON blog_post_blocks.post_id = CAST(blog_posts.id AS TEXT)
     WHERE slug = ? AND status = 'published'`,
  )
    .bind(params.slug)
    .first();

  if (!post) return json({ message: "Post not found." }, 404);
  return json({ post: serializeBlogPost(post as Record<string, unknown>) });
};
