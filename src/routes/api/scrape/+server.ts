import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();
  const resp = await fetch(url);

  if (resp.status === 200) {
    const text = await resp.text();
    console.log(text);
    return json({ content: "yo" });
  }

  return error(resp.status, "Something unexpected happened");
};
