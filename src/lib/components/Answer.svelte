<script>
  export let answer;
  let info = "";
  let warning = "";
  let error = "";

  $: {
    info = answer.info;
    warning = answer.warning;
    error = answer.error;
  }
</script>

<section id="full-answer-wrapper">
  {#if error}
    <pre class="error summary">{error}</pre>
  {/if}

  {#if warning}
    <pre class="warning summary">{warning}</pre>
  {/if}

  {#if info}
    <pre class="info summary">{info}</pre>
  {/if}

  {#if !error && warning && info}
    <h3 id="get-started">
      Enter a URL to get a quick summary of developer documentation, including
      languages, keywords, and key insights. Your session context is saved as
      you explore multiple docs and ask questions.
    </h3>
  {/if}
</section>

<style>
  pre {
    text-wrap: pretty;
  }

  #full-answer-wrapper {
    width: 80%;
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .summary {
    margin-top: 20px;
    line-height: 1.6;
    padding: 15px;
    border-radius: var(--border-radius);

    background-color: #1a1a1a;
    border-left: 5px solid var(--primary-color);
  }

  .summary.warning {
    border-color: var(--warning-color);
  }

  .summary.error {
    border-color: var(--error-color);
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
