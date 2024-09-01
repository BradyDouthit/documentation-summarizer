<script>
  export let answer;
</script>

<div id="full-answer-wrapper">
  {#if Object.entries(answer).length > 0}
    <pre>{answer.topic}</pre>
    <pre>{answer.languages}</pre>
    <pre>{answer.keywords}</pre>
    <pre>{answer.summary}</pre>
  {/if}
</div>

<style>
  pre {
    margin: 12px 0px;
    text-wrap: pretty;
  }

  #full-answer-wrapper {
    width: 80%;
    padding: 12px;
    flex-grow: 1;
  }
</style>
