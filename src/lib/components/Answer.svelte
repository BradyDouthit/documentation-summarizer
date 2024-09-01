<script>
  export let answer;
</script>

<pre id="llm-answer">{answer}</pre>

<style>
  pre {
    margin: 0;
  }

  #llm-answer {
    width: 80%;
    padding: 12px;
    text-wrap: pretty;
    flex-grow: 1;
  }
</style>
