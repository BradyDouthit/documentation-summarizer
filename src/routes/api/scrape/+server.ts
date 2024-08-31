import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";

const SYSTEM_PROMPT = `You are a highly specialized language model designed to identify developer tools, programming languages, frameworks, libraries, and any technical documentation references within a given text. Your primary task is to read the provided text and output only the detected tools or technologies wrapped in Markdown code block syntax.

Key Instructions:

Do not add an overview of anything you find. You must ONLY answer with the tools identified.

Detection and Tagging:

Accurately identify and tag developer tools, programming languages, libraries, frameworks, or technical documentation references within backticks (\`) to denote code blocks in Markdown.
Example: Given the text "We use React and Node.js for our project," your output should be: "React Node.js".
Output Only Tools:

Output only the detected tools in Markdown format, with each tool wrapped in backticks (\``;

const MODEL_ID = "llama3.1";

function getTextContent(html: string) {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent;
}

async function consumeDocs(docs: string) {
  // const systemPrompt = SYSTEM_PROMPT + docs;
  console.log(`Asking ${MODEL_ID} prompt length ${docs.length}`);
  const response = await ollama.generate({
    model: MODEL_ID,
    system: SYSTEM_PROMPT,
    prompt: docs,
  });

  return response.response;
  // const systemPrompt = { role: "system", content: SYSTEM_PROMPT };
  // const response = await ollama.chat({
  //   model: MODEL_ID,
  //   messages: [
  //     systemPrompt,
  //     { role: "user", content: "Please write 250 words about anything" },
  //   ],
  // });
  // console.log(response.message);
  // return response.message.content;
}

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();
  const resp = await fetch(url);

  if (resp.status === 200) {
    const html = await resp.text();
    const text = getTextContent(html);
    const answer = await consumeDocs(text);
    return json({ answer, text });
  }

  return error(resp.status, "Something unexpected happened");
};
