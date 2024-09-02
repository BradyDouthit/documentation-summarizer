<script>
  import Answer from "$lib/components/Answer.svelte";
  import SummarizationForm from "$lib/components/SummarizationForm.svelte";
  export const URL_FORM = "url-form";
  let answer = {};
</script>

<main>
  <div>
    <SummarizationForm bind:answer />
  </div>
  <Answer bind:answer />
</main>
<svelte:head>
  <title>SyntaxClarity</title>
</svelte:head>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Fira+Code:wght@400&display=swap");

  :root {
    --primary-color: #8ab4f8; /* A cool, soft blue */
    --primary-color-dark: #5c91e8; /* A slightly darker blue for contrast */
    --accent-color: #90caf9; /* A light, airy blue for accents */
    --background-color: #121212; /* A very dark gray, almost black, for the background */
    --text-color: #e0e0e0; /* A light gray for primary text */
    --text-color-dark: #121212; /* a dark gray */
    --text-color-light: #ffffff; /* Pure white for text on dark elements */
    --border-color: #333333; /* A dark gray for borders and dividers */
    --shadow-color: rgba(0, 0, 0, 0.6); /* A darker shadow for more depth */
    --border-radius: 2px;
    --error-color: #e57373;
  }

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

    font-family: "Inter", sans-serif;
    color: var(--text-color);
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: auto;

    background-color: var(--background-color);
    color: var(--text-color);
  }
</style>
