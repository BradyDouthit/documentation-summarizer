import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();
  console.log(url);
  // console.time("Starting browser");
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // console.timeEnd("Starting browser");
  //
  // console.time("Getting Page");
  // await page.goto(params.url);
  // const content = await page.content();
  // console.log(content);
  // console.timeEnd("Getting Page");

  return json({ content: "" });
};
