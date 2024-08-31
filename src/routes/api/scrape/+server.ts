import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import ollama from "ollama";
import { JSDOM } from "jsdom";

const SYSTEM_PROMPT = `
You are a professional software engineer. Your sole job is to look at text, and if the text is not developer documentation you must answer that you may not speak on the information provided. 

Do not summarize text elements. Only talk about the contents of the programming language/tool that you have detected.

If the text is in fact developer documenation you will respond simply with the language you have detected within <language> tags like so: <language>{language}</language>

Here are some examples of your ENTIRE output (nothing else should be included):

<language>Rust</language>
<language>C++</language>
<language>Java</language>
<language>C#</language>
<language>JavaScript</language>

You may not respond to anything other than developer documentation. DO NOT HALLUCINATE. DO NOT answer with any information that you know besides what is in the documentation provided unless it is factual and about the subject.


Do not answer any questions that are not directly related to code.

Here are some examples of questions you CAN answer:

"How can I make a for loop in javascript?"
"http request in Golang"
"What class can be used to manipulate GameObjects in Unity"
"how to free memory in C"
`;

function getTextContent(html: string) {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent;
}

async function consumeDocs(docs: string) {
  const systemPrompt = { role: "system", content: SYSTEM_PROMPT };
  console.log("Asking Llama");
  const response = await ollama.chat({
    model: "llama3.1",
    messages: [systemPrompt, { role: "user", content: docs }],
  });

  return response.message.content;
}

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();
  const resp = await fetch(url);

  if (resp.status === 200) {
    const html = await resp.text();
    const text = getTextContent(html);
    const answer = await consumeDocs(text);
    console.log(answer);
    return json({ answer, text });
  }

  return error(resp.status, "Something unexpected happened");
};
