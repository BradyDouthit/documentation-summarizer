import fs from "fs/promises";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

const MODEL_ID = "llama3.1";

let context: number[] = [];

function getInnerText(xmlString: string, tagName: string, partial = true) {
  const tagStart = `<${tagName}>`;
  const tagEnd = `</${tagName}>`;

  const startIndex = xmlString.indexOf(tagStart) + tagStart.length;
  const endIndex = xmlString.indexOf(tagEnd);

  if (
    (!partial && startIndex === -1) ||
    endIndex === -1 ||
    endIndex < startIndex
  ) {
    return "";
  }

  return xmlString.substring(startIndex, endIndex);
}

async function fetchWithRetry(url: string) {
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

// retries the request a single time. Reddit for some reason blocks the first time but not the second.
async function getPageContents(urls: string[]) {
  try {
    const promises = urls.map(async (url) => {
      const resp = await fetchWithRetry(url);
      const html = await resp.text();
      return html;
    });
    const pages = await Promise.all(promises);
    return pages.map((page) => `<reference>${purifyHTML(page)}</reference>`);
  } catch (err) {
    return [];
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

function purifyHTML(html: string) {
  const purified = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style", "script", "svg"],
    FORBID_ATTR: ["style"],
  });
  const dom = new JSDOM(purified);

  return dom.window.document.body.textContent;
}

async function generateAnswer(question: string, references: string) {
  const systemPrompt = await getSystemPrompt();
  console.log(
    `Asking ${MODEL_ID} prompt length ${question.length + systemPrompt.length}`,
  );
  const response = await ollama.generate({
    model: MODEL_ID,
    prompt: question,
    system: `<references>${references}</references>${systemPrompt}`,
    context,
  });

  // This allows the model to recal previous requests from the user
  context = response.context;

  return response.response;
}

function convertAnswerToJSON(answer: string) {
  const info = getInnerText(answer, "info");
  const warning = getInnerText(answer, "warning");
  const error = getInnerText(answer, "error");

  if (!info && !warning && !error) {
    return { info, warning, error: answer };
  }

  return { info, warning, error, raw: answer };
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { urls, question } = await request.json();

    if (urls.length > 0) {
      const texts = await getPageContents(urls);
      const answer = await generateAnswer(question, texts.join(""));
      const parsed = convertAnswerToJSON(answer);
      return json(parsed);
    }

    // No references provided
    const answer = await generateAnswer(question, "");

    const parsed = convertAnswerToJSON(answer);
    return json(parsed);
  } catch (err) {
    return error(500, "Something unexpected happened");
  }
};
