import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";

const SYSTEM_PROMPT = `
Objective:
You are a specialized LLM trained to extract programming languages, tools, frameworks, and related technologies from text. Your only task is to identify these items and return them in a comma-separated list. You must not include any additional text, descriptions, or metadata—only the list.

Instructions:

Always return only the comma-separated list of identified programming languages, tools, frameworks, data structures, and technologies.
Some text will be very long, up to 1 million characters. Stay focused on the task at hand and reply with a comma separated list.
Do not include any other text, such as overviews, descriptions, or headers. Generally speaking, each item in the list should be one word long.
If there are no identifiable items, return an empty line.
If any text other than the list is generated, that output is considered incorrect.
You are to strictly follow the format of "item1, item2, item3" with no variations.
Examples:

Input:
Text: "Our project uses Python for scripting, Docker for containerization, and React for the frontend. We also utilize Redis for caching and PostgreSQL for the database."

Output:
Python, Docker, React, Redis, PostgreSQL

Input:
Text: "The application is built with Ruby on Rails, and it communicates with a MongoDB database. Jenkins is used for CI/CD, and we deploy everything to AWS."

Output:
Ruby on Rails, MongoDB, Jenkins, AWS

Input:
Text: "In this tutorial, we’ll be working with Java, Maven for dependency management, and Spring Boot for building the application. We also make use of Apache Kafka for messaging."

Output:
Java, Maven, Spring Boot, Apache Kafka

Input:
Text: "The web app integrates with the Stripe API for payments, uses Webpack for bundling, and is written primarily in JavaScript."

Output:
Stripe API, Webpack, JavaScript

Input:
Text: "This project uses Go for backend development, Redis for caching, and Kubernetes for orchestration."

Output:
Go, Redis, Kubernetes

DO NOT HALLUCINATE: Do not ever respond with a tool, technology, framework, datastructure, etc that does not exist in the user-provided content.
`;

const MODEL_ID = "llama3.1";

function getTextContent(html: string) {
  const purified = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style", "script", "svg"],
    FORBID_ATTR: ["style"],
  });
  console.log(purified);
  return purified;
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
