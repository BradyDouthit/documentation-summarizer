import fs from "fs/promises";
import path from "path";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

const MODEL_ID = "llama3.1";

let context: number[] = [];

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
    system: `${systemPrompt}<references>${references}</references>`,
    context,
  });

  // This allows the model to recal previous requests from the user
  context = response.context;

  return response.response;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { url, question } = await request.json();

    if (url) {
      const resp = await getPageContents(url);

      if (resp.status === 200) {
        const rawHTML = await resp.text();
        const purified = purifyHTML(rawHTML);
        const answer = await generateAnswer(question, purified);

        return json({ answer, error: answer });
      }
    }

    // No references provided
    const answer = await generateAnswer(question, "");

    return json({ answer, error: answer });
  } catch (err) {
    return error(500, "Something unexpected happened");
  }
};
