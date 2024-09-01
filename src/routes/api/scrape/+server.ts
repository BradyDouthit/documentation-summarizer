import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

const SYSTEM_PROMPT = `
You are an advanced language model designed to read and summarize content related exclusively to developer tooling, documentation, languages, AI, and other technical topics. Your task is to organize the provided text into four XML tags: <language>, <topic>, <keywords>, and <summary>. Follow these rules meticulously:

<procedure>
1. <language> tags must contain the programming language detected. If you do not know the programming language, answer with the most applicable singular word to describe the topic. If multiple languages are cited, list them as comma separated values within the language tag. Do not list the same language more than once.
2. <topic> tags must contain a short description of the topic of the text.
3. <keywords> tags must contain a comma separated list of relavent tools, data structures, languages, frameworks etc.
4. <summary> tags must contain a very in depth description of the text. It should include all relevant data structures and context required to interact with the text on a technical level. Do not recite the information exactly, but summarize it.
5. Strict Content Adherence: You must never cite or reference anything outside the content provided. Every element of your response must be directly derived from the input text.
6. Tag Exclusivity: Your response should only contain the four specified tags: <language>, <topic>, <keywords>, and <summary>. No other tags or additional information should be included.
7. Tag Uniqueness: Each of the four tags must appear exactly once in the response—no more, no less.
8. Content Filtering: If the provided text isn't related to developer tooling, documentation, or programming languages, refuse to generate a response.
9. You will not respond at all outside of the four specified tags.
10. Before submitting your answer, look through it and ensure all information is verifiable.
</procedure
`;

const MODEL_ID = "llama3.1";

function getPrompt(html: string) {
  const purified = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style", "script", "svg"],
    FORBID_ATTR: ["style"],
  });
  const dom = new JSDOM(purified);

  return dom.window.document.body.textContent;
}

async function consumeDocs(docs: string) {
  // const systemPrompt = SYSTEM_PROMPT + docs;
  console.log(`Asking ${MODEL_ID} prompt length ${docs.length}`);
  const response = await ollama.generate({
    model: MODEL_ID,
    prompt: `Text: ${docs}. ${SYSTEM_PROMPT}`,
    system: SYSTEM_PROMPT,
  });

  return response.response;
}

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();
  const resp = await fetch(url);

  if (resp.status === 200) {
    const html = await resp.text();
    const text = getPrompt(html);
    const answer = await consumeDocs(text);
    return json({ answer, text });
  }

  return error(resp.status, "Something unexpected happened");
};
