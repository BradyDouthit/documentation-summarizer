import fs from "fs/promises";
import path from "path";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

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

async function getSystemPrompt() {
  try {
    const url = new URL("./system-prompt.txt", import.meta.url);
    const fileContent = await fs.readFile(url, "utf8");
    return fileContent;
  } catch (err) {
    return "";
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
  const systemPrompt = await getSystemPrompt();
  const response = await ollama.generate({
    model: MODEL_ID,
    prompt: `Text: ${docs}. ${systemPrompt}`,
    system: systemPrompt,
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
      const text = getPrompt(html);
      // TODO: experiment with a separate small prompt that simply asks the LLM if the URL itself is relevant based on the subject
      const answer = await consumeDocs(text);
      const formatted = formatAnswer(answer);

      return json(formatted);
    }
    return error(resp.status, "Failed to summarize.");
  } catch (err) {
    return error(500, "Something unexpected happened");
  }
};
