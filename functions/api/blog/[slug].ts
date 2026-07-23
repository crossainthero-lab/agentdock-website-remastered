import { getPublishedPost, jsonError, jsonOk, normalizeSlug, type CmsEnv } from "../../_lib/cms";

export const onRequestGet = async ({
  env,
  params,
}: {
  env: CmsEnv;
  params: { slug: string };
}) => {
  const slug = normalizeSlug(params.slug);
  const post = await getPublishedPost(env.WAITLIST_DB, slug);
  if (!post) {
    return jsonError("Blog post was not found.", 404);
  }

  return jsonOk(post);
};
