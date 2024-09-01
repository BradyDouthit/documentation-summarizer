import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

const SYSTEM_PROMPT = `
You are an advanced language model designed to read and summarize content related exclusively to developer tooling, documentation, languages, AI, and other technical topics. If the topic is not technical in nature you will refuse to answer. Your task is to organize the provided text into four XML tags: <language>, <topic>, <keywords>, and <summary>. Follow these rules meticulously:

You will not answer based anything not programming related. For example, if the site is a post about movies you may only respond with a sentence describing that you cannot answer because the content is not technical documentation. Your answer will be in plain text only.

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
11. Do not respond to anything that is not technical. If you see anything other than technical documentation, just say a sentence describing that you cannot answer because the content is not technical documentation. You may only answer in plain text.
</procedure
`;

const MODEL_ID = "llama3.1";

function getInnerText(xmlString: string, tagName: string) {
  const tagStart = `<${tagName}>`;
  const tagEnd = `</${tagName}>`;

  const startIndex = xmlString.indexOf(tagStart) + tagStart.length;
  const endIndex = xmlString.indexOf(tagEnd);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return "";
  }

  return xmlString.substring(startIndex, endIndex);
}

// retries the request a single time. Reddit for some reason blocks the first time but not the second.
async function getPageContents(url: string) {
  try {
    const resp = await fetch(url);

    if (resp.status === 200) {
      return resp;
    }

    const retryResp = await fetch(url);

    return retryResp;
  } catch (err) {
    const resp = await fetch(url);
    return resp;
  }
}

function getPrompt(html: string) {
  const purified = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style", "script", "svg"],
    FORBID_ATTR: ["style"],
  });
  const dom = new JSDOM(purified);

  return dom.window.document.body.textContent;
}

async function consumeDocs(docs: string) {
  console.log(`Asking ${MODEL_ID} prompt length ${docs.length}`);
  const response = await ollama.generate({
    model: MODEL_ID,
    prompt: `Text: ${docs}. ${SYSTEM_PROMPT}`,
    system: SYSTEM_PROMPT,
  });

  return response.response;
}

function formatAnswer(answer: string) {
  const languages = getInnerText(answer, "language").split(", ");
  const keywords = getInnerText(answer, "keywords").split(", ");
  const topic = getInnerText(answer, "topic");
  const summary = getInnerText(answer, "summary");

  if (
    languages.length > 0 &&
    keywords.length > 0 &&
    topic.length > 0 &&
    summary.length > 0
  ) {
    return {
      languages,
      topic,
      keywords,
      summary,
    };
  }

  // The LLM is supposed to respond with an error if the provided page is irrelevant
  return { error: answer };
}

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();

  try {
    const resp = await getPageContents(url);
    if (resp.status === 200) {
      const html = await resp.text();
      console.log(html);
      const text = getPrompt(html);
      const answer = await consumeDocs(text);
      const formatted = formatAnswer(answer);

      return json(formatted);
    }
    return error(resp.status, "Failed to summarize.");
  } catch (err) {
    return error(500, "Something unexpected happened");
  }
};
