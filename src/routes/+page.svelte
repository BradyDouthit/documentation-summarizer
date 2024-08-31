<script>
  let url = "";
  export const URL_FORM = "url-form";

  function handleSubmit(event) {
    console.log(url);
  }
</script>

<main>
  <h1>Document Summarizer</h1>
  <div>
    <form on:submit={handleSubmit} id={URL_FORM}>
      <label for="url">URL to summarize:</label>
      <input
        id="url"
        type="text"
        placeholder="https://go.dev/"
        bind:value={url}
      />
      <button type="submit">Search</button>
    </form>
  </div>
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
  }

  h1 {
    width: fit-content;
    height: fit-content;
    margin: 0;
  }

  #url-form {
    display: flex;
    flex-direction: column;
  }
</style>
