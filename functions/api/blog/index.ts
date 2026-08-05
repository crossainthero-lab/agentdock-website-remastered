import { getDb, json, type DbEnv, type PagesFunction } from "../../_shared/http";
import { blogSelect, getBlogSchema } from "../../_shared/blogStorage";
import { serializeBlogPost } from "../../_shared/serializers";

type Env = DbEnv;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const schema = await getBlogSchema(env);
  const posts = await schema.db.prepare(
    `SELECT ${blogSelect(schema, true)}
     FROM blog_posts
     LEFT JOIN blog_post_blocks ON blog_post_blocks.post_id = CAST(blog_posts.id AS TEXT)
     WHERE status = 'published'
     ORDER BY datetime(COALESCE(published_at, created_at)) DESC
     LIMIT 100`,
  ).all();

  return json({ posts: (posts.results || []).map(serializeBlogPost) });
};
