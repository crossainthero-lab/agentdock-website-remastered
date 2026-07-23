import { handleLogout } from "../../../_lib/cms";

export const onRequestPost = async ({ request }: { request: Request }) => {
  return handleLogout(request);
};
