<script>
  import Answer from "$lib/components/Answer.svelte";
  import SummarizationForm from "$lib/components/SummarizationForm.svelte";
  export const URL_FORM = "url-form";
  let answer = {};
</script>

<main>
  <h1>Documentation Summarizer</h1>
  <div>
    <SummarizationForm bind:answer />
  </div>
  <Answer bind:answer />
</main>

<style>
  :global(html) {
    width: 100%;
    height: 100%;
  }
  :global(body) {
    margin: 0;
    padding: 0;

    min-width: 100%;
    width: 100%;
    max-width: 100%;

    min-height: 100%;
    height: 100%;
    max-height: 100%;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  h1 {
    width: fit-content;
    height: fit-content;
    margin: 0;
  }
</style>
