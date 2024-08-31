<script>
  export const URL_FORM = "url-form";
  let url = "";
  let answer = "";

  async function handleSubmit() {
    try {
      const resp = await fetch(`/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await resp.json();
      answer = body.answer;
      console.log(body);
    } catch (error) {
      console.log("could not get url");
    }
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
        placeholder="https://pkg.go.dev/std"
        bind:value={url}
      />
      <button type="submit">Search</button>
    </form>
  </div>
  <pre id="llm-answer">{answer}</pre>
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

  pre {
    margin: 0;
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

  #url-form {
    display: flex;
    flex-direction: column;
  }

  #llm-answer {
    width: 80%;
    padding: 12px;
    text-wrap: pretty;
    flex-grow: 1;
  }
</style>
