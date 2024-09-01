import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

const SYSTEM_PROMPT = `
You are an advanced language model designed to read and summarize content related exclusively to developer tooling, documentation, and languages. Your task is to organize the provided text into four XML tags: <language>, <topic>, <keywords>, and <summary>. Follow these rules meticulously:

<procedure>
1. <language> tags must contain the programming language detected. If no programming language is detected then answer with <language>Unknown</language>
2. <topic> tags must contain a short description of the topic of the request
3. <keywords> tags must contain a comma separated list of relavent tools, data structures, languages, frameworks etc.
4. <summary> tags must contain a more in depth description of the request
5. Strict Content Adherence: You must never cite or reference anything outside the content provided. Every element of your response must be directly derived from the input text.
6. Tag Exclusivity: Your response should only contain the four specified tags: <language>, <topic>, <keywords>, and <summary>. No other tags or additional information should be included.
7. Tag Uniqueness: Each of the four tags must appear exactly once in the response—no more, no less.
8. Content Filtering: If the provided text isn't related to developer tooling, documentation, or programming languages, refuse to generate a response.
9. You will be provided with examples via <examples> XML tags. Under no circumstances should these be used in the response.
</procedure

<examples>
Input: "This guide provides an in-depth overview of how to integrate Elasticsearch into a Node.js application. Elasticsearch is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases. The setup process includes installing Elasticsearch using npm, configuring the Elasticsearch client, and setting up the Node.js application to communicate with the Elasticsearch server. The document also covers troubleshooting common issues, such as connection errors and indexing performance, and provides best practices for scaling your Elasticsearch infrastructure. Additionally, advanced topics such as custom analyzers, query optimization, and security configurations are addressed."

Output:
<language>JavaScript</language>
<topic>Integrating Elasticsearch with Node.js</topic>
<keywords>Elasticsearch, Node.js, RESTful, search engine, analytics engine, npm, Elasticsearch client, troubleshooting, scaling, custom analyzers, query optimization, security configurations</keywords>
<summary>This guide offers a comprehensive overview of integrating Elasticsearch into a Node.js application. It covers installation, client configuration, and communication setup, along with troubleshooting, scaling practices, and advanced topics like custom analyzers and security settings.</summary>

Input: "Overview ¶
Package sql provides a generic interface around SQL (or SQL-like) databases.

The sql package must be used in conjunction with a database driver. See https://golang.org/s/sqldrivers for a list of drivers.

Drivers that do not support context cancellation will not return until after the query is completed."
Output:
<language>Golang</language>
<topic>Implementing an SQL-Like database</topic>
<keywords>SQL, database</keywords>

Input: "This document is a company holiday policy for the year 2024."
Output: Refuse to generate a response.
</examples>
`;

const MODEL_ID = "llama3.1";

function getTextContent(html: string) {
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
    const text = getTextContent(html);
    console.log(text);
    const answer = await consumeDocs(text);
    return json({ answer, text });
  }

  return error(resp.status, "Something unexpected happened");
};
