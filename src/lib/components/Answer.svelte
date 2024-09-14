<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import "highlight.js/styles/tokyo-night-dark.min.css";
  import CodeRenderer from "./CodeRenderer.svelte";

  export let answer;
  export let source = "";

  $: {
    source = answer.answer;
  }
</script>

<section id="full-answer-wrapper">
  {#if source}
    <div id="summary">
      <SvelteMarkdown
        renderers={{ code: CodeRenderer }}
        source={answer.answer}
      />
    </div>
  {/if}

  {#if !source}
    <h3 id="get-started">
      Enter a URL to get a quick summary of developer documentation, including
      languages, keywords, and key insights. Your session context is saved as
      you explore multiple docs and ask follow up questions.
    </h3>
  {/if}
</section>

<style>
  #full-answer-wrapper {
    width: 80%;
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  #summary {
    margin-top: 20px;
    line-height: 1.6;
    padding: 15px;
    border-radius: var(--border-radius);
    text-wrap: pretty;

    background-color: #1a1a1a;
    border-left: 5px solid var(--primary-color);
  }

  #get-started {
    text-align: center;
    color: #b0b0b0;
    text-align: center;
    max-width: 800px;
    line-height: 1.5;
    align-self: center;
    margin: auto auto;
  }
</style>
