# Documentation Summarizer
Built with SvelteKit and Ollama, Documentation Summarizer is a side project I’ve built to explore new technologies and create a tool that’s genuinely useful for developers. It takes a URL, fetches the relevant page, strips out certain parts of the HTML to reduce token count, and provides a concise summary focusing on the most important details. This has been a great opportunity to dive into Retrieval Augmented Generation (RAG) and refine my understanding of system prompting with LLaMA models. I'm sharing this project in the hopes that it might be helpful to others or spark some discussions.

# Getting Started
Prerequisites
To run Documentation Summarizer, you’ll need the following:

- Node.js
- npm
- Ollama (for interacting with the language model)

# Installation
Clone the repository and install the necessary dependencies:

``` bash
git clone https://github.com/BradyDouthit/documentation-summarizer.git
cd documentation-summarizer
npm install
```

Ensure that you have Ollama installed and set up, as it’s used to power the LLaMA model for generating the summaries.

# Running the Application
To start the app, simply run:

``` bash
npm run dev
```

It will launch a local development server at http://localhost:5173, where you can interact with the Documentation Summarizer.

# How It Works
Documentation Summarizer is designed to provide quick, relevant summaries of developer documentation based on user input. Here’s a brief overview of the user experience:

1. Ask a Question: The app presents a text box where you can enter your question. You’re encouraged to provide a URL to relevant documentation for more accurate results.
2. Submit: After typing your question and (optionally) providing a URL, hit "Submit." The app will fetch the documentation from the URL and use it as a reference to answer your question.
3. Context-Aware Responses:  
   a. With a URL: If a URL is provided and it contains relevant developer content, the model will base its response on that documentation, ensuring a factual and precise answer.  
   b. Without a URL: If no URL is provided, the model will do its best to answer the question based on its knowledge. However, it will suggest that you provide a URL to improve the accuracy of future responses.  
   c. Handling Irrelevant Content: If the fetched content from the URL is not relevant to technical documentation, the model will inform you and prompt you to ask something more technical or provide a more suitable reference.

The app implements Retrieval Augmented Generation (RAG) to ensure that the summaries and information it provides are grounded in the actual document fetched from the URL. Instead of relying solely on pre-trained knowledge, the model is fed with data based on what the user deems relevant for the question, which allows it to give more accurate, context-specific responses.

**Note:** The purpose of this project isn’t to create the best or most beautiful UI out there. While it’s (mostly) functional, it could definitely use some polish from a design perspective. The focus has primarily been on making the backend work well and improving the experience of fetching and summarizing technical content. It also is a project I only work on a little in between work, life, and other passion projects.


## System Prompting
The interaction with LLMs is directed by a specialized system prompt that is meant controls the model’s behavior. Here’s a breakdown of the prompt:

The model is instructed to respond only to technical questions related to developer documentation, programming languages, and tools.
If provided with references (via XML tags), the model sources information strictly from those references and cites them without improvisation.
If the reference data is missing, the model does its best to answer but indicates that the response would be more accurate with additional documentation.
The model avoids any mention of the internal reference tags, keeping the process seamless and focused for the user.
This strict guidance helps ensure that the model’s responses remain relevant and grounded in the provided documentation. It won’t answer off-topic questions, and it will always refer to the specific documentation when available.

You can view the full system prompt at [system-prompt.txt](https://github.com/BradyDouthit/documentation-summarizer/blob/main/src/routes/api/scrape/system-prompt.txt)

# Why I Built This
Documentation Summarizer began as a way for me to challenge myself in experiment with LLM's, system prompts, RAG, and learning a new frontend framework (Svelte). It's not perfect, but it’s been a great learning experience.
